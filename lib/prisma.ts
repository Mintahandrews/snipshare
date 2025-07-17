import { PrismaClient, Prisma } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientOptions: Prisma.PrismaClientOptions = {
  log: [{ level: "error" as const, emit: "event" as const }],
  errorFormat: "minimal" as const,
};

// Use a singleton pattern to avoid multiple instances during hot reloading
export function getPrismaClient() {
  // For production, always create a new instance
  if (process.env.NODE_ENV === "production") {
    const client = new PrismaClient(prismaClientOptions);
    return client;
  }

  // For development, cache the client in the global object
  if (!global.prisma) {
    global.prisma = new PrismaClient(prismaClientOptions);

    // Handle connection errors more gracefully
    // We need to use 'any' here because the typed version is not working correctly
    (global.prisma as any).$on("error", (e: Error) => {
      console.error("Prisma Client error:", e);
    });

    // Try to connect - but don't crash the app if connection fails
    global.prisma.$connect().catch((error) => {
      console.error("Database connection error:", error);
      console.warn("App will run with limited functionality");
    });
  }

  return global.prisma;
}

export const prisma = getPrismaClient();
