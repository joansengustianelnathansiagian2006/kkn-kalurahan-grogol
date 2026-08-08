const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    const username = "kkngrogoladmsec8826";
    const rawPassword = "Kkn_Gr0g0l!2026#AdmScr";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Upsert: Buat baru jika belum ada, update password jika sudah ada
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

    console.log("SUCCESS! Akun Admin berhasil dibuat/diperbarui di database.");
    console.log("Username:", admin.username);
    console.log("Password:", rawPassword);
  } catch (err) {
    console.error("GAGAL:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();