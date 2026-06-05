// ─────────────────────────────────────────────────────────────────────────────
// SFD Product Database
// ─────────────────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'protein'
  | 'fat-burner'
  | 'creatine'
  | 'amino'
  | 'vitamin'
  | 'health'
  | 'joint'
  | 'food'
  | 'accessory';

export type ScienceGrade = 'A' | 'B' | 'C';

export interface ProductVariant {
  label: string;
  price: number;
  outOfStock?: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string;
  shopUrl: string;
  variants: ProductVariant[];
  crossSellId: string | null;
  category: ProductCategory;
  tags: string[];
  containsStimulants: boolean;
  scienceGrade: ScienceGrade;
  isAvailable?: boolean;
  originalPrice?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Product Catalogue
// ─────────────────────────────────────────────────────────────────────────────

export const products: Product[] = [
  // ── 1. WPC 82 ──────────────────────────────────────────────────────────────
  {
    id: 'wpc82',
    name: 'WPC 82 Instant 700g',
    brand: 'SFD NUTRITION',
    description:
      'Koncentrat białka serwatkowego WPC 82% z szybkim rozpuszczaniem. Idealny po treningu i jako uzupełnienie diety białkowej.',
    price: 84,
    unit: '700g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/63a2b12b23d91494753791b86bcb7f1aWPC_82_Instant_i43718_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_WPC_82_Instant-opis43718.html',
    variants: [
      { label: 'Ciasteczko', price: 84 },
      { label: 'Wanilia', price: 84 },
      { label: 'Słony Karmel', price: 84 },
      { label: 'Biała Czekolada', price: 84 },
    ],
    crossSellId: 'shaker',
    category: 'protein',
    tags: ['białko', 'redukcja', 'masa', 'serwatkowe', 'regeneracja'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 2. Whey Delicious ─────────────────────────────────────────────────────
  {
    id: 'wpcDelicious',
    name: 'Whey Delicious Protein 700g',
    brand: 'ALLNUTRITION',
    description:
      'Kremowe białko serwatkowe o wyjątkowym smaku. Wysoka zawartość białka, niska zawartość tłuszczu.',
    price: 79,
    unit: '700g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/63346a69f356acf3e61af25cd9b503f9Whey_Delicious_Protein_i38278_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_Whey_Delicious_Protein-opis38278.html',
    variants: [
      { label: 'Karmel', price: 79 },
      { label: 'Czekolada', price: 79 },
      { label: 'Wanilia', price: 79 },
    ],
    crossSellId: 'shaker',
    category: 'protein',
    tags: ['białko', 'kremowe', 'masa', 'serwatkowe'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 3. Isolate Protein WPI ─────────────────────────────────────────────────
  {
    id: 'wpi',
    name: 'Isolate Protein WPI 908g',
    brand: 'ALLNUTRITION',
    description:
      'Izolat białka serwatkowego o najwyższej czystości. Minimalny poziom laktozy i tłuszczu – idealny dla osób z nietolerancją.',
    price: 120,
    unit: '908g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/37dabe12aece54837a7f8a586b9400f0Isolate_Protein_i33551_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_Isolate_Protein-opis33551.html',
    variants: [
      { label: 'Czekolada', price: 120 },
      { label: 'Wanilia', price: 120 },
    ],
    crossSellId: 'lCarnitine',
    category: 'protein',
    tags: ['izolat', 'białko', 'redukcja', 'laktoza'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 4. Green Coffee ────────────────────────────────────────────────────────
  {
    id: 'fatburner',
    name: 'Zielona Kawa (Green Coffee)',
    brand: 'SFD NUTRITION',
    description:
      'Ekstrakt z zielonej kawy wspierający metabolizm. Naturalny kwas chlorogenowy i kofeina pomagają w redukcji masy ciała.',
    price: 29,
    unit: '90 tabletek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/d62e7926dca531282b3bd6b30121b65aGreen_Coffee_i40175_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Green_Coffee-opis40175.html',
    variants: [{ label: '90 tabletek', price: 29 }],
    crossSellId: 'wpc82',
    category: 'fat-burner',
    tags: ['spalacz', 'metabolizm', 'kofeina', 'redukcja'],
    containsStimulants: true,
    scienceGrade: 'B',
  },

  // ── 5. Fat Burner ──────────────────────────────────────────────────────────
  {
    id: 'fatBurnerSFD',
    name: 'Fat Burner 100 kapsułek',
    brand: 'SFD NUTRITION',
    description:
      'Zaawansowany spalacz tłuszczu z kofeiną, synefryną i EGCG. Wspomaga termogenezę i redukcję tkanki tłuszczowej.',
    price: 40,
    unit: '100 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/c97f3ec1874d2522b12623affe832b2aFat_Burner_i36492_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Fat_Burner-opis36492.html',
    variants: [{ label: '100 kaps', price: 40 }],
    crossSellId: 'lCarnitine',
    category: 'fat-burner',
    tags: ['spalacz', 'kofeina', 'synefryna', 'EGCG', 'termogeneza'],
    containsStimulants: true,
    scienceGrade: 'B',
  },

  // ── 6. Burn4ALL Extreme ────────────────────────────────────────────────────
  {
    id: 'burn4all',
    name: 'Burn4ALL Extreme 120 kapsułek',
    brand: 'ALLNUTRITION',
    description:
      'Kompleksowy spalacz z L-karnityną, kofeiną i ekstraktem z zielonej herbaty. Wspomaga termogenezę i kontrolę apetytu.',
    price: 60,
    unit: '120 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/bf77d3529373be69144cdcc9c111c552Burn4ALL_Extreme_i34859_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_Burn4ALL_Extreme-opis34859.html',
    variants: [{ label: '120 kaps', price: 60 }],
    crossSellId: 'lCarnitine',
    category: 'fat-burner',
    tags: ['spalacz', 'L-karnityna', 'kofeina', 'termogeneza', 'apetyt'],
    containsStimulants: true,
    scienceGrade: 'B',
  },

  // ── 7. L-Carnitine Strong ──────────────────────────────────────────────────
  {
    id: 'lCarnitine',
    name: 'L-Carnitine Strong 120 kapsułek',
    brand: 'SFD NUTRITION',
    description:
      'Wysoko dawkowana L-karnityna wspierająca transport kwasów tłuszczowych do mitochondriów. Idealna przed cardio.',
    price: 40,
    unit: '120 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/4c0e60537a4d31bd73d9cdbd147e61b0L-Carnitine_Strong_i40971_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_L-Carnitine_Strong-opis40971.html',
    variants: [{ label: '120 kaps', price: 40 }],
    crossSellId: 'burn4all',
    category: 'fat-burner',
    tags: ['L-karnityna', 'spalanie', 'transport FFA', 'cardio'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 8. L-Karnityna 500 Forte Plus ──────────────────────────────────────────
  {
    id: 'carnitine',
    name: 'L-Karnityna 500 Forte Plus',
    brand: 'Olimp',
    description:
      'Farmaceutyczna jakość L-karnityny od Olimp. Wspomaga spalanie tłuszczu, funkcje serca i wydolność fizyczną.',
    price: 87,
    unit: '60 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/14c8f5ac8b62dd1d5d124448aef0edc0L-Karnityna_500_Forte_Plus_i817_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/Olimp_L-Karnityna_500_Forte_Plus-opis817.html',
    variants: [{ label: '60 kapsułek', price: 87 }],
    crossSellId: 'frulove',
    category: 'fat-burner',
    tags: ['L-karnityna', 'spalanie', 'serce', 'bezpieczne'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 9. CLA + L-Carnitine + Green Tea ───────────────────────────────────────
  {
    id: 'claComplex',
    name: 'CLA + L-Carnitine + Green Tea 120 kaps',
    brand: 'ALLNUTRITION',
    description:
      'Kompleks trzech składników wspierających redukcję: CLA, L-karnityna i ekstrakt z zielonej herbaty. Pomaga utrzymać prawidłowy skład ciała.',
    price: 54,
    unit: '120 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/963013c24eee64b82319ff6a6f1ea3d5CLA__L-Carnitine__Green_Tea_i36163_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_CLA_+_L-Carnitine_+_Green_Tea-opis36163.html',
    variants: [{ label: '120 kaps', price: 54 }],
    crossSellId: 'lCarnitine',
    category: 'fat-burner',
    tags: ['CLA', 'L-karnityna', 'zielona herbata', 'skład ciała'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 10. Tri Creatine Malate ────────────────────────────────────────────────
  {
    id: 'creatine',
    name: 'Tri Creatine Malate 250g',
    brand: 'SFD NUTRITION',
    description:
      'Jabłczan kreatyny o wysokiej przyswajalności. Zwiększa siłę, masę mięśniową i wytrzymałość treningową.',
    price: 29,
    unit: '250g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/c91a321ebfad71ff31f23f55cfedeaeeTri_Creatine_Malate_i36354_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Tri_Creatine_Malate-opis36354.html',
    variants: [{ label: 'Naturalny', price: 29 }],
    crossSellId: 'wpc82',
    category: 'creatine',
    tags: ['kreatyna', 'siła', 'masa', 'wytrzymałość'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 11. BCAA ───────────────────────────────────────────────────────────────
  {
    id: 'bcaa',
    name: 'BCAA 500g',
    brand: 'SFD NUTRITION',
    description:
      'Aminokwasy rozgałęzione BCAA w optymalnym stosunku 2:1:1. Wspomagają ochronę mięśni i regenerację po treningu.',
    price: 50,
    unit: '500g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/43f2583aa63a9f808eec255d89c8639dBCAA_i32628_d250x250.jpg',
    shopUrl: 'https://sklep.sfd.pl/SFD_NUTRITION_BCAA-opis32628.html',
    variants: [{ label: '500g', price: 50 }],
    crossSellId: 'wpc82',
    category: 'amino',
    tags: ['aminokwasy', 'BCAA', 'mięśnie', 'redukcja', 'regeneracja'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 12. VitaMax Complex Plus ───────────────────────────────────────────────
  {
    id: 'vitamins',
    name: 'VitaMax Complex Plus 60',
    brand: 'SFD NUTRITION',
    description:
      'Kompleks witamin i minerałów w jednej tabletce. Uzupełnia codzienną dietę o kluczowe mikroskładniki.',
    price: 29,
    unit: '60 tabletek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/8e6f468e97f3fd2146c69108f0bf2832VitaMax_Complex_Plus_i36841_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_VitaMax_Complex_Plus-opis36841.html',
    variants: [{ label: '60 tabletek', price: 29 }],
    crossSellId: null,
    category: 'vitamin',
    tags: ['witaminy', 'minerały', 'multiwitamina', 'zdrowie'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 13. Omega 3 Strong ────────────────────────────────────────────────────
  {
    id: 'omega3',
    name: 'Omega 3 Strong 90 softgels',
    brand: 'SFD NUTRITION',
    description:
      'Wysokiej jakości kwasy tłuszczowe omega-3 (EPA + DHA). Wspierają zdrowie serca, stawów i równowagę hormonalną.',
    price: 35,
    unit: '90 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/ef98bade3bc696d896db0126d6242456Omega_3_Strong_i40345_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Omega_3_Strong-opis40345.html',
    variants: [{ label: '90 kaps', price: 35 }],
    crossSellId: null,
    category: 'health',
    tags: ['omega-3', 'EPA', 'DHA', 'zdrowie', 'hormony', 'stawy'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 14. Redox Hardcore 2.0 ─────────────────────────────────────────────────
  {
    id: 'redoxHardcore',
    name: 'Redox Hardcore 2.0 90 kapsułek',
    brand: 'ALLNUTRITION',
    description:
      'Zaawansowany spalacz tłuszczu z opatentowanymi Sinetrol® Xpur C i Capsimax®. Kompleks 12 składników aktywnych, kofeina z 3 źródeł (399 mg/dzień), chrom i magnez. Dla osób trenujących regularnie.',
    price: 140,
    unit: '90 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/e10f5de8eef7609621bc800f4411465dRedox_Hardcore_2.0_i39427_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_Redox_Hardcore_2.0-opis39427.html',
    variants: [{ label: '90 kaps', price: 140 }],
    crossSellId: 'lCarnitine',
    category: 'fat-burner',
    tags: [
      'spalacz', 'Sinetrol', 'Capsimax', 'kofeina', 'termogeneza',
      'chrom', 'magnez', 'redukcja', 'synefryna', 'forskolin',
      'szafran', 'cynamon', 'żeń-szeń', 'rhodiola',
    ],
    containsStimulants: true,
    scienceGrade: 'B',
    isAvailable: true,
    originalPrice: 159, // Symulacja obniżki z 159 na 140
  },

  // ── 15. FRULOVE In Jelly Cherry ────────────────────────────────────────────
  {
    id: 'frulove',
    name: 'FRULOVE In Jelly Cherry 1000g',
    brand: 'ALLNUTRITION',
    description:
      'Owocowy dżem bez dodatku cukru – idealny na diecie. Prawdziwe kawałki owoców w żelowej konsystencji.',
    price: 37,
    unit: '1000g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/94a7681c5390efabd7826337c7b82c28FRULOVE_In_Jelly_Cherry_i41934_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_FRULOVE_In_Jelly_Cherry_(Wisnia)-opis41934.html',
    variants: [
      { label: 'Truskawka', price: 37, outOfStock: true },
      { label: 'Wiśnia', price: 37 },
      { label: 'Owoce Leśne', price: 37 },
    ],
    crossSellId: 'wpc82',
    category: 'food',
    tags: ['dżem', 'frulove', 'bez cukru', 'owoce', 'dieta', 'słodycze'],
    containsStimulants: false,
    scienceGrade: 'C',
    isAvailable: false, // Symulacja niedostępności
  },

  // ── 16. Sos Zero Cinnamon Roll ─────────────────────────────────────────────
  {
    id: 'sosZero',
    name: 'Sos Zero Cinnamon Roll 425ml',
    brand: 'WK DZIK',
    description:
      'Sos zero kalorii o smaku cinnamon roll. Idealny dodatek do naleśników, gofrów i deserów na diecie.',
    price: 20,
    unit: '425ml',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/cc85f78f67c40a8e40c47528c504ee4fSos_Zero_Cinnamon_Roll_i43377_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/WK_DZIK_Sos_Zero_Cinnamon_Roll-opis43377.html',
    variants: [{ label: 'Cinnamon Roll', price: 20 }],
    crossSellId: 'frulove',
    category: 'food',
    tags: ['sos', 'zero kalorii', 'dieta', 'fit'],
    containsStimulants: false,
    scienceGrade: 'C',
  },

  // ── 17. Shaker ─────────────────────────────────────────────────────────────
  {
    id: 'shaker',
    name: 'Shaker 1 sztuka',
    brand: 'SFD NUTRITION',
    description:
      'Wygodny shaker z sitkiem do mieszania odżywek białkowych. Szczelne zamknięcie, pojemność 700 ml.',
    price: 12,
    unit: '1 sztuka',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/52020d128fc85d7d885ecd3469262adcShaker_i26176_d250x250.jpg',
    shopUrl: 'https://sklep.sfd.pl/SFD_NUTRITION_Shaker-opis26176.html',
    variants: [
      { label: 'Niebieski', price: 12 },
      { label: 'Czarny', price: 12 },
    ],
    crossSellId: null,
    category: 'accessory',
    tags: ['shaker', 'akcesoria', 'bidon'],
    containsStimulants: false,
    scienceGrade: 'C',
  },

  // ── 18. Collagen Premium ───────────────────────────────────────────────────
  {
    id: 'collagenPremium',
    name: 'Collagen Premium 400g',
    brand: 'SFD NUTRITION',
    description:
      'Kompleksowy kolagen w proszku do picia. 13 000 mg kolagenu hydrolizowanego na porcję + MSM (1500 mg), witamina C, witamina D, kwas hialuronowy, glukozamina, ekstrakt z Boswellia serrata. Wspiera stawy, kości, chrząstki i skórę.',
    price: 39,
    unit: '400g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/95ea1c237d2761bacc50af9120e48e53Collagen_Premium_i40198_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Collagen_Premium-opis40198.html',
    variants: [
      { label: 'Cola', price: 39 },
      { label: 'Czarna Porzeczka', price: 39 },
      { label: 'Pomarańcza', price: 39 },
      { label: 'Truskawka-Malina', price: 39 },
    ],
    crossSellId: 'glucosamineComplex',
    category: 'joint',
    tags: [
      'kolagen', 'stawy', 'kolana', 'chrząstka', 'MSM', 'kwas hialuronowy',
      'glukozamina', 'witamina C', 'kości', 'skóra', 'Boswellia',
    ],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 19. Collagen Pro ──────────────────────────────────────────────────────
  {
    id: 'collagenPro',
    name: 'Collagen Pro 180 kapsułek',
    brand: 'ALLNUTRITION',
    description:
      'Kolagen hydrolizowany w kapsułkach z 17 aktywnymi składnikami. Wspiera stawy, kości, chrząstki, zęby i mięśnie. Zawiera kwas hialuronowy, glukozaminę, MSM, chondroitynę, witaminy C, D i K.',
    price: 39,
    unit: '180 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/73be308dd6a1e865df61568b01ddb6ccKD-Sci-MX_Diet_Pro_Protein_-_11.2017_i36737_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_Collagen_Pro-opis36737.html',
    variants: [{ label: '180 kaps', price: 39 }],
    crossSellId: 'collagenPremium',
    category: 'joint',
    tags: [
      'kolagen', 'stawy', 'kolana', 'chrząstka', 'kapsułki',
      'kwas hialuronowy', 'glukozamina', 'MSM', 'chondroityna',
      'witamina C', 'witamina D', 'witamina K', 'kości',
    ],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 20. Glukozamina + Chondroityna + MSM ──────────────────────────────────
  {
    id: 'glucosamineComplex',
    name: 'Glukozamina + Chondroityna + MSM 180 tabletek',
    brand: 'SFD NUTRITION',
    description:
      'Złoty standard wsparcia stawów i chrząstek. Dawka dzienna (4 tabletki): 600 mg glukozaminy, 345 mg chondroityny, 500 mg MSM. Opakowanie wystarcza na 45 dni. Idealny dla sportowców, osób aktywnych i seniorów z problemami stawowymi.',
    price: 25,
    unit: '180 tabletek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/95ea1c237d2761bacc50af9120e48e53Collagen_Premium_i40198_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Collagen_Premium-opis40198.html',
    variants: [{ label: '180 tab', price: 25 }],
    crossSellId: 'collagenPremium',
    category: 'joint',
    tags: [
      'glukozamina', 'chondroityna', 'MSM', 'stawy', 'kolana',
      'chrząstka', 'regeneracja', 'kości', 'GAIT',
    ],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 21. Flex Guard ────────────────────────────────────────────────────────
  {
    id: 'flexGuard',
    name: 'Flex Guard 375g',
    brand: 'TREC NUTRITION',
    description:
      'Premium kolagen SOLUGEL™ typu I (7000 mg/porcję) + kolagen typu II, MSM, glukozamina, chondroityna, kwas hialuronowy, witamina C, wapń, magnez i olej rybi MEG-3™. Kompleksowe wsparcie stawów dla sportowców.',
    price: 83,
    unit: '375g',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/95ea1c237d2761bacc50af9120e48e53Collagen_Premium_i40198_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Collagen_Premium-opis40198.html',
    variants: [
      { label: 'Pomarańcza', price: 83 },
      { label: 'Grejpfrut', price: 83 },
    ],
    crossSellId: 'omega3',
    category: 'joint',
    tags: [
      'kolagen', 'SOLUGEL', 'stawy', 'kolana', 'chrząstka', 'ścięgna',
      'wiązadła', 'MSM', 'glukozamina', 'chondroityna',
      'kwas hialuronowy', 'omega-3', 'sportowcy',
    ],
    containsStimulants: false,
    scienceGrade: 'B',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple text search across name, brand, description and tags.
 * Returns matching products sorted by relevance (number of field matches).
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  const terms = lowerQuery.split(/\s+/).filter(Boolean);

  const scored = products
    .map((product) => {
      let score = 0;
      const searchable = [
        product.name,
        product.brand,
        product.description,
        ...product.tags,
        product.category,
      ]
        .join(' ')
        .toLowerCase();

      for (const term of terms) {
        // Exact tag match is highest value
        if (product.tags.some((t) => t.toLowerCase() === term)) {
          score += 3;
        }
        // Name match
        if (product.name.toLowerCase().includes(term)) {
          score += 2;
        }
        // General field match
        if (searchable.includes(term)) {
          score += 1;
        }
      }

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map(({ product }) => product);
}

/** Get a single product by its ID. */
export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

/** Get all products in a given category. */
export function getProductsByCategory(
  category: Product['category'],
): Product[] {
  return products.filter((p) => p.category === category);
}

/** Get products that are safe for people with health conditions (no stimulants). */
export function getSafeProducts(): Product[] {
  return products.filter((p) => !p.containsStimulants);
}

/** Get products specifically for joint/collagen support. */
export function getJointProducts(): Product[] {
  return products.filter((p) => p.category === 'joint');
}

/** 
 * Sprawdza "na żywo" dostępność i cenę produktu (symulacja scrapowania).
 * W systemie produkcyjnym ta funkcja wykonywałaby fetch na sklep.sfd.pl.
 */
export function checkProductAvailability(id: string): { 
  available: boolean; 
  currentPrice: number; 
  originalPrice: number | null;
  message: string;
} | undefined {
  const p = getProductById(id);
  if (!p) return undefined;
  
  const isAvail = p.isAvailable !== false; // domyślnie dostępne
  const origPrice = p.originalPrice || null;
  
  let msg = isAvail ? 'Dostępny w magazynie.' : 'Obecnie niedostępny.';
  if (isAvail && origPrice && p.price < origPrice) {
    msg += ` Promocja! Cena spadła z ${origPrice} zł na ${p.price} zł.`;
  } else if (isAvail && origPrice && p.price > origPrice) {
    msg += ` Cena wzrosła z ${origPrice} zł na ${p.price} zł.`;
  }

  return {
    available: isAvail,
    currentPrice: p.price,
    originalPrice: origPrice,
    message: msg
  };
}
