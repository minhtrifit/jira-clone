import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { PROJECT_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

// Get projects from PROEJCT_LIST by workspaceId
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

    const projectRef = collection(db, COLLECTION_NAME.PROJECT_LIST);
    const q = query(
      projectRef,
      where("workspaceId", "==", id),
      orderBy("createdAt", "desc") // Need to create index: Get project by workspace ID failed: The query requires an index. You can create it here:
    );
    const querySnapshot = await getDocs(q);

    const projects: PROJECT_TYPE[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    console.error("Get projects by workspace iD failed:", error.message);

    return NextResponse.json(
      { error: "Get projects by workspace iD failed" },
      { status: 500 }
    );
  }
}
