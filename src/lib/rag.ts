// ─────────────────────────────────────────────────────────────────────────────
// Lokalny RAG (wyszukiwanie wektorowe)
// Embeddingi katalogu sa pre-obliczone (src/data/embeddings.json), wiec w runtime
// embedujemy tylko krotkie zapytanie uzytkownika i liczymy podobienstwo cosinusowe
// w pamieci. Zero zewnetrznej bazy wektorowej, zero round-tripow do Pinecone.
// Jesli embeddingi/API sa niedostepne -> bezpieczny fallback do searchProducts().
// ─────────────────────────────────────────────────────────────────────────────

import { products, searchProducts, type Product } from '@/data/products';
import embeddingsData from '@/data/embeddings.json';

const EMBED_MODEL = (embeddingsData as { model?: string }).model ?? 'text-embedding-3-small';

interface EmbItem {
  id: string;
  vector: number[];
}

const CATALOG: EmbItem[] = (embeddingsData as { items?: EmbItem[] }).items ?? [];

// Cache embeddingow zapytan (te same pytania nie placa drugi raz za API)
const queryCache = new Map<string, number[]>();

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embedQuery(query: string): Promise<number[] | null> {
  const key = query.toLowerCase().trim();
  const cached = queryCache.get(key);
  if (cached) return cached;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({ model: EMBED_MODEL, input: query }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const vector: number[] | undefined = data?.data?.[0]?.embedding;
    if (!vector) return null;
    queryCache.set(key, vector);
    return vector;
  } catch {
    return null;
  }
}

/**
 * Semantyczne (wektorowe) wyszukiwanie produktow.
 * Zwraca do `topK` produktow posortowanych po podobienstwie.
 * Gdy RAG niedostepny -> fallback do prostego wyszukiwania slownikowego.
 */
export async function semanticSearch(query: string, topK = 4): Promise<Product[]> {
  if (CATALOG.length === 0) return searchProducts(query).slice(0, topK);

  const qVec = await embedQuery(query);
  if (!qVec) return searchProducts(query).slice(0, topK);

  const scored = CATALOG.map((item) => ({
    id: item.id,
    score: cosine(qVec, item.vector),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  const results = scored
    .map((s) => products.find((p) => p.id === s.id))
    .filter((p): p is Product => Boolean(p));

  // Awaryjnie, gdyby cos poszlo nie tak z mapowaniem
  return results.length > 0 ? results : searchProducts(query).slice(0, topK);
}
