import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db';
import { compareSync } from 'bcrypt-ts-edge';
import { signInSchema } from '@/lib/validators';
import { isRateLimited, registerAttempt, resetAttempts } from '@/lib/rate-limit';

const MAX_FAILED_LOGINS = 5;
const LOGIN_WINDOW_MS = 60 * 1000;

declare module 'next-auth' {
  interface User {
    role: string;
    surname?: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      surname?: string;
      role: string;
      image?: string | null;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig, 
  
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      authorize: async (credentials) => {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const limitKey = `login:${email}`;

        if (isRateLimited(limitKey, MAX_FAILED_LOGINS)) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          const isPasswordValid =
            !!user?.password && compareSync(password, user.password);

          if (!user || !isPasswordValid) {
            registerAttempt(limitKey, LOGIN_WINDOW_MS);
            return null;
          }

          resetAttempts(limitKey);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            surname: user.surname, // ✅ adăugat
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    
    ...authConfig.callbacks,
/* eslint-disable @typescript-eslint/no-explicit-any */

    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.sub = user.id;
        token.role = user.role;
        token.image = user.image;
        token.name = user.name;
        token.surname = user.surname; // ✅ adăugat
      }

      if (trigger === "update" && session) {
        if (session.user?.name) {
          token.name = session.user.name;
        }
        if (session.user?.surname !== undefined) {
          token.surname = session.user.surname; // ✅ adăugat
        }
        if (session.user?.image !== undefined) {
          token.image = session.user.image;
        }
      }

      return token;
    },

    async session({ session, token }: any) {
      if (session.user && token) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.name = token.name;
        session.user.surname = token.surname; // ✅ adăugat
      }
      return session;
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
});