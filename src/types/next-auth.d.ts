import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extends the default session with additional properties
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the default user with additional properties
   */
  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the default JWT with additional properties
   */
  interface JWT {
    id?: string;
    role?: string;
  }
}