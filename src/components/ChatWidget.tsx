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
    text: `Podstawą skutecznej redukcji jest wygenerowanie deficytu kalorycznego, stymulacja metabolizmu oraz ochrona masy mięśniowej. Przygotowałem dla Ciebie kompleksowy zestaw oparty na potwierdzonych substancjach:

1. **Spalacz Redox Hardcore** – Oparty na badaniach Sinetrol® oraz kofeinie. Silnie wspiera termogenezę.
2. **L-Carnitine Strong** – Bez stymulantów, idealna pod sesje cardio. Wspomaga transport wolnych kwasów tłuszczowych do mitochondriów.
3. **Izolat WPI** – Najczystsze białko. Tłumi apetyt i chroni mięśnie na ujemnym bilansie, bez zbędnych węglowodanów.`,
    productIds: ['redoxHardcore', 'lCarnitine', 'wpi'],
    followUps: [
      { emoji: '💊', label: 'Czy spalacze są bezpieczne?' },
      { emoji: '⚖️', label: 'Spalacz vs L-Karnityna?' },
      { emoji: '☕', label: 'Kawa a spalacz tłuszczu?' },
    ],
  },
  '🧬 Kolagen na stawy': {
    text: `Kolagen (typ I i III) to podstawa tkanki łącznej. Według najnowszych wytycznych najlepsze efekty daje połączenie go z witaminą C, a przy silnym dyskomfortie – dodanie siarki organicznej i kwasów Omega-3. Oto rekomendowany zestaw:

1. **Collagen Premium** – Duża dawka hydrolizowanego kolagenu z obowiązkowym dodatkiem witaminy C dla lepszej syntezy.
2. **Glukozamina + Chondroityna + MSM** – Potężny złoty standard w regeneracji i łagodzeniu dyskomfortu chrząstki.
3. **Omega 3 Strong** – Kwasy EPA/DHA słyną z silnych właściwości wspierających stany zapalne.`,
    productIds: ['collagenPremium', 'glucosamineComplex', 'omega3'],
    followUps: [
      { emoji: '⏱️', label: 'Kiedy brać kolagen?' },
      { emoji: '🧪', label: 'Co to jest MSM?' },
    ],
  },
  '💊 Czy spalacze są bezpieczne?': {
    text: 'Tak, jeśli stosujesz je zgodnie z zaleceniami producenta i nie masz przeciwwskazań zdrowotnych (jak nadciśnienie czy choroby serca). Produkty SFD opierają się na legalnych, przebadanych substancjach roślinnych i kofeinie.',
    followUps: [],
  },
  '⚖️ Spalacz vs L-Karnityna?': {
    text: 'Działają na innej płaszczyźnie, dlatego świetnie się uzupełniają!\n\n**Spalacz (np. Redox)** przyspiesza termogenezę (podnosi temperaturę ciała) i mocno pobudza do działania.\n**L-Karnityna** nie pobudza (nie ma kofeiny), ale działa jak "transporter" – chwyta uwolnione kwasy tłuszczowe i przenosi je do mitochondriów, gdzie są zamieniane na energię (szczególnie podczas treningu cardio).',
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
      if (
        invocation.toolName === 'recommend_products' &&
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
              if (product) found.push(product);
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

  const {
    messages,
    sendMessage,
    setMessages,
    status,
  } = useChat({
    api: '/api/chat',
  });

  const isLoading = status === 'submitted' || status === 'streaming';

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
              ? 'fixed inset-4 sm:inset-10 z-[999] bg-white rounded-2xl shadow-2xl border border-slate-200 flex overflow-hidden animate-fade-in'
              : `fixed bottom-[90px] right-4 w-[400px] max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-[999] flex flex-col overflow-hidden ${
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
            {messages.length === 0 && (
              <div className="flex gap-3 max-w-[85%] animate-fade-up">
                <div className="w-8 h-8 rounded-full bg-sfd-gradient flex items-center justify-center text-white text-xs shrink-0 self-end mb-1">
                  <i className="fa-solid fa-robot" />
                </div>
                <div className="bg-white rounded-2xl rounded-bl-none p-3.5 shadow-xs border border-slate-100 text-slate-800 text-sm">
                  <p className="font-semibold text-sfd-blue text-xs uppercase tracking-wider mb-1">
                    Konsultant SFD
                  </p>
                  Cześć! Jestem Twoim wirtualnym konsultantem SFD. Pomogę Ci
                  dobrać odpowiednie suplementy, dietetyczne słodkości lub
                  ułożyć szybki koszyk zakupowy.
                  <br />
                  <br />
                  <strong>W czym mogę Ci dzisiaj pomóc?</strong>
                </div>
              </div>
            )}

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
              const textContent = getTextContent(msg);
              const recommendedProducts = extractProductsFromParts(msg);

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
          <CartDrawer isOpen={true} onClose={() => {}} isEmbedded={true} />
        )}
        </div>
      )}

      {/* ─── Cart Drawer Overlay (Only when not expanded) ─── */}
      {!isExpanded && <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
