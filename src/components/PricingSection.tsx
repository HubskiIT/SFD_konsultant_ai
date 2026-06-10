type FeatureItem = string | { text: string; addon: true };

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Doradca-Edukator',
    tagline: 'Wirtualny ekspert, który odciąża BOK i edukuje klientów.',
    accent: 'emerald',
    icon: 'fa-graduation-cap',
    inheritLabel: null,
    startup: [
      'Baza wiedzy o produktach (architektura RAG)',
      'Główny moduł językowy agenta',
      'Odpowiedzi o składy, alergeny, dawkowanie i dobór pod cel',
      'Kierowanie ruchu do właściwych kategorii sklepu',
      'Wielojęzyczność: obsługa klientów w języku polskim, angielskim i ukraińskim',
    ] as FeatureItem[],
    note: 'Bez integracji magazynu i koszyka: agent generuje linki do produktów.',
    monthly: [
      'Utrzymanie infrastruktury (monitoring backendu i bazy wektorowej)',
      'Aktualizacja bazy wiedzy RAG raz w miesiącu',
      'SLA: reakcja na błędy krytyczne do 24h roboczych',
    ] as FeatureItem[],
    example: '„Jakie białko przy nietolerancji laktozy?" → tłumaczy izolat vs koncentrat i wskazuje produkt.',
    highlighted: false,
  },
  {
    id: 'medium',
    name: 'Medium',
    subtitle: 'Doradca + Sprzedawca',
    tagline: 'Doświadczony sprzedawca, zna magazyn na żywo i domyka sprzedaż.',
    accent: 'blue',
    icon: 'fa-headset',
    inheritLabel: 'Wszystko z pakietu Basic, plus:',
    startup: [
      'Integracja API magazynu: stany, smaki, ceny i rabaty w czasie rzeczywistym',
      'Zoptymalizowane scenariusze sprzedażowe (cross-selling)',
      'Monitoring rozmów i „procesu myślowego" agenta (LangSmith)',
      'Kalkulator suplementacji: spersonalizowane dawkowanie na podstawie wagi, celu i planu treningowego',
      { text: 'Analiza zdjęcia etykiety (Vision AI): klient wysyła zdjęcie swojego suplementu, agent odczytuje skład i dobiera produkty SFD', addon: true },
    ] as FeatureItem[],
    note: null,
    monthly: [
      'Cotygodniowy audyt rozmów i optymalizacja pod porzucone konwersacje',
      'Dynamiczne zarządzanie asortymentem pod promocje i nowe smaki',
      'Tarcza bezpieczeństwa: blokada prób hakowania agenta',
      'SLA: reakcja do 24h roboczych',
    ] as FeatureItem[],
    example: '„Macie kreatynę w smaku pomarańczowym?" → sprawdza magazyn i proponuje dostępny zamiennik.',
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Autonomiczny Asystent E-commerce',
    tagline: 'Agent z „rękami", sam kompletuje koszyk i prowadzi do kasy.',
    accent: 'purple',
    icon: 'fa-rocket',
    inheritLabel: 'Wszystko z pakietów Basic i Medium, plus:',
    startup: [
      'Pełna automatyzacja koszyka przez API (dodawanie, zmiana ilości, usuwanie)',
      'Red Teaming i zabezpieczenia anty prompt-injection',
      'Dedykowany panel analityczny dla Zarządu',
      'Wiadomości głosowe: klient nagrywa zamiast pisać, Whisper transkrybuje i agent odpowiada',
      { text: 'Pamięć klienta między sesjami: agent zapamiętuje cel, preferencje i historię rozmów', addon: true },
      { text: 'Proaktywne alerty SMS/e-mail: powiadomienie gdy oglądany produkt wchodzi w promocję', addon: true },
    ] as FeatureItem[],
    note: null,
    monthly: [
      'Nadzór nad integracją transakcyjną (punkt styku z koszykiem)',
      '10h pracy inżyniera AI miesięcznie na rozwój funkcji',
      'Comiesięczny biznesowy raport ROI dla Zarządu',
      'SLA priorytetowe: reakcja do 12h (dyżury weekendowe)',
    ] as FeatureItem[],
    example: '„Dorzuć 2x czekoladowe białko i tanią przedtreningówkę." → sam kompletuje koszyk i kieruje do kasy.',
    highlighted: true,
  },
];

const ACCENT = {
  emerald: {
    bar: 'bg-emerald-500',
    icon: 'bg-emerald-50 text-emerald-600',
    check: 'text-emerald-500',
    subBg: 'bg-emerald-50/60 border-emerald-100',
    subIcon: 'text-emerald-600',
  },
  blue: {
    bar: 'bg-sfd-blue',
    icon: 'bg-sfd-light text-sfd-blue',
    check: 'text-sfd-blue',
    subBg: 'bg-sfd-light/50 border-sfd-blue/15',
    subIcon: 'text-sfd-blue',
  },
  purple: {
    bar: 'bg-purple-500',
    icon: 'bg-purple-50 text-purple-600',
    check: 'text-purple-500',
    subBg: 'bg-purple-50/60 border-purple-100',
    subIcon: 'text-purple-600',
  },
} as const;

