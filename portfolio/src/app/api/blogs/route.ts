import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

const DB_NAME = "portfolio";

interface BlogUpdate {
  title: string;
  description: string;
  content: string;
  featuredImage: string;
  photoCredit: string;
  bibliography?: string; // We added the field here
  isPublished: boolean;
  updatedAt: Date;
}

async function isAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session?.value) {
    console.error("Auth Error: No admin_session cookie found");
    return false;
  }
  
  if (!process.env.ADMIN_SESSION_TOKEN) {
    console.error("Auth Error: ADMIN_SESSION_TOKEN env variable is missing");
    return false;
  }
  
  if (session.value !== process.env.ADMIN_SESSION_TOKEN) {
    console.error("Auth Error: Cookie value does not match ADMIN_SESSION_TOKEN");
    return false;
  }
  
  return true;
}

function generateUniqueSlug(title: string) {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  const suffix = crypto.randomBytes(2).toString('hex');
  return `${baseSlug}-${suffix}`;
}

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const allBlogs = await db.collection("blogs").find({}).toArray();
    const adminStatus = await isAdmin();
    
    const filteredBlogs = allBlogs
      .filter(blog => {
        if (adminStatus) return true;
        return blog.isPublished === true || blog.isPublished === undefined;
      })
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      
    return NextResponse.json(filteredBlogs);
  } catch (error: unknown) {
    console.error("GET Blogs Error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing admin session" }, { status: 403 });
  }

  try {
    // We added bibliography to the extracted payload here
    const { title, description, content, featuredImage, photoCredit, isPublished, bibliography } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: "Missing required fields (title or content)" }, { status: 400 });
    }

    const slug = generateUniqueSlug(title);
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const newBlog = {
      title,
      slug,
      description,
      content,
      featuredImage,
      photoCredit,
      bibliography, // We added the field to the database object here
      isPublished: !!isPublished,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection("blogs").insertOne(newBlog);
    return NextResponse.json({ success: true, slug });
  } catch (error: unknown) {
    console.error("POST Blog Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create blog";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing admin session" }, { status: 403 });
  }

  try {
    const body = await req.json();
    // We added bibliography to the extracted payload here
    const { id, title, description, content, featuredImage, photoCredit, isPublished, bibliography } = body;

    if (!id) {
      return NextResponse.json({ error: "Blog ID is required for updating" }, { status: 400 });
    }

    if (!ObjectId.isValid(id as string)) {
      return NextResponse.json({ error: "Invalid Blog ID format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const updateData: BlogUpdate = {
      title,
      description,
      content,
      featuredImage,
      photoCredit,
      bibliography, // We added the field to the update object here
      isPublished: !!isPublished,
      updatedAt: new Date()
    };

    const result = await db.collection("blogs").updateOne(
      { _id: new ObjectId(id as string) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found in database" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("PUT Blog Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Database error failed to update blog";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized: Invalid or missing admin session" }, { status: 403 });
  }

  try {
    const { id } = await req.json();
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid Blog ID is required for deletion" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id as string) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("DELETE Blog Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete blog";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}