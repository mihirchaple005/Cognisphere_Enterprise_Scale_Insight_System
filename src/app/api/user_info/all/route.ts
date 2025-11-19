import { NextResponse } from "next/server";
import { adminDB } from "@/config/firebaseServer"; // your admin instance

export async function GET() {
  try {
    const snapshot = await adminDB.collection("ekg_users").get();
    const users = snapshot.docs.map((doc) => ({
      uid: doc.id,
      name: doc.data().name || "",
      email: doc.data().email || "",
      isAccepted: doc.data().isAccepted || false,
      github: doc.data().github || "",
      linkedin: doc.data().linkedin || "",
      dob: doc.data().dob || "",
    }));

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    console.error("🔥 Firestore Fetch Error:", error);
    return NextResponse.json(
      { ok: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
