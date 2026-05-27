export interface Product {
  id: string;
  placeId: string;
  name: string;
  type: 'cake' | 'sandwich' | 'pastry';
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  quantityLeft: number;
  image: string;
  description: string;
  expiringInHours: number; // <1 for red, else green
  freshnessGuarantee: boolean;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  /** Storefront / building photo for seller page */
  buildingImage?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  products: Product[];
}

export const places: Place[] = [
  {
    id: 'p1',
    name: 'Maison Savor',
    address: '4 Chinggis Ave',
    buildingImage:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80',
    location: { latitude: 47.9138, longitude: 106.9139 },
    products: [
      {
        id: '1',
        placeId: 'p1',
        name: 'Chocolate Truffle Cake',
        type: 'cake',
        originalPrice: 45,
        discountedPrice: 30,
        discountPercentage: 33,
        quantityLeft: 5,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Rich chocolate cake with truffle filling',
        expiringInHours: 0.8,
        freshnessGuarantee: true,
      },
      {
        id: '2',
        placeId: 'p1',
        name: 'Matcha Roll',
        type: 'pastry',
        originalPrice: 7,
        discountedPrice: 5,
        discountPercentage: 29,
        quantityLeft: 8,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Soft roll with cream and matcha powder',
        expiringInHours: 1.3,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p2',
    name: 'Mongolian Bakery',
    address: '13 Peace Ave',
    buildingImage:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80',
    location: { latitude: 47.9081, longitude: 106.8851 },
    products: [
      {
        id: '3',
        placeId: 'p2',
        name: 'Blueberry Cheesecake',
        type: 'cake',
        originalPrice: 55,
        discountedPrice: 38,
        discountPercentage: 31,
        quantityLeft: 4,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Creamy cheesecake with blueberry topping and crunchy crust',
        expiringInHours: 1.5,
        freshnessGuarantee: true,
      },
      {
        id: '4',
        placeId: 'p2',
        name: 'Almond Croissant',
        type: 'pastry',
        originalPrice: 9,
        discountedPrice: 7,
        discountPercentage: 22,
        quantityLeft: 6,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Flaky pastry with almond filling',
        expiringInHours: 2.2,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p3',
    name: 'Golden Dough',
    address: '20 Peace Ave',
    buildingImage:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80',
    location: { latitude: 47.9103, longitude: 106.9163 },
    products: [
      {
        id: '5',
        placeId: 'p3',
        name: 'Cinnamon Roll',
        type: 'pastry',
        originalPrice: 7,
        discountedPrice: 4,
        discountPercentage: 43,
        quantityLeft: 10,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Warm cinnamon roll with sweet glaze',
        expiringInHours: 0.6,
        freshnessGuarantee: true,
      },
      {
        id: '6',
        placeId: 'p3',
        name: 'Ham Cheese Sandwich',
        type: 'sandwich',
        originalPrice: 12,
        discountedPrice: 9,
        discountPercentage: 25,
        quantityLeft: 7,
              image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Toasted sandwich with ham, cheese, and salad',
        expiringInHours: 3.5,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p4',
    name: 'Cupcake Lounge',
    address: '7 Ulaanbaatar St',
    buildingImage:
      'https://images.unsplash.com/photo-1466978913421-0a684ee1bfe5?w=900&q=80',
    location: { latitude: 47.9145, longitude: 106.9247 },
    products: [
      {
        id: '7',
        placeId: 'p4',
        name: 'Red Velvet Cupcake',
        type: 'cake',
        originalPrice: 8,
        discountedPrice: 5,
        discountPercentage: 37,
        quantityLeft: 12,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Soft red velvet cupcake with cream cheese frosting',
        expiringInHours: 1.8,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p5',
    name: 'City Slice Bakery',
    address: '2 Narnii Zam',
    buildingImage:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    location: { latitude: 47.9213, longitude: 106.9182 },
    products: [
      {
        id: '8',
        placeId: 'p5',
        name: 'Cheese Danish',
        type: 'pastry',
        originalPrice: 6,
        discountedPrice: 4,
        discountPercentage: 33,
        quantityLeft: 15,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Buttery pastry with sweet cheese filling',
        expiringInHours: 2.4,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p6',
    name: 'Sweet Morning',
    address: '11 Sukhbaatar Square',
    location: { latitude: 47.9212, longitude: 106.9056 },
    products: [
      {
        id: '9',
        placeId: 'p6',
        name: 'Coconut Tart',
        type: 'pastry',
        originalPrice: 9,
        discountedPrice: 6,
        discountPercentage: 33,
        quantityLeft: 9,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Crisp tart with creamy coconut almond filling',
        expiringInHours: 2.1,
        freshnessGuarantee: true,
      },
      {
        id: '10',
        placeId: 'p6',
        name: 'Smoked Salmon Bagel',
        type: 'sandwich',
        originalPrice: 14,
        discountedPrice: 11,
        discountPercentage: 21,
        quantityLeft: 8,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Bagel with cream cheese, salmon, and arugula',
        expiringInHours: 3.8,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p7',
    name: 'Mezza Bakery',
    address: '25 Seoul St',
    location: { latitude: 47.9045, longitude: 106.9223 },
    products: [
      {
        id: '11',
        placeId: 'p7',
        name: 'Garlic Bread',
        type: 'sandwich',
        originalPrice: 7,
        discountedPrice: 5,
        discountPercentage: 29,
        quantityLeft: 18,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Toasted bread topped with garlic butter and parmesan',
        expiringInHours: 4.0,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p8',
    name: 'Deli Corner',
    address: '33 Zaisan Road',
    location: { latitude: 47.8903, longitude: 106.9440 },
    products: [
      {
        id: '12',
        placeId: 'p8',
        name: 'Banana Bread',
        type: 'cake',
        originalPrice: 10,
        discountedPrice: 7,
        discountPercentage: 30,
        quantityLeft: 12,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Moist banana bread with walnuts',
        expiringInHours: 1.7,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p9',
    name: 'Highland Bakery',
    address: '55 Peace Ave',
    location: { latitude: 47.9244, longitude: 106.9231 },
    products: [
      {
        id: '13',
        placeId: 'p9',
        name: 'Black Forest Cake',
        type: 'cake',
        originalPrice: 50,
        discountedPrice: 34,
        discountPercentage: 32,
        quantityLeft: 4,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Chocolate cake with cherries and whipped cream',
        expiringInHours: 1.2,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p10',
    name: 'Morning Crush',
    address: '10 Narlag Ave',
    location: { latitude: 47.9149, longitude: 106.9238 },
    products: [
      {
        id: '14',
        placeId: 'p10',
        name: 'Egg Salad Sandwich',
        type: 'sandwich',
        originalPrice: 9,
        discountedPrice: 7,
        discountPercentage: 22,
        quantityLeft: 10,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Classic egg salad on sourdough',
        expiringInHours: 3.2,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p11',
    name: 'Elegant Bakes',
    address: '18 Sukhbaatar St',
    location: { latitude: 47.9208, longitude: 106.9127 },
    products: [
      {
        id: '15',
        placeId: 'p11',
        name: 'Pecan Pie',
        type: 'cake',
        originalPrice: 42,
        discountedPrice: 29,
        discountPercentage: 31,
        quantityLeft: 6,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Sweet pecan pie with flaky crust',
        expiringInHours: 2.0,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p12',
    name: 'Dough Delight',
    address: '31 Narcissus Mach',
    location: { latitude: 47.9157, longitude: 106.9277 },
    products: [
      {
        id: '16',
        placeId: 'p12',
        name: 'Red Bean Puff',
        type: 'pastry',
        originalPrice: 6,
        discountedPrice: 4,
        discountPercentage: 33,
        quantityLeft: 15,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Crispy puff with sweet red bean paste',
        expiringInHours: 1.3,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p13',
    name: 'Bakery Boulevard',
    address: '42 Peace Ave',
    location: { latitude: 47.9227, longitude: 106.9132 },
    products: [
      {
        id: '17',
        placeId: 'p13',
        name: 'Garlic Cream Roll',
        type: 'pastry',
        originalPrice: 7,
        discountedPrice: 5,
        discountPercentage: 29,
        quantityLeft: 13,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Savory roll with garlic cream center',
        expiringInHours: 2.4,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p14',
    name: 'City Oven',
    address: '16 Gorkhi',
    location: { latitude: 47.9152, longitude: 106.9087 },
    products: [
      {
        id: '18',
        placeId: 'p14',
        name: 'Multi-grain Baguette',
        type: 'sandwich',
        originalPrice: 8,
        discountedPrice: 6,
        discountPercentage: 25,
        quantityLeft: 14,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Crunchy baguette with seeds and herbs',
        expiringInHours: 3.4,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p15',
    name: 'Rose Corner',
    address: '19 Dashbalbar',
    location: { latitude: 47.9165, longitude: 106.9183 },
    products: [
      {
        id: '19',
        placeId: 'p15',
        name: 'Carrot Cake',
        type: 'cake',
        originalPrice: 48,
        discountedPrice: 33,
        discountPercentage: 31,
        quantityLeft: 5,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Moist carrot cake with cream cheese icing',
        expiringInHours: 1.6,
        freshnessGuarantee: true,
      },
    ],
  },
  {
    id: 'p16',
    name: 'Nordic Bakes',
    address: '22 Nordic Ave',
    location: { latitude: 47.9140, longitude: 106.9280 },
    products: [
      {
        id: '20',
        placeId: 'p16',
        name: 'Lemon Meringue Pie',
        type: 'cake',
        originalPrice: 52,
        discountedPrice: 37,
        discountPercentage: 29,
        quantityLeft: 5,
        image: 'https://cdn.greensoft.mn/uploads/site/1200/product/new_8c5d47b17c9a4d8c17e57d10c74ff88b730f3504.png',
        description: 'Tart lemon filling topped with toasted meringue',
        expiringInHours: 1.1,
        freshnessGuarantee: true,
      },
    ],
  },
];

export const mockProducts: Product[] = places.flatMap((place) =>
  place.products.map((product) => ({
    ...product,
    placeId: place.id,
  })),
);

/** Home feed listings — each links to a real product by productId */
export interface CuratedListing {
  id: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discountPercent: number;
}

export const curatedListings: CuratedListing[] = [
  {
    id: 'listing-1',
    productId: '1',
    title: 'Truffle Brioche Club',
    description:
      'Triple-creme brie, house-made truffle aioli, and sun-dried tomatoes on toasted brioche.',
    image:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    price: 18,
    discountPercent: 40,
  },
  {
    id: 'listing-2',
    productId: '3',
    title: 'Mini Croissants',
    description: 'Buttery, flaky croissants baked fresh this morning — box of six.',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&q=80',
    price: 12,
    discountPercent: 25,
  },
  {
    id: 'listing-3',
    productId: '5',
    title: 'Cinnamon Roll Box',
    description: 'Warm cinnamon rolls with sweet glaze, perfect for sharing.',
    image:
      'https://images.unsplash.com/photo-1612203985729-70726954388c?w=800&q=80',
    price: 15,
    discountPercent: 30,
  },
  {
    id: 'listing-4',
    productId: '7',
    title: 'Red Velvet Cupcake',
    description: 'Soft red velvet with cream cheese frosting — artisan batch.',
    image:
      'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&q=80',
    price: 18,
    discountPercent: 50,
  },
  {
    id: 'listing-5',
    productId: '8',
    title: 'Cheese Danish',
    description: 'Buttery pastry with sweet cheese filling, baked to golden perfection.',
    image:
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
    price: 22,
    discountPercent: 20,
  },
];

export function getCuratedListing(productId: string): CuratedListing | undefined {
  return curatedListings.find((l) => l.productId === productId);
}

/** Product IDs shown on the home (main) menu */
export const mainMenuProductIds = new Set(
  curatedListings.map((listing) => listing.productId)
);

export function isMainMenuProduct(productId: string): boolean {
  return mainMenuProductIds.has(productId);
}

/** Places that sell at least one main-menu product */
export function getMainMenuPlaces(): Place[] {
  return places.filter((place) =>
    place.products.some((p) => isMainMenuProduct(p.id))
  );
}

export function getPlaceById(placeId: string): Place | undefined {
  return getMainMenuPlaces().find((p) => p.id === placeId);
}

export function getPlaceBuildingImage(
  place: Place,
  fallbackProductImage?: string
): string | undefined {
  return place.buildingImage ?? fallbackProductImage;
}

/** Product merged with curated display fields (same item on home, detail, cart) */
export function getDisplayProduct(productId: string): Product | undefined {
  const listing = getCuratedListing(productId);
  const base = mockProducts.find((p) => p.id === productId);
  if (!listing || !base) return undefined;
  return {
    ...base,
    name: listing.title,
    description: listing.description,
    image: listing.image,
    discountedPrice: listing.price,
    discountPercentage: listing.discountPercent,
    originalPrice: Math.round(
      (listing.price / (1 - listing.discountPercent / 100)) * 100,
    ) / 100,
  };
}

/** Menu items for a place — main-menu products only */
export function getPlaceMenuProducts(place: Place): Product[] {
  return place.products
    .map((p) => getDisplayProduct(p.id))
    .filter((p): p is Product => p != null)
    .sort((a, b) => b.discountPercentage - a.discountPercentage);
}

export type SearchResult =
  | {
      type: "product";
      id: string;
      title: string;
      subtitle: string;
      image: string;
      price: number;
    }
  | {
      type: "place";
      id: string;
      title: string;
      subtitle: string;
      image: string;
    };

/** Search main-menu sellers and products by name, address, or description */
export function searchMainMenu(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const place of getMainMenuPlaces()) {
    const haystack = `${place.name} ${place.address}`.toLowerCase();
    if (haystack.includes(q)) {
      const menu = getPlaceMenuProducts(place);
      results.push({
        type: "place",
        id: place.id,
        title: place.name,
        subtitle: place.address,
        image:
          getPlaceBuildingImage(place, menu[0]?.image) ?? "",
      });
    }
  }

  for (const listing of curatedListings) {
    const product = getDisplayProduct(listing.productId);
    if (!product) continue;
    const place = getPlaceById(product.placeId);
    const haystack =
      `${listing.title} ${listing.description} ${product.name} ${place?.name ?? ""}`.toLowerCase();
    if (haystack.includes(q)) {
      results.push({
        type: "product",
        id: product.id,
        title: listing.title,
        subtitle: place ? `${place.name} · $${listing.price.toFixed(2)}` : `$${listing.price.toFixed(2)}`,
        image: listing.image,
        price: listing.price,
      });
    }
  }

  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.type}-${r.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
