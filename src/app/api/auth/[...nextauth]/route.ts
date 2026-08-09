import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Deklarasi modul
declare module "next-auth" {
  interface User {
    role?: string | null;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== TRYING TO LOGIN ===");
        console.log("Username input:", credentials?.username);

        if (!credentials?.username || !credentials?.password) {
          console.log("LOGIN FAIL: Input username/password kosong");
          return null;
        }

        try {
          // Cari admin
          const admin = await db.admin.findUnique({
            where: {
              username: credentials.username,
            },
          });

          console.log("Admin found in DB?:", !!admin);

          if (!admin || !admin.password) {
            console.log("LOGIN FAIL: Username tidak ditemukan di database");
            return null;
          }

          console.log("DB HASH:", admin.password);

          // Cek bcrypt
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            admin.password
          );

          console.log("Is Password Valid?:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("LOGIN FAIL: Password bcrypt compare menghasilkan false");
            return null;
          }

          console.log("LOGIN SUCCESS for user:", admin.username);

          return {
            id: admin.id,
            name: admin.nama || admin.username,
            role: admin.role ?? "admin",
          };
        } catch (error) {
          console.error("LOGIN ERROR (DATABASE / PRISMA):", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };