/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { adminDB } from "@/config/firebaseServer";
import fs from "fs";
import path from "path";

// 🧩 Helper function to save files locally
async function saveFileLocally(file: File, folder: string, userUid: string) {
  // Convert to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create upload directory
  const uploadDir = path.join(process.cwd(), "uploads", userUid, folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create file path
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, safeName);

  // Write file
  await fs.promises.writeFile(filePath, buffer);

  // Return relative path for Firestore
  return `uploads/${userUid}/${folder}/${safeName}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userUid = formData.get("userUid") as string;
    if (!userUid) {
      return NextResponse.json({ ok: false, message: "Missing userUid" }, { status: 400 });
    }

    // Extract base fields
    const name = (formData.get("name") as string) || "";
    const email = (formData.get("email") as string) || "";
    const github = (formData.get("github") as string) || "";
    const linkedin = (formData.get("linkedin") as string) || "";
    const dob = (formData.get("dob") as string) || "";
    const education = formData.get("education")
      ? JSON.parse(formData.get("education") as string)
      : {};

    const certifications: any[] = [];
    const workExperiences: any[] = [];
    const achievements: any[] = [];

    // Parse loop
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("certifications")) {
        const match = key.match(/certifications\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [_, iStr, field] = match;
          const i = parseInt(iStr);
          if (!certifications[i]) certifications[i] = {};
          certifications[i][field] = value instanceof File ? value : String(value);
        }
      }

      if (key.startsWith("workExperiences")) {
        const match = key.match(/workExperiences\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [_, iStr, field] = match;
          const i = parseInt(iStr);
          if (!workExperiences[i]) workExperiences[i] = {};
          workExperiences[i][field] = value instanceof File ? value : String(value);
        }
      }

      if (key.startsWith("achievements")) {
        const match = key.match(/achievements\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const [_, iStr, field] = match;
          const i = parseInt(iStr);
          if (!achievements[i]) achievements[i] = {};
          achievements[i][field] = value instanceof File ? value : String(value);
        }
      }
    }

    // Save files locally
    for (const cert of certifications) {
      if (cert.certificate instanceof File) {
        const filePath = await saveFileLocally(cert.certificate, "certificates", userUid);
        cert.certificatePath = filePath;
        delete cert.certificate;
      }
    }

    for (const exp of workExperiences) {
      if (exp.experienceLetter instanceof File) {
        const filePath = await saveFileLocally(exp.experienceLetter, "experience_letters", userUid);
        exp.experienceLetterPath = filePath;
        delete exp.experienceLetter;
      }
    }

    for (const ach of achievements) {
      if (ach.certificate instanceof File) {
        const filePath = await saveFileLocally(ach.certificate, "achievements", userUid);
        ach.certificatePath = filePath;
        delete ach.certificate;
      }
    }

    // Build JSON for Python
    const profilePayload = {
      uid: userUid,
      name,
      email,
      github,
      linkedin,
      dob,
      education,
      workExperiences,
      certifications,
      achievements,
    };

    // Call FastAPI (expects JSON)
    const pythonResponse = await fetch("http://127.0.0.1:8000/process_profile", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData,
    });

    const pythonResult = await pythonResponse.json();
    console.log("Python result:", pythonResult);

    // Save to Firestore
    const finalData = {
      ...profilePayload,
      updatedAt: new Date().toISOString(),
      gemini_result: pythonResult || null,
    };

    await adminDB.collection("user_profile").doc(userUid).set(finalData, { merge: true });

    return NextResponse.json({
      ok: true,
      message: "Profile saved successfully",
      data: finalData,
    });
  } catch (error: any) {
    console.error("Error uploading user profile:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
    if (!uid) {
      return NextResponse.json({ ok: false, message: "Missing user UID" }, { status: 400 });
    }

    const userRef = adminDB.collection("user_profile").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { ok: true, data: null, message: "No profile found" },
        { status: 300 }
      );
    }

    return NextResponse.json({ ok: true, data: doc.data() });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
}
