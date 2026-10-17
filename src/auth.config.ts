import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/autentificare', error: '/autentificare' },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [], // Lăsăm gol aici, providerii cu logică complexă merg în auth.ts
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {


      return true;
    },

    /* eslint-disable @typescript-eslint/no-explicit-any */

    async session({ session, token }: { session: any; token: any }) {
      if (session.user && token) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
        session.user.image = token.image;
        session.user.name = token.name;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;