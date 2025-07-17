import Editor from "@/components/Editor";
import SetupStore from "@/components/Editor/SetupStore";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getSnippet(id: string) {
  if (!id) {
    notFound();
  }

  try {
    const snippet = await prisma.snippet.findUnique({
      where: {
        id,
      },
      include: {
        views: true,
      },
    });

    if (!snippet) {
      notFound();
    }

    return snippet;
  } catch (error) {
    console.error("Error fetching snippet:", error);
    if (error instanceof Error && error.message.includes("Record not found")) {
      notFound();
    }
    throw new Error("An error occurred while fetching the snippet");
  }
}

async function increaseViewCount(id: string) {
  return await prisma.view.update({
    where: {
      snippetId: id,
    },
    data: {
      count: {
        increment: 1,
      },
    },
  });
}

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getSession();

  const snippet = await getSnippet(params.id);

  let views =
    session?.user?.id !== snippet.userId
      ? await increaseViewCount(params.id)
      : snippet.views;

  const editable = session?.user?.id === snippet.userId;
  const isAuthenticated = !!session;

  return (
    <>
      <SetupStore snippet={snippet} />

      <Editor
        views={views?.count}
        editable={editable}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
