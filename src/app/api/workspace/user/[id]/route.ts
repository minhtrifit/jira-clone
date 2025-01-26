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

// Get workspaces from WORKSPACE_JOIN_LIST by userId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const joinWorkspaceRef = collection(
      db,
      COLLECTION_NAME.WORKSPACE_JOIN_LIST
    );
    // const q = query(joinWorkspaceRef, where("userId", "==", id));
    const q = query(
      joinWorkspaceRef,
      where("userId", "==", id),
      orderBy("createdAt", "desc") // Need to create index: Get workspace by user ID failed: The query requires an index. You can create it here:
    );
    const querySnapshot = await getDocs(q);

    const joinWorkspaces: JOIN_WORKSPACE_TYPE[] = querySnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    const workspaces: WORKSPACE_TYPE[] = [];

    for (let i = 0; i < joinWorkspaces.length; ++i) {
      const workspaceId = joinWorkspaces[i]?.workspaceId;

      if (workspaceId) {
        const docRef = doc(db, COLLECTION_NAME.WORKSPACE_LIST, workspaceId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          return NextResponse.json(
            { error: "Workspace not found" },
            { status: 404 }
          );
        }

        const workspace = { id: docSnap.id, ...docSnap.data() };
        workspaces.push(workspace);
      }
    }

    console.log(workspaces);

    return NextResponse.json(workspaces, { status: 200 });
  } catch (error: any) {
    console.error("Get workspace by user ID failed:", error.message);

    return NextResponse.json(
      { error: "Get workspace by user ID failed" },
      { status: 500 }
    );
  }
}
