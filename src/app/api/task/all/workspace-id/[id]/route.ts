import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { TASK_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

// Get tasks from TASK_LIST by workspaceId
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

    const taskRef = collection(db, COLLECTION_NAME.TASK_LIST);
    const q = query(
      taskRef,
      where("workspaceId", "==", id),
      orderBy("dueAt", "asc") // Need to create index: Get project by workspace ID failed: The query requires an index. You can create it here:
    );
    const querySnapshot = await getDocs(q);

    const tasks: TASK_TYPE[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    console.error("Get tasks by workspace ID failed:", error.message);

    return NextResponse.json(
      { error: "Get tasks by workspace ID failed" },
      { status: 500 }
    );
  }
}
