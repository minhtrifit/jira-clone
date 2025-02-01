import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { serverTimestamp, Timestamp, doc, updateDoc } from "firebase/firestore";
import { NOTIFICATION_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

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

    if (!body.isSeen) {
      return NextResponse.json(
        { error: "isSeen is required" },
        { status: 400 }
      );
    }

    const updateNotification: NOTIFICATION_TYPE = {
      ...body,
      updatedAt: serverTimestamp() as Timestamp,
    };

    const docRef = doc(db, COLLECTION_NAME.NOTIFICATION_LIST, id);
    await updateDoc(docRef, updateNotification as any);

    return NextResponse.json(
      { id: docRef.id, ...updateNotification },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
