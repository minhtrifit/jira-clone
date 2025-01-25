import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { WORKSPACE_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.joinUrl || typeof body.joinUrl !== "string") {
      return NextResponse.json(
        { error: "Join URL is required and must be a string" },
        { status: 400 }
      );
    }

    const workspaceRef = collection(db, COLLECTION_NAME.WORKSPACE_LIST);
    const q = query(workspaceRef, where("joinUrl", "==", body.joinUrl));
    const querySnapshot = await getDocs(q);

    const workspace: WORKSPACE_TYPE = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];

    return NextResponse.json(workspace, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
