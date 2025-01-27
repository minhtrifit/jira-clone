import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { TASK_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.workspaceId || typeof body.workspaceId !== "string") {
      return NextResponse.json(
        { error: "Workspace ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.projectId || typeof body.projectId !== "string") {
      return NextResponse.json(
        { error: "Project ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.status || typeof body.status !== "string") {
      return NextResponse.json(
        { error: "Status is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.dueAt || typeof body.dueAt.toString() !== "string") {
      return NextResponse.json(
        { error: "DueAt is required and must be a timestamp" },
        { status: 400 }
      );
    }

    const projectRef = collection(db, COLLECTION_NAME.TASK_LIST);

    const newTask: TASK_TYPE = {
      name: body.name,
      description: body.description,
      workspaceId: body.workspaceId,
      projectId: body.projectId,
      status: body.status,
      dueAt: body.dueAt,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(projectRef, newTask);

    return NextResponse.json({ id: docRef.id, ...newTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
