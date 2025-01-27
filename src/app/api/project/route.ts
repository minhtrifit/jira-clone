import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { PROJECT_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.workspaceId || typeof body.workspaceId !== "string") {
      return NextResponse.json(
        { error: "Workspace ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    const projectRef = collection(db, COLLECTION_NAME.PROJECT_LIST);

    const newProject: PROJECT_TYPE = {
      name: body.name,
      avatarUrl: "",
      workspaceId: body.workspaceId,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(projectRef, newProject);

    return NextResponse.json({ id: docRef.id, ...newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
