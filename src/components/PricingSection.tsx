type FeatureItem = string | { text: string; addon: true };

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    subtitle: 'Doradca-Edukator',
    tagline: 'Ekspert dostępny 24/7, który odpowiada zamiast Twojego BOK-u i prowadzi klienta do właściwego produktu.',
    accent: 'emerald',
    icon: 'fa-graduation-cap',
    inherits: [] as string[],
    gains: [
      { icon: 'fa-clock', text: 'Zero czekania — klient dostaje odpowiedź natychmiast, o każdej porze' },
      { icon: 'fa-shield-halved', text: 'Mniej porzuceń przez brak wiedzy — agent edukuje i prowadzi do zakupu' },
      { icon: 'fa-language', text: 'Obsługa po polsku, angielsku i ukraińsku bez dodatkowego etatu' },
    ],
    startup: [
      'Agent odpowiada na pytania o składy, alergeny, dawkowanie i dobór produktu pod cel klienta',
      'Baza wiedzy o całym katalogu SFD (architektura RAG — zawsze aktualna, semantyczna)',
      'Kieruje ruch do właściwych kategorii i produktów w sklepie',
      'Wielojęzyczność: polski, angielski, ukraiński bez dodatkowej konfiguracji',
      'Bezpieczne odpowiedzi: automatyczny disclaimer przy pytaniach zdrowotnych',
      'Odpowiedzi pojawiają się słowo po słowie (streaming) — wrażenie jak ChatGPT, zero czekania',
      'Proaktywny dymek: po 15 sek. na stronie zachęca do rozmowy i proponuje pomoc',
    ] as FeatureItem[],
    note: 'Pakiet bez integracji koszyka — agent generuje linki do produktów i kieruje do sklepu.',
    monthly: [
      'Monitoring backendu i bazy wiedzy (zero przestojów)',
      'Aktualizacja katalogu RAG raz w miesiącu (nowe produkty, zmiany cen)',
      'Raport miesięczny: najczęstsze pytania klientów i luki w bazie wiedzy',
      'SLA: reakcja na błędy krytyczne do 24h roboczych',
    ] as FeatureItem[],
    example: '„Jakie białko przy nietolerancji laktozy i czy mogę łączyć z kawą?" → agent tłumaczy izolat vs koncentrat, wskazuje konkretny produkt SFD i informuje o interakcjach z kofeiną.',
    highlighted: false,
  },
  {
    id: 'medium',
    name: 'Medium',
    subtitle: 'Doradca + Sprzedawca',
    tagline: 'Wszystko co Basic, plus sprzedawca który zna magazyn na żywo, dobiera zestawy i nie pozwala klientowi wyjść z pustymi rękoma.',
    accent: 'blue',
    icon: 'fa-headset',
    inherits: ['Basic'],
    gains: [
      { icon: 'fa-arrow-trend-up', text: 'Wzrost średniej wartości koszyka dzięki zestawom i cross-sellingowi' },
      { icon: 'fa-warehouse', text: 'Agent sprawdza dostępność live — żadnych zamówień na brak towaru' },
      { icon: 'fa-camera', text: 'Klient wysyła zdjęcie suplementu konkurencji — agent proponuje lepszy odpowiednik SFD' },
    ],
    startup: [
      'Integracja z API magazynu SFD: stany, smaki, ceny i rabaty w czasie rzeczywistym',
      'Spersonalizowane strategie sprzedażowe: cross-selling i up-selling pod cel klienta',
      'Kalkulator suplementacji: agent pyta o wagę, cel i intensywność, dobiera dawkowanie',
      'Automatyczne sugestie zestawów (np. spalacz + L-karnityna + białko na redukcji)',
      'Gotowy koszyk jednym zdaniem: „zrób mi zestaw na redukcję do 200 zł" → agent kompletuje i optymalizuje',
      'Analiza zdjęcia etykiety (Vision AI): klient fotografuje suplement, agent porównuje skład i proponuje produkt SFD',
      'Monitoring rozmów i toku myślowego agenta w czasie rzeczywistym (LangSmith)',
    ] as FeatureItem[],
    note: null,
    monthly: [
      'Cotygodniowy audyt porzuconych rozmów — optymalizacja scenariuszy sprzedażowych',
      'Dynamiczne zarządzanie asortymentem: nowe smaki, akcje promocyjne, wyprzedaże',
      'Tarcza bezpieczeństwa: blokada prób manipulacji i prompt injection',
      'SLA: reakcja do 24h roboczych, raport miesięczny z wynikami konwersji',
    ] as FeatureItem[],
    example: '„Chcę schudnąć 10 kg do wakacji, ważę 90 kg." → agent oblicza dawki, dobiera zestaw bez stymulantów (wykrył nadciśnienie), kompletuje koszyk w limicie 150 zł i proponuje zamiennik gdy produkt niedostępny.',
    highlighted: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Autonomiczny Asystent E-commerce',
    tagline: 'Wszystko co Basic i Medium, plus agent z pełnymi uprawnieniami: sam kompletuje koszyk, mówi głosem i pamięta każdego klienta.',
    accent: 'purple',
    icon: 'fa-rocket',
    inherits: ['Basic', 'Medium'],
    gains: [
      { icon: 'fa-cart-arrow-down', text: 'Pełna automatyzacja koszyka — klient mówi „dodaj 2 białka waniliowe", agent to robi' },
      { icon: 'fa-chart-line', text: 'Panel ROI dla Zarządu: ile sprzedał agent, które produkty, jakie zestawy konwertują' },
    ],
    startup: [
      'Pełna automatyzacja koszyka przez API: dodawanie, zmiana ilości, usuwanie na komendę głosową lub tekstową',
      'Agent mówi głosem (TTS): odpowiedzi czytane naturalnym głosem, idealne na mobile',
      'Wiadomości głosowe: klient nagrywa zamiast pisać, Whisper AI transkrybuje w ułamku sekundy',
      'Red Teaming i zaawansowane zabezpieczenia anty prompt-injection',
      'Dedykowany panel analityczny: sprzedaż, konwersja, najczęstsze zestawy, ROI agenta',
      { text: 'Pamięć klienta między sesjami: agent zapamiętuje cel, preferencje i historię rozmów', addon: true },
      { text: 'Alerty e-mail o promocji: powiadomienie gdy oglądany produkt wchodzi w wyprzedaż', addon: true },
    ] as FeatureItem[],
    note: null,
    monthly: [
      '10h pracy inżyniera AI miesięcznie na rozwój i optymalizację nowych scenariuszy',
      'Nadzór nad integracją transakcyjną (koszyk, płatności, stany magazynowe)',
      'Comiesięczny biznesowy raport ROI dla Zarządu z rekomendacjami',
      'SLA priorytetowe: reakcja do 12h, dyżury weekendowe',
    ] as FeatureItem[],
    example: '„Dorzuć 2x czekoladowe białko i tańszy spalacz, i zamów na mój adres." → agent kompletuje koszyk głosowo, proponuje Redox w aktualnej promocji zamiast pełnej ceny i przekierowuje do kasy z gotowym zamówieniem.',
    highlighted: true,
  },
];

