import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

(async () => {
  await prisma.user.createMany({
    data: [{
      name: "User1",
      password: bcrypt.hashSync("password1", 10)
    },
    {
      name: "User2",
      password: bcrypt.hashSync("password2", 10)
    }
    ]
  });

  console.log("Seeded two default users");
})().then(async () => await prisma.$disconnect())
  .catch(async (e: unknown) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
