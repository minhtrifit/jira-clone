import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { JOIN_WORKSPACE_TYPE, WORKSPACE_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

// Get workspace from WORKSPACE_LIST by workspaceId
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

    const workspaceDocRef = doc(db, COLLECTION_NAME.WORKSPACE_LIST, id);
    const workspaceDocSnap = await getDoc(workspaceDocRef);

    const workspace: WORKSPACE_TYPE = {
      id: workspaceDocSnap.id,
      ...workspaceDocSnap.data(),
    };

    if (!workspace) return NextResponse.json(null, { status: 404 });

    const joinWorkspaceRef = collection(
      db,
      COLLECTION_NAME.WORKSPACE_JOIN_LIST
    );
    const q = query(
      joinWorkspaceRef,
      where("workspaceId", "==", workspace?.id)
    );
    const querySnapshot = await getDocs(q);

    const joinWorkspaces: JOIN_WORKSPACE_TYPE[] = querySnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    workspace.joinUsers = joinWorkspaces ? joinWorkspaces : [];

    return NextResponse.json(workspace, { status: 200 });
  } catch (error: any) {
    console.error("Get workspace by user ID failed:", error.message);

    return NextResponse.json(
      { error: "Get workspace by user ID failed" },
      { status: 500 }
    );
  }
}
