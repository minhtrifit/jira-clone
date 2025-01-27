import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { TASK_TYPE } from "@/types";
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

    const body: TASK_TYPE = await req.json();

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

    if (!body.assigneeId || typeof body.assigneeId !== "string") {
      return NextResponse.json(
        { error: "Assignee ID is required and must be a string" },
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

    const updateTask: TASK_TYPE = {
      ...body,
      updatedAt: serverTimestamp() as Timestamp,
    };

    const docRef = doc(db, COLLECTION_NAME.TASK_LIST, id);
    await updateDoc(docRef, updateTask as any);

    return NextResponse.json({ id: docRef.id, ...updateTask }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
