// import { PrismaClient } from "@prisma/client/extension";

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["query"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

// export default prisma;

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";


const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma
