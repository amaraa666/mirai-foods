import { doc, getDoc, writeBatch } from "firebase/firestore";
import { curatedListings, mockProducts, places } from "@/constants/data";
import { COLLECTIONS } from "@/constants/firestoreSchema";
import { firestoreDb } from "@/lib/firebase";

const CATALOG_SEED_ID = "catalog_v1";

/**
 * Seed mock catalog data into Firestore collections once.
 * Safe to call repeatedly; it will no-op after first successful seed.
 */
export async function seedMockCatalogIfNeeded() {
  const seedRef = doc(firestoreDb, COLLECTIONS.seedMeta, CATALOG_SEED_ID);
  const existing = await getDoc(seedRef);
  if (existing.exists()) return;

  const now = Date.now();
  const batch = writeBatch(firestoreDb);

  for (const place of places) {
    batch.set(doc(firestoreDb, COLLECTIONS.places, place.id), {
      id: place.id,
      name: place.name,
      address: place.address,
      buildingImage: place.buildingImage ?? null,
      location: place.location,
      productIds: place.products.map((p) => p.id),
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const product of mockProducts) {
    batch.set(doc(firestoreDb, COLLECTIONS.products, product.id), {
      ...product,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const listing of curatedListings) {
    batch.set(doc(firestoreDb, COLLECTIONS.curatedListings, listing.id), {
      ...listing,
      createdAt: now,
      updatedAt: now,
    });
  }

  batch.set(seedRef, {
    id: CATALOG_SEED_ID,
    seededAt: now,
    placesCount: places.length,
    productsCount: mockProducts.length,
    curatedListingsCount: curatedListings.length,
  });

  await batch.commit();
}
