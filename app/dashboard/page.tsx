import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/cn";
import Button from "@/components/Dashboard/Button";
import Snippets from "@/components/Dashboard/Snippets";
import { serialize } from "@/lib/serialize";

async function getSnippets(userId: string) {
  return await prisma.snippet.findMany({
    where: {
      userId,
    },
    include: {
      views: true,
    },
  });
}

export default async function Page() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const snippets = await getSnippets(session.user.id);

  return (
    <div
      className={cn(
        "flex w-[90vw] max-w-[576px] flex-col rounded-xl p-3 xs:p-4 sm:p-5",
        "border border-white/20 bg-black shadow-xl shadow-black/40"
      )}
    >
      <div className={cn("flex w-full items-center justify-between")}>
        <h2 className={cn("text-xl font-extrabold")}>Snippets</h2>

        <Button snippetCount={snippets.length} />
      </div>

      <Snippets snippets={serialize(snippets)} />
    </div>
  );
}