const ACCENT = {
  emerald: {
    bar: 'bg-emerald-500',
    icon: 'bg-emerald-50 text-emerald-600',
    check: 'text-emerald-500',
    gainBg: 'bg-emerald-50/70 border-emerald-100',
    gainIcon: 'text-emerald-500',
    inheritBg: 'bg-emerald-100 text-emerald-700',
    subBg: 'bg-emerald-50/60 border-emerald-100',
    subIcon: 'text-emerald-600',
  },
  blue: {
    bar: 'bg-sfd-blue',
    icon: 'bg-sfd-light text-sfd-blue',
    check: 'text-sfd-blue',
    gainBg: 'bg-sfd-light/60 border-sfd-blue/15',
    gainIcon: 'text-sfd-blue',
    inheritBg: 'bg-sfd-light text-sfd-blue',
    subBg: 'bg-sfd-light/50 border-sfd-blue/15',
    subIcon: 'text-sfd-blue',
  },
  purple: {
    bar: 'bg-purple-500',
    icon: 'bg-purple-50 text-purple-600',
    check: 'text-purple-500',
    gainBg: 'bg-purple-50/70 border-purple-100',
    gainIcon: 'text-purple-500',
    inheritBg: 'bg-purple-100 text-purple-700',
    subBg: 'bg-purple-50/60 border-purple-100',
    subIcon: 'text-purple-600',
  },
} as const;

