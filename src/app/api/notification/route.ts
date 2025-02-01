import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { NOTIFICATION_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body: NOTIFICATION_TYPE = await req.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.url || typeof body.url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.senderId || typeof body.senderId !== "string") {
      return NextResponse.json(
        { error: "Sender ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.receiverId || typeof body.receiverId !== "string") {
      return NextResponse.json(
        { error: "Receiver ID is required and must be a string" },
        { status: 400 }
      );
    }

    const notificationRef = collection(db, COLLECTION_NAME.NOTIFICATION_LIST);

    const newNotification: NOTIFICATION_TYPE = {
      ...body,
      isSeen: false,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(notificationRef, newNotification);

    return NextResponse.json(
      { id: docRef.id, ...newNotification },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
