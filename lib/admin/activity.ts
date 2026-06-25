"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase/client";
import type { ActivityAction } from "@/types/admin";

type ActivityInput = {
  user: User | null;
  action: ActivityAction;
  entityType: string;
  entityId: string;
  entityLabel: string;
};

export async function logAdminActivity(input: ActivityInput) {
  if (!db || !input.user) {
    return;
  }

  try {
    await addDoc(collection(db, "activityLogs"), {
      userId: input.user.uid,
      userEmail: input.user.email || "administrator",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      entityLabel: input.entityLabel,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("Nie udało się zapisać historii aktywności:", error);
  }
}
