// @ts-nocheck
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { type UIMessage as Message } from '@ai-sdk/react';
import { useCartStore } from '@/stores/cart-store';
import { products, type Product } from '@/data/products';
import ProductCard from './ProductCard';
import ProductCarousel from './ProductCarousel';
import CartDrawer from './CartDrawer';

/* ─── Sugestie szybkie i statyczne ścieżki (Cost-Saving) ─── */
const INITIAL_SUGGESTIONS = [
  { emoji: '🔥', label: 'Chcę schudnąć' },
  { emoji: '💪', label: 'Jaki spalacz?' },
  { emoji: '⚡', label: 'Zestaw redukcja' },
];

// Usunięto STATIC_RESPONSES, aby wszystko szło przez AI i wyświetlało produkty.
/* ─── Toast notification ───────────────────────────────── */
function Toast({
  message,
  visible,
}: {
  message: string;
  visible: boolean;
}) {
  if (!visible) return null;
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg animate-toast-in z-50 whitespace-nowrap">
      <i className="fa-solid fa-check mr-1.5" />
      {message}
    </div>
  );
}

/* ─── Typing Indicator ─────────────────────────────────── */
function TypingIndicator() {
  return (
    <div className="flex gap-3 max-w-[85%]">
      <div className="w-8 h-8 rounded-full bg-sfd-gradient flex items-center justify-center text-white text-xs shrink-0 self-end mb-1">
        <i className="fa-solid fa-dumbbell" />
      </div>
      <div className="bg-white rounded-2xl rounded-bl-none p-3.5 shadow-xs border border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 rounded-full bg-slate-400 animate-dot-bounce"
              style={{ animationDelay: '0s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-400 animate-dot-bounce"
              style={{ animationDelay: '0.15s' }}
            />
            <span
              className="w-2 h-2 rounded-full bg-slate-400 animate-dot-bounce"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
          <span>Konsultant analizuje ofertę...</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Helpers: extract products from tool call results ── */
function extractProductsFromParts(message: Message): Product[] {
  const found: Product[] = [];
  if (!message.parts) return found;

  for (const part of message.parts) {
    if (part.type === 'tool-invocation' && part.toolInvocation) {
      const invocation = part.toolInvocation;
      const validTools = ['recommend_products', 'search_products', 'get_joint_products', 'get_safe_products'];

      if (!validTools.includes(invocation.toolName)) continue;

      // Obsługujemy zarówno format z state='result' jak i bezpośredni format z args
      const result = invocation.result;
      const args = invocation.args;

      // Jeśli mamy result z tablicą produktów
      if (Array.isArray(result)) {
        for (const item of result) {
          const productId = item?.productId || item?.id;
          if (productId) {
            const product = products.find((p) => p.id === productId);
            if (product && !found.some(p => p.id === product.id) && found.length < 6) {
              found.push(product);
            }
          }
        }
      }

      // Jeśli mamy args z tablicą productIds (format naszego backendu)
      if (found.length === 0 && args?.productIds && Array.isArray(args.productIds)) {
        for (const productId of args.productIds) {
          const product = products.find((p) => p.id === productId);
          if (product && !found.some(p => p.id === product.id) && found.length < 6) {
            found.push(product);
          }
        }
      }
    }
  }
  return found;
}

function getTextContent(message: Message): string {
  if (!message.parts) return message.content;

  const textParts = message.parts
    .filter((p) => p.type === 'text')
    .map((p) => (p as { type: 'text'; text: string }).text)
    .join('');

  return textParts || message.content;
}

/* ─── Main ChatWidget Component ────────────────────────── */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Dymek-zachęta obok zwiniętego FAB (zanim klient otworzy czat)
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const itemCount = useCartStore((s) => s.itemCount);

  const [input, setInput] = useState('');
  const [quickSuggestions, setQuickSuggestions] = useState(INITIAL_SUGGESTIONS);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (newMsg: { role: 'user'; content: string }) => {
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: newMsg.content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const botId = (Date.now() + 1).toString();
    let accText = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Network error');
      }

      // Odczyt SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let toolInvocations: unknown[] = [];

      const botMsg: Message = { id: botId, role: 'assistant', content: '' };
      setMessages([...newMessages, botMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const raw = trimmed.slice(5).trim();
          if (raw === '[DONE]') break;
          try {
            const event = JSON.parse(raw);
            if (event.type === 'tools') {
              toolInvocations = event.toolInvocations ?? [];
            } else if (event.type === 'token') {
              accText += event.token;
              setMessages(prev => prev.map(m =>
                m.id === botId ? { ...m, content: accText } : m
              ));
            }
          } catch { /* ignoruj bledne chunki */ }
        }
      }

      // Po zakonczeniu streamu — przetworz toolInvocations (koszyk, karty)
      const data = { text: accText, toolInvocations };
      const finalBotMsg: Message = {
        id: botId,
        role: 'assistant',
        content: accText,
      };

      if (data.toolInvocations && (data.toolInvocations as unknown[]).length > 0) {
        finalBotMsg.parts = [];
        if (accText) {
          finalBotMsg.parts.push({ type: 'text', text: accText });
        }
        const resolveVariant = (product: Product, variantLabel?: string) => {
          if (!variantLabel || product.variants.length === 1) return product.variants[0];
          const want = variantLabel.toLowerCase().trim();
          const commonPrefix = (a: string, b: string) => {
            let n = 0;
            while (n < a.length && n < b.length && a[n] === b[n]) n++;
            return n;
          };
          let best = product.variants[0];
          let bestScore = -1;
          for (const v of product.variants) {
            const label = v.label.toLowerCase();
            const score = label === want ? 999 : commonPrefix(label, want);
            if (score > bestScore) {
              bestScore = score;
              best = v;
            }
          }
          // Wymagaj sensownego dopasowania (>=3 znaki), inaczej pierwszy wariant
          return bestScore >= 3 ? best : product.variants[0];
        };

        // Pomocniczo: znajdź uid pozycji w koszyku po produkcie i wariancie
        const findCartUid = (productId: string, variantLabel: string) => {
          const product = products.find((p) => p.id === productId);
          if (!product) return undefined;
          const variant = resolveVariant(product, variantLabel);
          const match = useCartStore
            .getState()
            .items.find((i) => i.productId === productId && i.variant === variant.label);
          return match?.uid;
        };

        const fireToast = (msg: string) => {
          setToastMsg(msg);
          setToastVisible(true);
          setTimeout(() => setToastVisible(false), 3500);
        };

        for (const ti of data.toolInvocations as { toolName: string; args: Record<string, unknown>; toolCallId: string; result: unknown; state: string }[]) {
          // Intercept add_to_cart and physically add the item!
          if (ti.toolName === 'add_to_cart') {
            const product = products.find(p => p.id === ti.args.productId);
            if (product) {
              const variant = resolveVariant(product, ti.args.variantLabel);
              const qty = typeof ti.args.quantity === 'number' && ti.args.quantity > 0
                ? Math.floor(ti.args.quantity)
                : 1;
              addItem({
                productId: product.id,
                name: product.name,
                variant: variant.label,
                price: variant.price,
                imageUrl: product.imageUrl,
                shopUrl: product.shopUrl,
              }, qty);
              fireToast(
                qty > 1
                  ? `AI dodała ${qty}x ${product.name} do koszyka!`
                  : `AI dodała ${product.name} do koszyka!`
              );
            }
          } else if (ti.toolName === 'update_cart_quantity') {
            const product = products.find(p => p.id === ti.args.productId);
            const uid = findCartUid(ti.args.productId, ti.args.variantLabel);
            const qty = typeof ti.args.quantity === 'number' ? Math.max(0, Math.floor(ti.args.quantity)) : 1;
            if (uid) {
              updateQuantity(uid, qty);
              fireToast(
                qty === 0
                  ? `AI usunęła ${product?.name ?? 'produkt'} z koszyka.`
                  : `AI ustawiła ilość ${product?.name ?? 'produktu'} na ${qty} szt.`
              );
            } else if (product && qty > 0) {
              // Pozycji nie było w koszyku — potraktuj jak dodanie żądanej ilości
              const variant = resolveVariant(product, ti.args.variantLabel);
              addItem({
                productId: product.id,
                name: product.name,
                variant: variant.label,
                price: variant.price,
                imageUrl: product.imageUrl,
                shopUrl: product.shopUrl,
              }, qty);
              fireToast(`AI dodała ${qty}x ${product.name} do koszyka!`);
            }
          } else if (ti.toolName === 'remove_from_cart') {
            const product = products.find(p => p.id === ti.args.productId);
            const uid = findCartUid(ti.args.productId, ti.args.variantLabel);
            if (uid) {
              removeItem(uid);
              fireToast(`AI usunęła ${product?.name ?? 'produkt'} z koszyka.`);
            }
          } else {
            // Otherwise, render as a tool card
            finalBotMsg.parts!.push({
              type: 'tool-invocation',
              toolInvocation: ti,
            });
          }
        }
      }

      setMessages(prev => prev.map(m => m.id === botId ? finalBotMsg : m));
      setIsLoading(false);
      return;
    } catch (err) {
      console.error('Chat error:', err);
      // Jesli czesc odpowiedzi juz doszla, zachowaj ja zamiast kasowac do erroru.
      if (accText.trim()) {
        setMessages(prev => prev.map(m =>
          m.id === botId ? { ...m, content: accText } : m
        ));
      } else {
        setMessages([...newMessages, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Przepraszam, mam chwilowy problem z polaczeniem. Sprobuj ponownie za moment.',
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const processInput = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Normal API call
    sendMessage({ role: 'user', content: trimmed });
    setQuickSuggestions(INITIAL_SUGGESTIONS); // reset on custom input
  }, [messages, setMessages, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    processInput(input);
    setInput('');
  };

  /* Auto-scroll on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /* Dymek-zachęta: pierwszy raz po 2s, widoczny ~7s, potem wraca co 10s
     dopóki klient go nie zamknie (X) ani nie otworzy czatu. */
  useEffect(() => {
    if (teaserDismissed || isOpen) return;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;
    const cycle = (delay: number) => {
      showTimer = setTimeout(() => {
        setShowTeaser(true);
        hideTimer = setTimeout(() => {
          setShowTeaser(false);
          cycle(10000); // ponów po 10s jeśli nikt nie kliknął
        }, 7000);
      }, delay);
    };
    cycle(2000); // pierwszy raz po 2s
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [teaserDismissed, isOpen]);

  /* Toast helper */
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }, []);

  /* Handle add to cart from ProductCard */
  const handleAddToCart = useCallback(
    (product: Product, variantIndex: number) => {
      const variant = product.variants[variantIndex];
      addItem({
        productId: product.id,
        name: product.name,
        variant: variant.label,
        price: variant.price,
        imageUrl: product.imageUrl,
        shopUrl: product.shopUrl,
      });
      showToast(`${product.name} dodano do koszyka!`);
    },
    [addItem, showToast]
  );

  /* Quick suggestion handler */
  const handleSuggestion = useCallback(
    (text: string) => {
      processInput(text);
    },
    [processInput]
  );

  /* Reset chat */
  const handleReset = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  /* Close with animation */
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setIsCartOpen(false);
    }, 250);
  }, []);

  /* Toggle open */
  const handleToggle = useCallback(() => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
      setShowTeaser(false);
      setTeaserDismissed(true);
    }
  }, [isOpen, handleClose]);

  const count = itemCount();

  return (
    <>
      {/* ─── Dymek-zachęta (gdy czat zwinięty) ──────────── */}
      {!isOpen && showTeaser && (
        <div className="fixed right-[94px] z-[1000] animate-slide-in-right" style={{ bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))' }}>
          <div
            onClick={handleToggle}
            className="animate-teaser-float relative bg-white rounded-2xl rounded-br-none shadow-xl border border-slate-100 pl-3.5 pr-8 py-2.5 cursor-pointer hover:shadow-2xl transition-shadow"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
                setTeaserDismissed(true);
              }}
              className="absolute top-1.5 right-2 text-slate-300 hover:text-slate-500 text-xs leading-none"
              aria-label="Zamknij dymek"
            >
              <i className="fa-solid fa-xmark" />
            </button>
            <p className="text-[13px] font-bold text-slate-800 leading-snug whitespace-nowrap">
              Nie wiesz, co wybrać? 💪
            </p>
            <p className="text-[12px] text-slate-500 leading-snug mt-0.5 whitespace-nowrap">
              Dobiorę suplementy pod Twój cel w 30 sekund.
            </p>
          </div>
        </div>
      )}

      {/* ─── FAB Button — ukryty gdy czat otwarty (header ma już X) ── */}
      <button
        onClick={handleToggle}
        className={`fixed z-[1000] w-[62px] h-[62px] rounded-full bg-sfd-gradient text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 animate-fab-pulse ${
          isOpen ? 'hidden' : ''
        }`}
        style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))', right: '20px' }}
        aria-label="Otwórz konsultanta AI"
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-xl" />
        ) : (
          <i className="fa-solid fa-dumbbell text-xl" />
        )}

        {/* Cart badge on FAB */}
        {count > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-sfd-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-badge-pop">
            {count}
          </span>
        )}
      </button>

      {/* ─── Chat Panel ─────────────────────────────────── */}
      {isOpen && (
        <div
          className={
            isExpanded
              ? 'fixed inset-0 sm:inset-10 z-[999] bg-white sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 flex overflow-hidden animate-fade-in'
              : `fixed left-4 right-4 sm:left-auto sm:w-[460px] max-h-[760px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[999] flex flex-col overflow-hidden ${
                  isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
                }`
          }
          style={!isExpanded ? {
            maxWidth: 'calc(100vw - 32px)',
            bottom: 'calc(90px + env(safe-area-inset-bottom, 0px))',
            height: 'calc(100vh - 80px - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px))',
          } : {}}
        >
          {/* Chat Column */}
          <div className="flex-1 flex flex-col min-w-0 relative h-full">
            {/* Header */}
            <div className="bg-sfd-gradient text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/20">
                  <i className="fa-solid fa-dumbbell text-lg" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-sfd-navy" />
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-wide">
                  Konsultant SFD
                </h2>
                <p className="text-[11px] text-blue-200 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Gotowy do pomocy
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Cart toggle */}
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                title="Koszyk"
              >
                <i className="fa-solid fa-bag-shopping text-sm" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-sfd-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-badge-pop">
                    {count}
                  </span>
                )}
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                title="Wyczyść czat"
              >
                <i className="fa-solid fa-rotate-left text-sm" />
              </button>

              {/* Expand/Compress */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                title={isExpanded ? "Zmniejsz" : "Rozwiń na pełny ekran"}
              >
                <i className={`fa-solid ${isExpanded ? 'fa-compress' : 'fa-expand'} text-sm`} />
              </button>

              {/* Close */}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                title="Zamknij"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-[#f8fafc] min-h-[200px] relative"
          >
            {/* Welcome message */}
            {/* Welcome message (always visible) */}
            <div className="flex gap-3 max-w-[85%] animate-fade-up">
              <div className="w-8 h-8 rounded-full bg-sfd-gradient flex items-center justify-center text-white text-xs shrink-0 self-end mb-1">
                <i className="fa-solid fa-dumbbell" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none p-3.5 shadow-xs border border-slate-100 text-slate-800 text-sm">
                <p className="font-semibold text-sfd-blue text-xs uppercase tracking-wider mb-1">
                  Konsultant SFD
                </p>
                Cześć! 👋 Jestem Twoim osobistym <strong>Konsultantem SFD</strong>, ekspertem od suplementacji. Doradzę Ci pod Twój cel, wytłumaczę skład i od ręki przygotuję gotowy koszyk zakupowy.
                <br />
                <br />
                <strong>W czym mogę Ci dzisiaj pomóc?</strong>
              </div>
            </div>

            {/* Chat messages */}
            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div
                    key={msg.id}
                    className="flex gap-3 justify-end max-w-[85%] ml-auto animate-fade-up"
                  >
                    <div className="bg-sfd-gradient text-white rounded-2xl rounded-br-none p-3.5 shadow-sm text-sm">
                      {msg.content}
                    </div>
                  </div>
                );
              }

              // Assistant message
              let textContent = getTextContent(msg);
              const recommendedProducts = extractProductsFromParts(msg);

              // Forcefully hide redundant markdown lists if we are rendering product cards
              if (recommendedProducts.length > 0 && textContent) {
                const listIndex = textContent.search(/\n\s*(?:1\.|\-|\*|#{1,3})\s+/);
                if (listIndex !== -1) {
                  textContent = textContent.substring(0, listIndex).trim();
                }
              }

              return (
                <div
                  key={msg.id}
                  className="flex gap-3 max-w-[85%] animate-fade-up"
                >
                  <div className="w-8 h-8 rounded-full bg-sfd-gradient flex items-center justify-center text-white text-xs shrink-0 self-end mb-1">
                    <i className="fa-solid fa-dumbbell" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-none p-3.5 shadow-xs border border-slate-100 text-slate-800 text-sm w-full">
                    <p className="font-semibold text-sfd-blue text-xs uppercase tracking-wider mb-1">
                      Konsultant SFD
                    </p>

                    {/* Render text content with basic markdown (bold, italic, line breaks) */}
                    {textContent && (
                      <div className="leading-relaxed">
                        {textContent.split('\n').map((line, li) => {
                          if (!line.trim()) return <br key={li} />;
                          const parts: React.ReactNode[] = [];
                          const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
                          let last = 0, m;
                          while ((m = regex.exec(line)) !== null) {
                            if (m.index > last) parts.push(line.slice(last, m.index));
                            if (m[2]) parts.push(<strong key={m.index}>{m[2]}</strong>);
                            else if (m[3]) parts.push(<em key={m.index}>{m[3]}</em>);
                            last = m.index + m[0].length;
                          }
                          if (last < line.length) parts.push(line.slice(last));
                          return <p key={li} className="mb-1 last:mb-0">{parts}</p>;
                        })}
                      </div>
                    )}

                    {/* Render product cards inline */}
                    {recommendedProducts.length === 1 && (
                      <div className="mt-3">
                        <ProductCard
                          product={recommendedProducts[0]}
                          onAddToCart={(productId, variantIndex) =>
                            handleAddToCart(recommendedProducts[0], variantIndex)
                          }
                        />
                      </div>
                    )}

                    {/* Wiele produktow -> carousel ze strzalkami (czytelniej w malym oknie) */}
                    {recommendedProducts.length > 1 && (
                      <ProductCarousel
                        products={recommendedProducts}
                        onAddToCart={handleAddToCart}
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && <TypingIndicator />}

            {/* Toast */}
            <Toast message={toastMsg} visible={toastVisible} />

            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2.5 bg-white border-t border-slate-100 shrink-0">
            <p className="text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wide">
              Popularne pytania:
            </p>
            <div className="flex flex-nowrap gap-1.5">
              {quickSuggestions.map((s) => {
                const fullText = `${s.emoji} ${s.label}`;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(fullText)}
                    disabled={isLoading}
                    className="flex-1 bg-slate-50 hover:bg-sfd-blue hover:text-white text-slate-700 text-[11px] px-2 py-1.5 rounded-lg transition-all font-medium border border-slate-200 disabled:opacity-50 whitespace-nowrap"
                  >
                    {fullText}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input form */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input || ''}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Wpisz np. 'chcę schudnąć', 'jaki spalacz?'..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-sfd-blue focus:border-transparent transition-all placeholder:text-slate-400"
                style={{ fontSize: '16px' }}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !(input || '').trim()}
                className="bg-sfd-gradient-btn text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <i className="fa-solid fa-paper-plane text-xs" />
              </button>
            </form>
          </div>
        </div>

        {/* Cart Column (Embedded Mode) */}
        {isExpanded && (
          <div className="hidden lg:block h-full border-l border-slate-200">
            <CartDrawer isOpen={true} onClose={() => {}} isEmbedded={true} />
          </div>
        )}
        </div>
      )}

      {/* ─── Cart Drawer Overlay (Only when not expanded) ─── */}
      {!isExpanded && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
