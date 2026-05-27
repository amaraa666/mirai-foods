export const COLLECTIONS = {
  users: "users",
  notifications: "notifications",
  userStats: "user_stats",
  orders: "orders",
  places: "places",
  products: "products",
  curatedListings: "curated_listings",
  seedMeta: "seed_meta",
} as const;

export type UserDoc = {
  uid: string;
  email: string;
  fullName: string;
  createdAt: number;
  updatedAt: number;
};

export type NotificationDoc = {
  id: string;
  userId: string;
  productId: string;
  vendor: string;
  image: string;
  title: string;
  body: string;
  tag: string;
  oldPrice?: number;
  newPrice?: number;
  type: "discount" | "upcoming";
  read: boolean;
  createdAt: number;
};

export type UserStatsDoc = {
  userId: string;
  unreadNotifications: number;
  ordersCount: number;
  updatedAt: number;
};

export type OrderDoc = {
  id: string;
  userId: string;
  productId: string;
  placeId: string;
  quantity: number;
  totalAmount: number;
  status: "pending" | "paid" | "cancelled" | "completed";
  createdAt: number;
};

export type PlaceDoc = {
  id: string;
  name: string;
  address: string;
  buildingImage?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  productIds: string[];
  createdAt: number;
  updatedAt: number;
};

export type ProductDoc = {
  id: string;
  placeId: string;
  name: string;
  type: "cake" | "sandwich" | "pastry";
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  quantityLeft: number;
  image: string;
  description: string;
  expiringInHours: number;
  freshnessGuarantee: boolean;
  createdAt: number;
  updatedAt: number;
};

export type CuratedListingDoc = {
  id: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  discountPercent: number;
  createdAt: number;
  updatedAt: number;
};
