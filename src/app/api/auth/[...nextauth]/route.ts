// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Gantilah logika ini jika nantinya mengambil data dari Database (Prisma/MySQL)
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin123"
        ) {
          return {
            id: "1",
            name: "Admin Kalurahan Grogol",
            email: "admin@grogol.desa.id",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login", // Custom page login Anda
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };