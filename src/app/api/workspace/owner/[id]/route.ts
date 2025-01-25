import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { WORKSPACE_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Owner ID is required" },
        { status: 400 }
      );
    }

    const workspaceRef = collection(db, COLLECTION_NAME.WORKSPACE_LIST);
    const q = query(workspaceRef, where("ownerId", "==", id));
    const querySnapshot = await getDocs(q);

    const workspaces: WORKSPACE_TYPE[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(workspaces, { status: 200 });
  } catch (error: any) {
    console.error("Get workspace by owner failed:", error.message);

    return NextResponse.json(
      { error: "Get workspace by owner failed" },
      { status: 500 }
    );
  }
}
