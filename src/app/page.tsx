import ChatWidget from '@/components/ChatWidget';
import { products } from '@/data/products';

export default function Home() {
  return (
    <>
      {/* ─── Header Bar ──────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-sfd-gradient text-white px-3.5 py-1.5 rounded-lg font-black tracking-tighter text-2xl flex items-center justify-center shadow-sm">
                SFD
                <span className="text-[10px] font-semibold ml-1 text-blue-200">
                  AI
                </span>
              </div>
              <div className="hidden md:block">
                <span className="text-[10px] font-bold text-slate-400 block tracking-widest uppercase">
                  Sklep Suplementów
                </span>
                <span className="text-sm font-semibold text-slate-700 block -mt-0.5">
                  Wirtualny Doradca
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-medium border border-emerald-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              AI Konsultant aktywny
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <a
                href="https://sklep.sfd.pl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-sfd-blue transition-colors font-medium hidden sm:flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
                sklep.sfd.pl
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero / Info Card */}
        <div className="relative mb-10">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-8 md:p-10 overflow-hidden">
            {/* Decorative gradient blobs */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-sfd-blue/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sfd-accent/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-sfd-blue/10 text-sfd-blue text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <i className="fa-solid fa-microscope mr-1" />
                  Prototyp AI
                </span>
                <span className="bg-sfd-accent/10 text-sfd-accent text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Next.js + Vercel AI SDK
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">
                SFD Smart Shopping{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sfd-blue to-sfd-accent">
                  AI Agent
                </span>
              </h1>

              <p className="text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed mb-6">
                Inteligentny asystent zakupowy, który doradzi Ci najlepsze
                suplementy, odpowie na pytania o składniki i pomoże złożyć
                koszyk w kilka sekund.
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-sfd-blue/10 text-sfd-blue flex items-center justify-center">
                    <i className="fa-solid fa-robot text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Model AI
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      GPT-4o + Narzędzia
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <i className="fa-solid fa-bag-shopping text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Koszyk
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      Real-time Zustand
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <i className="fa-solid fa-paper-plane text-sm" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Streaming
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      Vercel AI SDK
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Product Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Przykładowe produkty
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Zapytaj konsultanta AI o dowolny z nich
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-wider">
              Demo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(products).map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-sfd-blue/30 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-full aspect-square mb-3 relative rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img src={product.imageUrl} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-[10px] font-semibold text-sfd-blue uppercase tracking-wider mb-0.5">{product.brand}</p>
                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 mb-3 flex-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                  <span className="text-sm font-bold text-sfd-blue">
                    {product.variants[0].price.toFixed(2).replace('.', ',')} zł
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 group-hover:bg-sfd-light group-hover:text-sfd-blue group-hover:border-sfd-blue/20 transition-all cursor-default">
                    <i className="fa-solid fa-robot mr-1" />
                    Zapytaj AI
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-sfd-gradient rounded-2xl p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="text-3xl mb-3">💬</div>
            <h2 className="text-xl font-bold mb-2">
              Kliknij przycisk czatu w prawym dolnym rogu
            </h2>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              Rozpocznij rozmowę z inteligentnym konsultantem SFD. Zapytaj o
              redukcję, suplementy, dżemy zero kalorii lub cokolwiek innego!
            </p>
          </div>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          &copy; 2026 SFD S.A. Wszystkie prawa zastrzeżone. Interaktywny
          prototyp AI Konsultanta.
        </div>
      </footer>

      {/* ─── Chat Widget ─────────────────────────────────── */}
      <ChatWidget />
    </>
  );
}
