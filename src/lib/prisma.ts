import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  console.debug("New prisma client created (prod)");
  prisma = new PrismaClient();
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    console.debug("New prisma client created (dev)");
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

export default prisma;
