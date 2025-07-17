import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { limiter } from "@/lib/limiter";
import { prisma } from "@/lib/prisma";
import { prepare } from "@/lib/prepare";
import { DEFAULT_VALUES } from "@/lib/values";

const ratelimit = limiter();

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { allowed } = await ratelimit.check(30, "UPDATE_SNIPPET");

    if (!session || !session.user.id) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 403 });
    }

    if (!allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS" }, { status: 429 });
    }

    if (!body.id) {
      return NextResponse.json({ code: "MISSING_ID" }, { status: 400 });
    }

    try {
      const updatedSnippet = await prisma.snippet.update({
        where: {
          id: body.id,
          userId: session.user.id,
        },
        data: prepare(body),
      });

      return NextResponse.json(updatedSnippet, { status: 200 });
    } catch (e) {
      console.error("Database error while updating snippet:", e);
      return NextResponse.json({ code: "DATABASE_ERROR" }, { status: 500 });
    }
  } catch (e) {
    console.error("Unexpected error in PATCH:", e);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { allowed } = await ratelimit.check(30, "CREATE_SNIPPET");

    if (!session || !session.user.id) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 403 });
    }

    if (!allowed) {
      return NextResponse.json({ code: "TOO_MANY_REQUESTS" }, { status: 429 });
    }

    if (body.snippetCount >= 10) {
      return NextResponse.json({ code: "LIMIT_REACHED" }, { status: 403 });
    }

    try {
      // For SQLite compatibility, convert JSON to string
      const customColors =
        typeof DEFAULT_VALUES.customColors === "object"
          ? JSON.stringify(DEFAULT_VALUES.customColors)
          : DEFAULT_VALUES.customColors;

      const createdSnippet = await prisma.snippet.create({
        data: {
          userId: session.user.id,
          customColors,
          views: {
            create: {
              count: 0,
            },
          },
        },
        include: {
          views: true,
        },
      });

      return NextResponse.json(createdSnippet, { status: 200 });
    } catch (e) {
      console.error("Database error while creating snippet:", e);
      return NextResponse.json({ code: "DATABASE_ERROR" }, { status: 500 });
    }
  } catch (e) {
    console.error("Unexpected error in POST:", e);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const session = await getSession();

    if (!session || !session.user.id) {
      return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 403 });
    }

    if (!id) {
      return NextResponse.json({ code: "SNIPPET_NOT_FOUND" }, { status: 404 });
    }

    try {
      const deletedSnippet = await prisma.snippet.delete({
        where: {
          id: id,
          userId: session.user.id,
        },
        select: {
          id: true,
        },
      });

      return NextResponse.json(deletedSnippet, { status: 200 });
    } catch (e) {
      console.error("Database error while deleting snippet:", e);
      return NextResponse.json({ code: "DATABASE_ERROR" }, { status: 500 });
    }
  } catch (e) {
    console.error("Unexpected error in DELETE:", e);
    return NextResponse.json(
      { code: "INTERNAL_SERVER_ERROR" },
      { status: 500 }
    );
  }
}
