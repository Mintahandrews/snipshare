import Image from "next/image";

export default function Logo() {
  return (
    <div className="h-8 w-8">
      <Image 
        src="/snipshare-logo.svg" 
        alt="SnipShare Logo" 
        width={32} 
        height={32}
        priority 
        className="h-full w-full"
      />
    </div>
  );
}
