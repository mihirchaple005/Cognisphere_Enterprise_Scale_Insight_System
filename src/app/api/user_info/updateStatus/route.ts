import { NextResponse } from "next/server";
import { adminDB } from "@/config/firebaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uid } = body;

    if (!uid) {
      return NextResponse.json(
        { ok: false, message: "User UID is required" },
        { status: 400 }
      );
    }

    const userRef = adminDB.collection("ekg_users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    await userRef.update({ isAccepted: true });

    return NextResponse.json({
      ok: true,
      message: `User ${uid} status updated to accepted.`,
    });
  } catch (error) {
    console.error("🔥 Firestore Update Error:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}
