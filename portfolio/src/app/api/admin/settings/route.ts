import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { verify } from 'otplib';

const DB_NAME = "portfolio";

interface AdminUpdateData {
  name?: string;
  email?: string;
  bio?: string;
  password?: string;
  avatarUrl?: string;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const config = await db.collection("admin_config").findOne(
      {}, 
      { projection: { password: 0, twoFactorSecret: 0 } }
    );
    
    return NextResponse.json({ success: true, data: config || {} });
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { name, email, bio, avatarUrl, oldPassword, newPassword, authenticatorCode } = await req.json();
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const currentConfig = await db.collection("admin_config").findOne({});
    
    const updateData: AdminUpdateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    
    if (newPassword) {
      if (!oldPassword || !authenticatorCode) {
        return NextResponse.json({ error: "Old password and authenticator code are required to change your password" }, { status: 400 });
      }

      const isMatch = await bcrypt.compare(oldPassword, currentConfig?.password || "");
      if (!isMatch) {
        return NextResponse.json({ error: "Incorrect old password" }, { status: 401 });
      }

      const secret = currentConfig?.twoFactorSecret || process.env.TWO_FACTOR_SECRET || "";
      
      const result = await verify({
        token: authenticatorCode,
        secret: secret
      });

      if (!result) {
        return NextResponse.json({ error: "Invalid authenticator code" }, { status: 401 });
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No data provided to update" }, { status: 400 });
    }

    await db.collection("admin_config").updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}