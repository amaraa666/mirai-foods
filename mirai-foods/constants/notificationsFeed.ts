import { curatedListings, getDisplayProduct, places } from "@/constants/data";

export type AppNotification = {
  id: string;
  productId: string;
  vendor: string;
  title: string;
  image: string;
  tag: string;
  note?: string;
  isDiscount: boolean;
  oldPrice?: number;
  newPrice?: number;
  cta: string;
  read: boolean;
  /** Unix ms when notification was received */
  createdAt: number;
};

/** Minutes before now for each listing (staggered feed times) */
const CREATED_MINUTES_AGO = [8, 35, 95, 280, 720];

export function createInitialNotifications(): AppNotification[] {
  const now = Date.now();

  return curatedListings.map((l, index) => {
    const product = getDisplayProduct(l.productId);
    const place = places.find((p) => p.id === product?.placeId);
    const isDiscount = index !== 1;
    const minutesAgo = CREATED_MINUTES_AGO[index] ?? (index + 1) * 60;

    return {
      id: l.id,
      productId: l.productId,
      vendor: (place?.name ?? "LOCAL ARTISAN").toUpperCase(),
      title: l.title,
      image: l.image,
      tag: isDiscount
        ? index === 0
          ? "FLASH SALE"
          : index === 2
            ? "NEW"
            : "SPECIAL"
        : "UPCOMING",
      note: isDiscount ? undefined : "Available 08:00 AM",
      isDiscount,
      oldPrice: isDiscount ? product?.originalPrice : undefined,
      newPrice: isDiscount ? product?.discountedPrice : undefined,
      cta: "Notify",
      read: false,
      createdAt: now - minutesAgo * 60 * 1000,
    };
  });
}
