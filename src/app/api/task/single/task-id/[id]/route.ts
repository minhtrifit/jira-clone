import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { PROJECT_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

// Get task from TASK_LIST by taskId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, COLLECTION_NAME.TASK_LIST, id);
    const docSnap = await getDoc(docRef);

    return NextResponse.json(
      { id: docRef.id, ...docSnap.data() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get task by task ID failed:", error.message);

    return NextResponse.json(
      { error: "Get task by task ID failed" },
      { status: 500 }
    );
  }
}