export default function PricingSection() {
  return (
    <section className="mb-10">
      {/* Nagłówek sekcji */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="bg-sfd-blue/10 text-sfd-blue text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <i className="fa-solid fa-box-open mr-1" />
          Warianty wdrożenia
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-3 mb-3">
          Trzy drogi do agenta, który{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sfd-blue to-sfd-accent">
            zarabia dla SFD
          </span>
        </h2>
        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
          Panie Mateuszu, agent którego właśnie Pan przetestował to działający prototyp,
          a możliwość automatycznego kompletowania koszyka to już funkcjonalność z najwyższego
          pakietu Premium. Poniżej trzy warianty wdrożenia: od edukatora odciążającego BOK,
          po w pełni autonomicznego sprzedawcę domykającego koszyk.
        </p>
      </div>

      {/* Kafelki */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {PACKAGES.map((pkg) => {
          const c = ACCENT[pkg.accent as keyof typeof ACCENT];
          return (
            <div key={pkg.id} className="flex flex-col gap-4 h-full">
              {/* ── Kafelek główny: NA STARCIE ── */}
              <div
                className={`relative bg-white rounded-2xl border flex flex-col flex-1 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  pkg.highlighted
                    ? 'border-purple-400 shadow-lg lg:scale-[1.03] z-10'
                    : 'border-slate-200 shadow-sm'
                }`}
              >
                <div className={`h-1.5 w-full ${c.bar}`} />

                {pkg.highlighted && (
                  <span className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm">
                    Rekomendowana
                  </span>
                )}

                <div className="p-6 flex flex-col h-full">
                  {/* Ikona + nazwa */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.icon}`}>
                      <i className={`fa-solid ${pkg.icon} text-lg`} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Pakiet {pkg.name}
                      </p>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                        {pkg.subtitle}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{pkg.tagline}</p>

                  {/* Cena */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex items-center gap-2.5">
                    <i className={`fa-solid fa-comments text-lg ${c.check}`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">Wycena indywidualna</p>
                      <p className="text-[11px] text-slate-400">Ustalana podczas rozmowy</p>
                    </div>
                  </div>

                  {/* Nagłówek sekcji */}
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <i className={`fa-solid fa-flag-checkered ${c.subIcon}`} />
                    Co dostajesz na starcie (wdrożenie)
                  </p>

                  {/* Lista funkcji startowych */}
                  <ul className="space-y-2.5 mb-3 flex-1">
                    {pkg.inheritLabel && (
                      <li className="text-sm font-bold text-slate-800">{pkg.inheritLabel}</li>
                    )}
                    {pkg.startup.map((f, i) => {
                      const isAddon = typeof f === 'object' && f.addon;
                      const text = typeof f === 'object' ? f.text : f;
                      return isAddon ? (
                        <li key={i} className="flex gap-2.5 text-sm text-orange-700 bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1.5">
                          <i className="fa-solid fa-circle-plus mt-0.5 shrink-0 text-orange-400" />
                          <span className="flex-1">{text}</span>
                          <span className="shrink-0 text-[10px] font-bold text-orange-400 uppercase tracking-wide self-start mt-0.5">Dodatek</span>
                        </li>
                      ) : (
                        <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                          <i className={`fa-solid fa-check mt-0.5 shrink-0 ${c.check}`} />
                          <span>{text}</span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Ograniczenie (tylko Basic) */}
                  {pkg.note && (
                    <div className="flex gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg p-2.5 mb-3">
                      <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
                      <span>{pkg.note}</span>
                    </div>
                  )}

                  {/* Przykład */}
                  <div className="border-t border-slate-100 pt-3 mt-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <i className="fa-solid fa-comment-dots mr-1" />
                      W praktyce
                    </p>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{pkg.example}</p>
                  </div>
                </div>
              </div>

              {/* ── Kafelek poniżej: SUBSKRYPCJA MIESIĘCZNA ── */}
              <div className={`rounded-2xl border ${c.subBg} p-5`}>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <i className={`fa-solid fa-arrows-rotate ${c.subIcon}`} />
                  Subskrypcja miesięczna
                </p>
                <ul className="space-y-2.5">
                  {pkg.monthly.map((f, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-slate-600">
                      <i className={`fa-solid fa-check mt-0.5 shrink-0 ${c.check}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zastrzeżenie techniczne */}
      <div className="mt-6 flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-4xl mx-auto">
        <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Zastrzeżenie techniczne:</strong> Kwoty abonamentowe stanowią wynagrodzenie za
          prace inżynieryjne, utrzymaniowe i analityczne. Zewnętrzne koszty infrastruktury chmurowej
          (zużycie tokenów modeli LLM OpenAI/Anthropic, bazy wektorowe oraz licencje narzędzi
          monitorujących) są uzależnione od realnego ruchu i opłacane bezpośrednio z karty firmy SFD.
        </p>
      </div>
    </section>
  );
}
