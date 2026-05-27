# Firebase Firestore Structure

This app uses Cloud Firestore collections (Firestore does not use SQL tables).

## Collections

### `places`
Document ID: `placeId`

```ts
{
  id: string,
  name: string,
  address: string,
  buildingImage?: string,
  location: { latitude: number, longitude: number },
  productIds: string[],
  createdAt: number,
  updatedAt: number
}
```

### `products`
Document ID: `productId`

```ts
{
  id: string,
  placeId: string,
  name: string,
  type: "cake" | "sandwich" | "pastry",
  originalPrice: number,
  discountedPrice: number,
  discountPercentage: number,
  quantityLeft: number,
  image: string,
  description: string,
  expiringInHours: number,
  freshnessGuarantee: boolean,
  createdAt: number,
  updatedAt: number
}
```

### `curated_listings`
Document ID: `listingId`

```ts
{
  id: string,
  productId: string,
  title: string,
  description: string,
  image: string,
  price: number,
  discountPercent: number,
  createdAt: number,
  updatedAt: number
}
```

### `users`
Document ID: `uid`

```ts
{
  uid: string,
  email: string,
  fullName: string,
  createdAt: number,
  updatedAt: number
}
```

### `user_stats`
Document ID: `uid`

```ts
{
  userId: string,
  unreadNotifications: number,
  ordersCount: number,
  updatedAt: number
}
```

### `notifications`
Document ID: `notificationId`

```ts
{
  id: string,
  userId: string,
  productId: string,
  vendor: string,
  image: string,
  title: string,
  body: string,
  tag: string,
  oldPrice?: number,
  newPrice?: number,
  type: "discount" | "upcoming",
  read: boolean,
  createdAt: number
}
```

### `orders`
Document ID: `orderId`

```ts
{
  id: string,
  userId: string,
  productId: string,
  placeId: string,
  quantity: number,
  totalAmount: number,
  status: "pending" | "paid" | "cancelled" | "completed",
  createdAt: number
}
```

## Auto Bootstrap

On app start (once), the app seeds mock catalog data:

- `places/*`
- `products/*`
- `curated_listings/*`
- `seed_meta/catalog_v1`

When a user signs up, the app creates:

- `users/{uid}`
- `user_stats/{uid}`
- multiple `notifications/{uid}_{notificationId}` seeded from visible in-app feed
