import { describe, it, expect } from 'vitest';
import {
  searchProducts,
  getSafeProducts,
  getProductById,
  getProductsByCategory,
  getJointProducts,
  products,
} from '@/data/products';

describe('SFD Data Tools - QA Audit', () => {
  describe('searchProducts (Wyszukiwarka Semantic/Scoring)', () => {
    it('powinna zwrócić wpc82 wysoko w wynikach dla zapytania "białko"', () => {
      const results = searchProducts('białko');
      expect(results.length).toBeGreaterThan(0);

      const firstResult = results[0];
      expect(firstResult.tags).toContain('białko');
      expect(firstResult.category).toBe('protein');
    });

    it('powinna poradzić sobie z zapytaniami z małymi i wielkimi literami', () => {
      const results1 = searchProducts('BIAŁKO');
      const results2 = searchProducts('białko');
      expect(results1[0].id).toBe(results2[0].id);
    });

    it('powinna zwrócić produkt na podstawie id tagu np. "spalacz"', () => {
      const results = searchProducts('spalacz');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe('fat-burner');
    });

    it('nie powinna zwracać wyników dla całkowicie niepowiązanych zapytań', () => {
      const results = searchProducts('opony zimowe');
      expect(results.length).toBe(0);
    });

    it('powinna zwrócić produkty kolagenowe dla zapytania "kolagen"', () => {
      const results = searchProducts('kolagen');
      expect(results.length).toBeGreaterThan(0);
      const jointResults = results.filter((p) => p.category === 'joint');
      expect(jointResults.length).toBeGreaterThanOrEqual(3);
    });

    it('powinna zwrócić glukozaminę dla zapytania "kolana"', () => {
      const results = searchProducts('kolana');
      expect(results.length).toBeGreaterThan(0);
      const hasGlucosamine = results.some((p) => p.id === 'glucosamineComplex');
      expect(hasGlucosamine).toBe(true);
    });

    it('powinna zwrócić Redox Hardcore dla zapytania "Sinetrol"', () => {
      const results = searchProducts('Sinetrol');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('redoxHardcore');
    });

    it('powinna zwrócić Redox Hardcore dla zapytania "Capsimax"', () => {
      const results = searchProducts('Capsimax');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe('redoxHardcore');
    });
  });

  describe('getSafeProducts (Bramka Medyczna)', () => {
    it('nie powinna zwracać żadnych produktów ze stymulantami', () => {
      const safe = getSafeProducts();

      const hasStimulants = safe.some(
        (product) => product.containsStimulants === true,
      );
      expect(hasStimulants).toBe(false);

      const fatBurnerSfd = safe.find((p) => p.id === 'fatBurnerSFD');
      expect(fatBurnerSfd).toBeUndefined();
    });

    it('powinna zawierać bezpieczne produkty z innych kategorii np. białko', () => {
      const safe = getSafeProducts();
      const wpc = safe.find((p) => p.id === 'wpc82');
      expect(wpc).toBeDefined();
    });

    it('NIE powinna zawierać Redox Hardcore 2.0 (ma stymulanty)', () => {
      const safe = getSafeProducts();
      const redox = safe.find((p) => p.id === 'redoxHardcore');
      expect(redox).toBeUndefined();
    });

    it('powinna zawierać produkty kolagenowe (są bezpieczne)', () => {
      const safe = getSafeProducts();
      const collagen = safe.find((p) => p.id === 'collagenPremium');
      expect(collagen).toBeDefined();
      const glucosamine = safe.find((p) => p.id === 'glucosamineComplex');
      expect(glucosamine).toBeDefined();
    });
  });

  describe('getProductById (Konkretny dostęp do produktu)', () => {
    it('powinna zwrócić odpowiedni produkt gdy podano poprawne ID', () => {
      const product = getProductById('wpc82');
      expect(product).toBeDefined();
      expect(product?.name).toContain('WPC');
    });

    it('powinna zwrócić undefined gdy ID jest błędne (Anti-Hallucination)', () => {
      const product = getProductById('to-id-nie-istnieje-openai-wymyślił');
      expect(product).toBeUndefined();
    });

    it('powinna znaleźć Redox Hardcore 2.0', () => {
      const product = getProductById('redoxHardcore');
      expect(product).toBeDefined();
      expect(product?.name).toContain('Redox Hardcore');
      expect(product?.containsStimulants).toBe(true);
      expect(product?.price).toBe(140);
    });

    it('NIE powinna znaleźć starego Water Out (został usunięty)', () => {
      const product = getProductById('waterOut');
      expect(product).toBeUndefined();
    });
  });

  describe('getJointProducts (Kategoria Stawowa)', () => {
    it('powinna zwrócić dokładnie 4 produkty stawowe', () => {
      const joints = getJointProducts();
      expect(joints.length).toBe(4);
    });

    it('wszystkie produkty powinny mieć kategorię "joint"', () => {
      const joints = getJointProducts();
      joints.forEach((p) => {
        expect(p.category).toBe('joint');
      });
    });

    it('żaden produkt stawowy nie powinien zawierać stymulantów', () => {
      const joints = getJointProducts();
      joints.forEach((p) => {
        expect(p.containsStimulants).toBe(false);
      });
    });

    it('powinna zawierać Collagen Premium, Collagen Pro, Glucosamine Complex, Flex Guard', () => {
      const joints = getJointProducts();
      const ids = joints.map((p) => p.id);
      expect(ids).toContain('collagenPremium');
      expect(ids).toContain('collagenPro');
      expect(ids).toContain('glucosamineComplex');
      expect(ids).toContain('flexGuard');
    });
  });

  describe('Redox Hardcore 2.0 (Nowy produkt)', () => {
    it('powinien mieć opatentowane składniki w tagach', () => {
      const product = getProductById('redoxHardcore');
      expect(product).toBeDefined();
      expect(product!.tags).toContain('Sinetrol');
      expect(product!.tags).toContain('Capsimax');
    });

    it('powinien mieć kategorię fat-burner', () => {
      const product = getProductById('redoxHardcore');
      expect(product!.category).toBe('fat-burner');
    });

    it('powinien mieć poprawny URL obrazka i sklepu', () => {
      const product = getProductById('redoxHardcore');
      expect(product!.imageUrl).toContain('Redox_Hardcore_2.0');
      expect(product!.shopUrl).toContain('opis39427');
    });
  });

  describe('Integralność bazy produktów', () => {
    it('wszystkie produkty powinny mieć unikalne ID', () => {
      const ids = products.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('wszystkie crossSellId powinny wskazywać na istniejące produkty lub być null', () => {
      products.forEach((p) => {
        if (p.crossSellId !== null) {
          const crossSell = getProductById(p.crossSellId);
          expect(crossSell).toBeDefined();
        }
      });
    });

    it('baza powinna zawierać co najmniej 21 produktów', () => {
      expect(products.length).toBeGreaterThanOrEqual(21);
    });
  });
});
