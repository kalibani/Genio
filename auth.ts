import NextAuth from 'next-auth';
import { getUserById } from '@/lib/actions/auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prismadb from './lib/prismadb';
import jwt from 'jsonwebtoken';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  // jwt: {
  //   async encode({ token, secret }) {
  //     const data = await prismadb.user.findUnique({
  //       where: { email: token?.email || '' },
  //     });
  //     const secretJwt = Array.isArray(secret) ? secret[0] : secret;
  //     const encodedToken = jwt.sign(
  //       { ...token, orgId: data?.organizationId },
  //       secretJwt,
  //       {
  //         algorithm: 'HS512',
  //       }
  //     );

  //     return encodedToken;
  //   },
  //   decode: async ({ secret, token }) => {
  //     const secretJwt = Array.isArray(secret) ? secret[0] : secret;
  //     const verify = jwt.verify(token || '', secretJwt);

  //     return verify;
  //   },
  // },
  pages: { signIn: '/auth/login', error: '/auth/error' },
  events: {
    async linkAccount({ user, account, profile }) {
      await prismadb.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account, credentials, profile }) {
      // Allow OAuth without email verification
      if (account?.provider !== 'credentials') return true;
      // Prevent sign in without email verification
      // const existingUser = await getUserById(user.id!);
      // if (!existingUser?.emailVerified) return false;

      return true;
    },

    async session({ token, session, user }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (session.user) {
        session.user.name = token.name;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub.toString());
      if (!existingUser) return token;

      return token;
    },
  },

  ...authConfig,
  adapter: PrismaAdapter(prismadb),
  // adapter: {
  //   ...PrismaAdapter(prismadb),
  // },
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
});
