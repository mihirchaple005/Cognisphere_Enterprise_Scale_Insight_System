/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminAuth, adminDB } from "@/config/firebaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, idToken } = body;

    if (!email || !idToken) {
      return NextResponse.json(
        { ok: false, message: "Email and ID token are required" },
        { status: 400 }
      );
    }

    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 🔍 Check if user already exists by email
    const userRef = adminDB.collection("ekg_users");
    const existingUser = await userRef.where("email", "==", email).limit(1).get();

    if (!existingUser.empty) {
      // user already exists
      return NextResponse.json({
        ok: true,
        message: "User already exists",
        userId: existingUser.docs[0].id,
      });
    }

    // 🆕 If user doesn't exist, create it
    const userData = {
      userId,
      email,
      isAccepted: false,
      role: "user",
    };

    await userRef.doc(userId).set(userData);

    return NextResponse.json({ ok: true, message: "User data saved", userId });
  } catch (error: any) {
    console.error("Error saving user:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}




export async function GET(req: Request) {
  try {
    
    // const idToken = req.headers.get("authorization")?.split("Bearer ")[1];
    const {searchParams}=new URL(req.url);
    const idToken=searchParams.get("idToken");
    if (!idToken) {
      return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
    }

    
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

   
    const doc = await adminDB.collection("ekg_users").doc(userId).get();

    if (!doc.exists) {
      return NextResponse.json({ ok: false, message: "User not found" }, { status: 404 });
    }

    const { isAccepted, role } = doc.data() || {};

    return NextResponse.json({ ok: true, isAccepted, role });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
