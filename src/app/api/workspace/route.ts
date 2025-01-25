import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { WORKSPACE_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

const formattedDate = dayjs().format("DD/MM/YYYY HH:mm:ss");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.ownerId || typeof body.ownerId !== "string") {
      return NextResponse.json(
        { error: "Owner is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.joinUrl || typeof body.joinUrl !== "string") {
      return NextResponse.json(
        { error: "Join URL is required and must be a string" },
        { status: 400 }
      );
    }

    const workspaceRef = collection(db, COLLECTION_NAME.WORKSPACE_LIST);

    const newWorkspace: WORKSPACE_TYPE = {
      ownerId: body.ownerId,
      name: body.name,
      avatarUrl: "",
      joinUrl: body.joinUrl,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    const docRef = await addDoc(workspaceRef, newWorkspace);

    return NextResponse.json(
      { id: docRef.id, ...newWorkspace },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
