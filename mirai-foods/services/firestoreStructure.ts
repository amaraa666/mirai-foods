import { doc, setDoc, writeBatch } from "firebase/firestore";
import { createInitialNotifications } from "@/constants/notificationsFeed";
import {
  COLLECTIONS,
  type UserDoc,
  type UserStatsDoc,
} from "@/constants/firestoreSchema";
import { firestoreDb } from "@/lib/firebase";

export async function createUserFirestoreStructure(params: {
  uid: string;
  email: string;
  fullName: string;
}) {
  const now = Date.now();
  const appNotifications = createInitialNotifications();

  const userDoc: UserDoc = {
    uid: params.uid,
    email: params.email,
    fullName: params.fullName,
    createdAt: now,
    updatedAt: now,
  };

  const statsDoc: UserStatsDoc = {
    userId: params.uid,
    unreadNotifications: appNotifications.length,
    ordersCount: 0,
    updatedAt: now,
  };

  await Promise.all([
    setDoc(doc(firestoreDb, COLLECTIONS.users, params.uid), userDoc, {
      merge: true,
    }),
    setDoc(doc(firestoreDb, COLLECTIONS.userStats, params.uid), statsDoc, {
      merge: true,
    }),
  ]);

  const batch = writeBatch(firestoreDb);

  for (const item of appNotifications) {
    const notificationId = `${params.uid}_${item.id}`;
    batch.set(doc(firestoreDb, COLLECTIONS.notifications, notificationId), {
      id: notificationId,
      userId: params.uid,
      productId: item.productId,
      vendor: item.vendor,
      image: item.image,
      title: item.title,
      body: item.note ?? `${item.tag} deal is available now.`,
      tag: item.tag,
      oldPrice: item.oldPrice ?? null,
      newPrice: item.newPrice ?? null,
      type: item.isDiscount ? "discount" : "upcoming",
      read: false,
      createdAt: item.createdAt,
    });
  }

  await batch.commit();
}
