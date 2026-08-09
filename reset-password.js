require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const username = process.env.ADMIN_USERNAME;
    const rawPassword = process.env.ADMIN_PASSWORD;

    if (!username || !rawPassword) {
      throw new Error("ADMIN_USERNAME atau ADMIN_PASSWORD belum diatur di file .env!");
    }

    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Upsert
    const admin = await prisma.admin.upsert({
      where: { username: username },
      update: { password: hashedPassword },
      create: {
        username: username,
        password: hashedPassword,
        nama: "Administrator",
        role: "ADMIN",
      },
    });

    console.log("SUCCESS! Akun Admin berhasil dibuat/diperbarui.");
    console.log("Username:", admin.username);
  } catch (err) {
    console.error("GAGAL:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();