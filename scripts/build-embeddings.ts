/**
 * Pre-oblicza embeddingi wszystkich produktow i zapisuje je do
 * src/data/embeddings.json. Dzieki temu w runtime NIE embedujemy katalogu —
 * embedujemy tylko krotkie zapytanie uzytkownika, a podobienstwo liczymy
 * lokalnie (cosine) w pamieci. To jest lokalna baza wektorowa (RAG).
 *
 * Uruchomienie: npx tsx scripts/build-embeddings.ts
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { products } from '../src/data/products';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Wczytaj OPENAI_API_KEY z .env.local
function loadKey(): string {
  const env = readFileSync(join(ROOT, '.env.local'), 'utf8');
  const line = env.split('\n').find((l) => l.startsWith('OPENAI_API_KEY='));
  if (!line) throw new Error('Brak OPENAI_API_KEY w .env.local');
  return line.slice('OPENAI_API_KEY='.length).trim();
}

const EMBED_MODEL = 'text-embedding-3-small';

/** Tekst reprezentujacy produkt do osadzenia w przestrzeni wektorowej. */
function productText(p: (typeof products)[number]): string {
  return [
    p.name,
    p.brand,
    p.category,
    p.description,
    p.tags.join(', '),
  ].join('. ');
}

async function embed(inputs: string[], apiKey: string): Promise<number[][]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({ model: EMBED_MODEL, input: inputs }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Embeddings API error: ' + err);
  }
  const data = await res.json();
  return data.data.map((d: { embedding: number[] }) => d.embedding);
}

async function main() {
  const apiKey = loadKey();
  const texts = products.map(productText);
  console.log(`Embedduje ${texts.length} produktow modelem ${EMBED_MODEL}...`);
  const vectors = await embed(texts, apiKey);

  const out = {
    model: EMBED_MODEL,
    dim: vectors[0]?.length ?? 0,
    generatedAt: new Date().toISOString(),
    items: products.map((p, i) => ({ id: p.id, vector: vectors[i] })),
  };

  const outPath = join(ROOT, 'src/data/embeddings.json');
  writeFileSync(outPath, JSON.stringify(out));
  console.log(`Zapisano ${out.items.length} wektorow (dim=${out.dim}) -> ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
