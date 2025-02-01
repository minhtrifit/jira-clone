import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { NOTIFICATION_TYPE } from "@/types";
import { COLLECTION_NAME } from "@/lib/utils";

// Get notifications from NOTIFICATION_LIST by receiverId
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { error: "Receiver ID ID is required" },
        { status: 400 }
      );
    }

    const notificationRef = collection(db, COLLECTION_NAME.NOTIFICATION_LIST);
    const q = query(
      notificationRef,
      where("receiverId", "==", id),
      orderBy("createdAt", "asc") // Need to create index: Get project by workspace ID failed: The query requires an index. You can create it here:
    );
    const querySnapshot = await getDocs(q);

    const notifcations: NOTIFICATION_TYPE[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(notifcations, { status: 200 });
  } catch (error: any) {
    console.error("Get notifications by receiver ID failed:", error.message);

    return NextResponse.json(
      { error: "Get notifications by receiver ID failed" },
      { status: 500 }
    );
  }
}
