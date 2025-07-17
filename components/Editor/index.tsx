"use client";
import { cn } from "@/lib/cn";
import Views from "./Views";
import Wrapper from "./Wrapper";
import TitleBar from "./TitleBar";
import Code from "./Code";
import ChangeListener from "./ChangeListener";
import Settings from "@/components/Settings/index";

export default function Editor({
  views,
  editable,
  isAuthenticated,
}: {
  views?: number;
  editable: boolean;
  isAuthenticated: boolean;
}) {
  return (
    <div
      id="editor"
      className={cn(
        "relative flex h-full w-full flex-col items-center",
        "p-1 xs:p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8",
        "overflow-x-hidden overflow-y-auto",
        "min-h-[calc(100dvh-4rem)]",
        "max-w-[100vw]"
      )}
    >
      {views !== undefined && <Views views={views} />}

      <Wrapper>
        <TitleBar editable={editable} />

        <Code editable={editable} />
      </Wrapper>

      {editable && (
        <div className="w-full max-w-full overflow-x-hidden">
          <Settings />
        </div>
      )}

      {editable && isAuthenticated && <ChangeListener />}
    </div>
  );
}
