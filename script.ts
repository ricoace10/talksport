import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "securepassword123", // You should hash passwords in production!
      isAdmin: false, // Set true if this is an admin user
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
