import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import { USER_TYPE } from "@/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    let user: USER_TYPE | null = null;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const result = await admin.auth().listUsers();

    result.users.forEach((userRecord) => {
      if (userRecord.uid === id) user = userRecord;
    });

    if (user === null) NextResponse.json(null, { status: 404 });

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Get workspace by owner failed:", error.message);

    return NextResponse.json(
      { error: "Get workspace by owner failed" },
      { status: 500 }
    );
  }
}
