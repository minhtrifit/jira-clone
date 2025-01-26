import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { JOIN_WORKSPACE_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

// Get workspaces from WORKSPACE_JOIN_LIST by workspaceId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const workspaceRef = collection(db, COLLECTION_NAME.WORKSPACE_JOIN_LIST);
    const q = query(workspaceRef, where("workspaceId", "==", id));
    const querySnapshot = await getDocs(q);

    const workspaces: JOIN_WORKSPACE_TYPE[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(workspaces, { status: 200 });
  } catch (error: any) {
    console.error("Get workspace by ID failed:", error.message);

    return NextResponse.json(
      { error: "Get workspace by ID failed" },
      { status: 500 }
    );
  }
}
