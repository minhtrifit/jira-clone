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

// Get project from PROEJCT_LIST by projectId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, COLLECTION_NAME.PROJECT_LIST, id);
    const docSnap = await getDoc(docRef);

    return NextResponse.json(
      { id: docRef.id, ...docSnap.data() },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get projects by workspace iD failed:", error.message);

    return NextResponse.json(
      { error: "Get projects by workspace iD failed" },
      { status: 500 }
    );
  }
}
