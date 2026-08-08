const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres.enlhkmdjwsyrwdizcwel:GeVRSNi1siyrPZCV@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres",
    },
  },
});

async function test() {
  try {
    console.log("Mencoba koneksi ke database...");
    const admin = await prisma.admin.findMany();
    console.log("KONEKSI BERHASIL! Data admin:", admin);
  } catch (err) {
    console.error("KONEKSI GAGAL:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();