const TIER_COLORS: Record<string, string> = {
  Basic: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-sfd-light text-sfd-blue border-sfd-blue/20',
};

export default function PricingSection() {
  return (
    <section className="mb-10">
      {/* Nagłówek sekcji */}
      <div className="text-center max-w-2xl mx-auto mb-6">
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
          pakietu Premium. Każdy wyższy pakiet zawiera wszystko z poprzedniego i dodaje nowy poziom automatyzacji.
        </p>
      </div>

      {/* Pasek postępu: Basic → Medium → Premium */}
      <div className="flex items-center justify-center gap-0 mb-8 max-w-lg mx-auto">
        {['Basic', 'Medium', 'Premium'].map((tier, i) => (
          <div key={tier} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
              tier === 'Basic' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
              tier === 'Medium' ? 'bg-sfd-light text-sfd-blue border-sfd-blue/20' :
              'bg-purple-100 text-purple-700 border-purple-200'
            }`}>
              <i className={`fa-solid ${
                tier === 'Basic' ? 'fa-graduation-cap' :
                tier === 'Medium' ? 'fa-headset' : 'fa-rocket'
              } text-[10px]`} />
              {tier}
            </div>
            {i < 2 && (
              <div className="flex items-center mx-1">
                <div className="w-6 h-px bg-slate-300" />
                <i className="fa-solid fa-chevron-right text-[9px] text-slate-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Kafelki */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {PACKAGES.map((pkg) => {
          const c = ACCENT[pkg.accent as keyof typeof ACCENT];
          return (
            <div key={pkg.id} className="flex flex-col gap-4 h-full">
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

                  {/* Żetony dziedziczenia */}
                  {pkg.inherits.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Zawiera:</span>
                      {pkg.inherits.map((tier) => (
                        <span key={tier} className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${TIER_COLORS[tier]}`}>
                          <i className="fa-solid fa-check text-[8px]" />
                          {tier}
                        </span>
                      ))}
                      <span className="text-[10px] text-slate-400 font-semibold">+ nowe funkcje poniżej</span>
                    </div>
                  )}

                  {/* Co zyskujesz */}
                  <div className={`rounded-xl border p-3.5 mb-4 space-y-2 ${c.gainBg}`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      <i className={`fa-solid fa-bullseye mr-1.5 ${c.gainIcon}`} />
                      Co zyskuje SFD
                    </p>
                    {pkg.gains.map((g, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <i className={`fa-solid ${g.icon} text-xs mt-0.5 shrink-0 ${c.gainIcon}`} />
                        <p className="text-xs text-slate-700 leading-snug">{g.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Cena */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-4 flex items-center gap-2.5">
                    <i className={`fa-solid fa-comments text-lg ${c.check}`} />
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">Wycena indywidualna</p>
                      <p className="text-[11px] text-slate-400">Ustalana podczas rozmowy</p>
                    </div>
                  </div>

                  {/* Nagłówek funkcji */}
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <i className={`fa-solid fa-flag-checkered ${c.subIcon}`} />
                    {pkg.inherits.length > 0 ? 'Nowe funkcje w tym pakiecie' : 'Co dostajesz na starcie'}
                  </p>

                  {/* Lista funkcji */}
                  <ul className="space-y-2.5 mb-3 flex-1">
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
                      Przykład rozmowy
                    </p>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{pkg.example}</p>
                  </div>
                </div>
              </div>

              {/* Subskrypcja miesięczna */}
              <div className={`rounded-2xl border ${c.subBg} p-5`}>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <i className={`fa-solid fa-arrows-rotate ${c.subIcon}`} />
                  Subskrypcja miesięczna
                </p>
                <ul className="space-y-2.5">
                  {pkg.monthly.map((f, i) => {
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
                        <i className={`fa-solid fa-check mt-0.5 shrink-0 ${c.subIcon}`} />
                        <span>{text}</span>
                      </li>
                    );
                  })}
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
