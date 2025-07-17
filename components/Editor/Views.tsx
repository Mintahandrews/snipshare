import { cn } from "@/lib/cn";

export default function Views({ views }: { views: number }) {
  return (
    <div className={cn("absolute left-2 xs:left-3 sm:left-6 top-2 xs:top-3 sm:top-6 text-[10px] xs:text-xs text-greyish/80")}>
      {views.toLocaleString() ?? "?"} views
    </div>
  );
}
