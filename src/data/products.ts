// ─────────────────────────────────────────────────────────────────────────────
// SFD Product Database
// ─────────────────────────────────────────────────────────────────────────────

export type ProductCategory =
  | 'protein'
  | 'fat-burner'
  | 'joint'
  | 'shaker';

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
      'Koncentrat białka serwatkowego WPC 82% z szybkim rozpuszczaniem. Idealny po treningu i jako uzupełnienie diety białkowej na redukcji.',
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
    crossSellId: 'fatBurnerSFD',
    category: 'protein',
    tags: ['białko', 'redukcja', 'masa', 'serwatkowe', 'regeneracja'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 2. Fat Burner ──────────────────────────────────────────────────────────
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
    tags: ['spalacz', 'kofeina', 'synefryna', 'EGCG', 'termogeneza', 'redukcja'],
    containsStimulants: true,
    scienceGrade: 'B',
  },

  // ── 3. Redox Hardcore 2.0 ─────────────────────────────────────────────────
  {
    id: 'redoxHardcore',
    name: 'Redox Hardcore 2.0 90 kapsułek',
    brand: 'ALLNUTRITION',
    description:
      'Zaawansowany spalacz tłuszczu z opatentowanymi Sinetrol® Xpur C i Capsimax®. Kompleks 12 składników aktywnych, kofeina z 3 źródeł (399 mg/dzień). Najlepszy wybór na redukcję.',
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
      'chrom', 'magnez', 'redukcja', 'synefryna'
    ],
    containsStimulants: true,
    scienceGrade: 'B',
    isAvailable: true,
    originalPrice: 159, // Symulacja obniżki z 159 na 140
  },

  // ── 4. L-Carnitine Strong ──────────────────────────────────────────────────
  {
    id: 'lCarnitine',
    name: 'L-Carnitine Strong 120 kapsułek',
    brand: 'SFD NUTRITION',
    description:
      'Wysoko dawkowana L-karnityna wspierająca transport kwasów tłuszczowych do mitochondriów. Idealna przed cardio na redukcji.',
    price: 40,
    unit: '120 kapsułek',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/4c0e60537a4d31bd73d9cdbd147e61b0L-Carnitine_Strong_i40971_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_L-Carnitine_Strong-opis40971.html',
    variants: [{ label: '120 kaps', price: 40 }],
    crossSellId: 'wpc82',
    category: 'fat-burner',
    tags: ['L-karnityna', 'spalanie', 'transport FFA', 'cardio', 'redukcja'],
    containsStimulants: false,
    scienceGrade: 'B',
  },

  // ── 5. SFD NUTRITION Shaker (budżetowy) ────────────────────────────────────
  {
    id: 'shakerSFD',
    name: 'SFD NUTRITION Shaker 700ml',
    brand: 'SFD NUTRITION',
    description:
      'Klasyczny, szczelny shaker 700 ml z zakręcanym wieczkiem i sitkiem rozbijającym grudki. Duże logo SFD. Budżetowy wybór do codziennego mieszania białka i odżywek.',
    price: 12.99,
    unit: '700 ml',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/52020d128fc85d7d885ecd3469262adcShaker_i26176_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Shaker-opis26176.html',
    variants: [{ label: 'Czarny', price: 12.99 }],
    crossSellId: 'wpc82',
    category: 'shaker',
    tags: ['shaker', 'bidon', 'akcesoria', 'białko', 'mieszanie', 'sitko'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 6. SFD NUTRITION Shaker Premium ────────────────────────────────────────
  {
    id: 'shakerSFDPremium',
    name: 'SFD NUTRITION Shaker Premium 700ml',
    brand: 'SFD NUTRITION',
    description:
      'Shaker premium 700 ml z atestowanego tworzywa BPA Free. Technologia Circle (polerowane wnętrze) idealnie miesza zawartość BEZ sitka. Solidny i wygodny do białka.',
    price: 29.99,
    unit: '700 ml',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/57293e01f01173255ba17c7dc37c269dShaker_Premium_i41212_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/SFD_NUTRITION_Shaker_Premium-opis41212.html',
    variants: [{ label: 'Czarny', price: 29.99 }],
    crossSellId: 'wpc82',
    category: 'shaker',
    tags: ['shaker', 'bidon', 'akcesoria', 'białko', 'premium', 'BPA Free', 'bez sitka'],
    containsStimulants: false,
    scienceGrade: 'A',
  },

  // ── 7. ALLNUTRITION Shaker Premium ─────────────────────────────────────────
  {
    id: 'shakerAllnutrition',
    name: 'ALLNUTRITION Shaker Premium 700ml',
    brand: 'ALLNUTRITION',
    description:
      'Shaker premium 700 ml z atestowanego tworzywa BPA Free. Technologia Circle (polerowane wnętrze) gwarantuje idealne wymieszanie bez użycia sitka. Estetyczny, czarny design.',
    price: 29.99,
    unit: '700 ml',
    imageUrl:
      'https://sklep.sfd.pl/produkt_img/c1854843fce000f861ffbd669f944a0dShaker_Premium_i41211_d250x250.jpg',
    shopUrl:
      'https://sklep.sfd.pl/ALLNUTRITION_Shaker_Premium-opis41211.html',
    variants: [{ label: 'Czarny', price: 29.99 }],
    crossSellId: 'wpc82',
    category: 'shaker',
    tags: ['shaker', 'bidon', 'akcesoria', 'białko', 'premium', 'BPA Free', 'bez sitka'],
    containsStimulants: false,
    scienceGrade: 'A',
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
