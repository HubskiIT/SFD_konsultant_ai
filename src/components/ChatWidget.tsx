// @ts-nocheck
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useChat, type UIMessage as Message } from '@ai-sdk/react';
import { useCartStore } from '@/stores/cart-store';
import { products, type Product } from '@/data/products';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';

/* ─── Sugestie szybkie i statyczne ścieżki (Cost-Saving) ─── */
const INITIAL_SUGGESTIONS = [
  { emoji: '🔥', label: 'Redukcja tkanki tłuszczowej' },
  { emoji: '🧬', label: 'Kolagen na stawy' },
];

const STATIC_RESPONSES: Record<string, { text: string; productIds?: string[]; followUps: { emoji: string; label: string }[] }> = {
  '🔥 Redukcja tkanki tłuszczowej': {
    text: `Przygotowałem sprawdzony zestaw wspierający deficyt kaloryczny:

1. Spalacz Redox – Silna termogeneza i energia.
2. L-Carnitine – Transport tłuszczu, idealna pod cardio.
3. Izolat WPI – Ochrona mięśni i sytość bez węglowodanów.`,
    productIds: ['redoxHardcore', 'lCarnitine', 'wpi'],
    followUps: [
      { emoji: '🏃', label: 'Jakie suple na start?' },
      { emoji: '💻', label: 'Spalanie za biurkiem?' },
      { emoji: '🔥', label: 'Spalacz łagodny czy mocny?' },
      { emoji: '🍩', label: 'Apetyt na słodycze?' },
      { emoji: '🥛', label: 'WPC czy WPI na redukcji?' },
    ],
  },
  '🧬 Kolagen na stawy': {
    text: `Oto zestaw mocno wspierający regenerację aparatu ruchu oraz zdrową skórę i włosy:

1. Collarose Fish – Kolagen rybi z peptydami Verisol (lepiej przyswajalny).
2. Glukozamina + MSM – Łagodzi stany zapalne i dyskomfort.
3. Omega 3 Strong – Silne wsparcie przeciwzapalne.`,
    productIds: ['collaroseFish', 'glucosamineComplex', 'omega3'],
    followUps: [
      { emoji: '⏱️', label: 'Kiedy brać kolagen?' },
      { emoji: '🧪', label: 'Co to jest MSM?' },
    ],
  },
  '🏃 Jakie suple na start?': {
    text: 'Na sam początek nie potrzebujesz skomplikowanych spalaczy! Podstawa to dobre białko (np. Izolat WPI) do podbicia podaży w diecie i ochrony mięśni, oraz L-Karnityna, jeśli planujesz dużo spacerować lub robić lekkie cardio. Termogeniki zostawiamy na później.',
    followUps: [],
  },
  '💻 Spalanie za biurkiem?': {
    text: 'Przy siedzącym trybie życia kluczowa jest kontrola apetytu, ponieważ NEAT (spontaniczna aktywność) jest niemal zerowa. Świetnie sprawdzi się delikatny termogenik bez ogromnej dawki kofeiny, a także pyszne odżywki białkowe, które zablokują chęć na podjadanie.',
    followUps: [],
  },
  '🔥 Spalacz łagodny czy mocny?': {
    text: 'Jeśli to Twoja pierwsza redukcja lub jesteś wrażliwy na mocną kawę – koniecznie zacznij od łagodnego spalacza (lipotropowego) lub L-Karnityny. Wersje "Hardcore" zostaw sobie na sam koniec odchudzania, gdy waga stanie w miejscu i będziesz potrzebował mocnego bodźca.',
    followUps: [],
  },
  '🍩 Apetyt na słodycze?': {
    text: 'To najczęstszy powód porażki na diecie! Ratunkiem są pyszne dżemy zero kalorii (np. z linii FRULOVE), odżywki białkowe o smakach słodyczy (skutecznie "zabijają" apetyt) oraz suplementacja Chromem, który stabilizuje poziom cukru we krwi i fizycznie gasi chęć na słodkie.',
    followUps: [],
  },
  '🥛 WPC czy WPI na redukcji?': {
    text: 'Zdecydowanie Izolat (WPI)! Jest pozbawiony niemal całego tłuszczu i węglowodanów (w tym laktozy). Szybciej się wchłania i dostarcza maksimum czystego białka – a w deficycie kalorycznym liczy się każda zaoszczędzona kaloria z tłuszczów.',
    followUps: [],
  },
  '☕ Kawa a spalacz tłuszczu?': {
    text: 'Większość silnych spalaczy zawiera już dużą dawkę kofeiny. Łączenie ich z mocną kawą lub przedtreningówką w tym samym czasie może prowadzić do przestymulowania układu nerwowego. Zalecamy zachować kilkugodzinny odstęp między porcją spalacza a filiżanką kawy.',
    followUps: [],
  },
  '⏱️ Kiedy brać kolagen?': {
    text: 'Kolagen najlepiej przyjmować na czczo (około 30 minut przed posiłkiem), koniecznie w towarzystwie witaminy C dla maksymalnej przyswajalności.',
    followUps: [],
  },
  '🧪 Co to jest MSM?': {
    text: 'MSM (metylosulfonylometan) to organiczny związek siarki. Według badań pomaga redukować stany zapalne stawów i obrzęki, będąc doskonałym uzupełnieniem terapii kolagenem.',
    followUps: [],
  },
};

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
        <i className="fa-solid fa-robot" />
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
      
      if (
        validTools.includes(invocation.toolName) &&
        invocation.state === 'result'
      ) {
        const result = invocation.result;
        if (Array.isArray(result)) {
          for (const item of result) {
            const productId = item?.productId || item?.id;
            if (productId) {
              // Try to find in our product database
              const product = Object.values(products).find(
                (p) => p.id === productId
              );
              // Only add if not already in the list to avoid duplicates, and limit to max 3
              if (product && !found.some(p => p.id === product.id) && found.length < 3) {
                found.push(product);
              }
            }
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Create assistant message from JSON response
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || '',
      };

      // Handle tool invocations to display product cards correctly or add to cart
      if (data.toolInvocations && data.toolInvocations.length > 0) {
        botMsg.parts = [];
        if (data.text) {
          botMsg.parts.push({ type: 'text', text: data.text });
        }
        for (const ti of data.toolInvocations) {
          // Intercept add_to_cart and physically add the item!
          if (ti.toolName === 'add_to_cart') {
            const product = Object.values(products).find(p => p.id === ti.args.productId);
            if (product) {
              const variant = product.variants.find(v => v.label.includes(ti.args.variantLabel) || ti.args.variantLabel.includes(v.label)) || product.variants[0];
              addItem({
                productId: product.id,
                name: product.name,
                variant: variant.label,
                price: variant.price,
                imageUrl: product.imageUrl,
                shopUrl: product.shopUrl,
              });
              // Show toast notification
              setToastMsg(`Sztuczna Inteligencja dodała ${product.name} do koszyka!`);
              setToastVisible(true);
              setTimeout(() => setToastVisible(false), 3500);
            }
          } else {
            // Otherwise, render as a tool card
            botMsg.parts.push({
              type: 'tool-invocation',
              toolInvocation: ti,
            });
          }
        }
      }

      setMessages([...newMessages, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const processInput = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const staticResponse = STATIC_RESPONSES[trimmed];
    if (staticResponse) {
      // Mock user message
      const mockUserMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
      
      // Mock assistant message
      const mockBotMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: staticResponse.text 
      };

      // Add mocked tool result if productIds exist
      if (staticResponse.productIds && staticResponse.productIds.length > 0) {
        mockBotMsg.parts = [
          { type: 'text', text: staticResponse.text },
          { 
            type: 'tool-invocation', 
            toolInvocation: {
              state: 'result', 
              toolCallId: 'mock-' + Date.now(), 
              toolName: 'recommend_products',
              args: { productIds: staticResponse.productIds },
              result: staticResponse.productIds.map(id => Object.values(products).find(p => p.id === id)).filter(Boolean)
            }
          }
        ];
      }

      setMessages([...messages, mockUserMsg, mockBotMsg]);
      
      // Update quick suggestions to follow-ups
      if (staticResponse.followUps.length > 0) {
        setQuickSuggestions(staticResponse.followUps);
      } else {
        setQuickSuggestions(INITIAL_SUGGESTIONS);
      }
    } else {
      // Normal API call
      sendMessage({ role: 'user', content: trimmed });
      setQuickSuggestions(INITIAL_SUGGESTIONS); // reset on custom input
    }
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
    }
  }, [isOpen, handleClose]);

  const count = itemCount();

  return (
    <>
      {/* ─── FAB Button ─────────────────────────────────── */}
      <button
        onClick={handleToggle}
        className={`fixed bottom-5 right-5 z-[1000] w-[62px] h-[62px] rounded-full bg-sfd-gradient text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
          !isOpen ? 'animate-fab-pulse' : ''
        }`}
        aria-label="Otwórz konsultanta AI"
      >
        {isOpen ? (
          <i className="fa-solid fa-xmark text-xl" />
        ) : (
          <i className="fa-solid fa-robot text-xl" />
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
              : `fixed bottom-[90px] left-4 right-4 sm:left-auto sm:w-[460px] max-h-[600px] h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[999] flex flex-col overflow-hidden ${
                  isClosing ? 'animate-slide-out-right' : 'animate-slide-in-right'
                }`
          }
          style={!isExpanded ? { maxWidth: 'calc(100vw - 32px)' } : {}}
        >
          {/* Chat Column */}
          <div className="flex-1 flex flex-col min-w-0 relative h-full">
            {/* Header */}
            <div className="bg-sfd-gradient text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/20">
                  <i className="fa-solid fa-robot text-lg" />
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
                <i className="fa-solid fa-robot" />
              </div>
              <div className="bg-white rounded-2xl rounded-bl-none p-3.5 shadow-xs border border-slate-100 text-slate-800 text-sm">
                <p className="font-semibold text-sfd-blue text-xs uppercase tracking-wider mb-1">
                  Konsultant SFD
                </p>
                Cześć! Jestem wirtualnym ekspertem ds. suplementacji sklepu SFD. Z przyjemnością doradzę Ci w wyborze najlepszych odżywek, wsparciu dla Twoich celów treningowych, a następnie przygotuję dla Ciebie gotowy koszyk zakupowy.
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
                const listIndex = textContent.search(/\n\s*(?:1\.|\-|\*)\s+/);
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
                    <i className="fa-solid fa-robot" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-none p-3.5 shadow-xs border border-slate-100 text-slate-800 text-sm w-full">
                    <p className="font-semibold text-sfd-blue text-xs uppercase tracking-wider mb-1">
                      Konsultant SFD
                    </p>

                    {/* Render text content with line breaks */}
                    {textContent && (
                      <div className="whitespace-pre-wrap">{textContent}</div>
                    )}

                    {/* Render product cards inline */}
                    {recommendedProducts.length > 0 && (
                      <div className="mt-3 space-y-3">
                        {recommendedProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={(productId, variantIndex) =>
                              handleAddToCart(product, variantIndex)
                            }
                          />
                        ))}
                      </div>
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
            <div className="flex flex-wrap gap-1.5">
              {quickSuggestions.map((s) => {
                const fullText = `${s.emoji} ${s.label}`;
                return (
                  <button
                    key={s.label}
                    onClick={() => handleSuggestion(fullText)}
                    disabled={isLoading}
                    className="bg-slate-50 hover:bg-sfd-blue hover:text-white text-slate-700 text-[11px] px-2.5 py-1.5 rounded-lg transition-all font-medium border border-slate-200 disabled:opacity-50"
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
                placeholder="Wpisz np. 'szukam dżemów', 'chcę schudnąć'..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sfd-blue focus:border-transparent transition-all placeholder:text-slate-400"
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
