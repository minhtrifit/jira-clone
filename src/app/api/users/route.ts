import { NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";
import { USER_TYPE } from "@/types";

export async function GET(req: Request) {
  try {
    const usersList: USER_TYPE[] = [];
    const result = await admin.auth().listUsers();

    result.users.forEach((userRecord) => {
      usersList.push({
        id: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        photoURL: userRecord.photoURL,
      });
    });

    return NextResponse.json(usersList, { status: 200 });
  } catch (error: any) {
    console.error("Get users failed:", error.message);

    return NextResponse.json({ error: "Get users failed" }, { status: 500 });
  }
}
