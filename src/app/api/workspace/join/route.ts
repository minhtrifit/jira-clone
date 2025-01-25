import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { JOIN_WORKSPACE_TYPE, WORKSPACE_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

const formattedDate = dayjs().format("DD/MM/YYYY HH:mm:ss");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.workspaceId || typeof body.workspaceId !== "string") {
      return NextResponse.json(
        { error: "Workspace ID is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.userId || typeof body.userId !== "string") {
      return NextResponse.json(
        { error: "User ID is required and must be a string" },
        { status: 400 }
      );
    }

    const joinWorkspaceRef = collection(
      db,
      COLLECTION_NAME.WORKSPACE_JOIN_LIST
    );

    const newJoinWorkspace: JOIN_WORKSPACE_TYPE = {
      workspaceId: body.workspaceId,
      userId: body.userId,
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    const docRef = await addDoc(joinWorkspaceRef, newJoinWorkspace);

    return NextResponse.json(
      { id: docRef.id, ...newJoinWorkspace },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
