import { cn } from "@/lib/cn";
import { Github, LucideProps, Twitter } from "lucide-react";
import Link from "next/link";

export default function Social() {
  const links = [
    {
      id: "github",
      href: "https://github.com/mintahandrews",
      icon: (props: LucideProps) => <Github {...props} aria-hidden="true" />,
      label: "Github",
    },
    {
      id: "twitter",
      href: "https://x.com/codemintah",
      icon: (props: LucideProps) => <Twitter {...props} aria-hidden="true" />,
      label: "Twitter",
    },
  ];

  return (
    <nav className={cn("relative mr-1 xs:mr-2 sm:mr-5 pr-1 xs:pr-2 sm:pr-5")}>
      <div className={cn("flex items-center gap-0.5 xs:gap-1 sm:gap-2")}>
        {links.map(({ id, href, icon, label }) => (
          <Link
            key={id}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              "rounded-kg p-1 sm:p-2",
              "select-none outline-none",
              "transition-all duration-100 ease-in-out",
              "hover:cursor-ne-resize hover:bg-white/20 hover:text-almost-white",
              "focus:text-almost-white focus:outline-1 focus:outline-offset-2 focus:outline-almost-white"
            )}
            aria-label={`social-link-${id}`}
          >
            {icon({
              className: cn("w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"),
            })}
            <span className="sr-only">{label}</span>
          </Link>
        ))}
      </div>

      <div
        className={cn(
          "absolute right-0 top-0 h-full w-px",
          "bg-gradient-to-b from-transparent via-white/20 to-transparent"
        )}
      />
    </nav>
  );
}
