import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { Session, getServerSession } from "next-auth";
import { prisma } from "./prisma";
import GithubProvider from "next-auth/providers/github";

// Custom Prisma adapter to handle username field
const adapter = PrismaAdapter(prisma);

// Override createUser to handle the username field
const originalCreateUser = adapter.createUser!;
adapter.createUser = async (data: Parameters<typeof originalCreateUser>[0] & { username?: string }) => {
  const { username, ...userData } = data;
  const user = await originalCreateUser(userData);
  
  // If username is provided, update the user with the username
  if (username) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { username }
      });
      return { ...user, username };
    } catch (error) {
      console.error('Failed to update user with username:', error);
      // Continue without username if update fails
    }
  }
  
  return user;
};

export const authOptions: NextAuthOptions = {
  adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/",
    error: "/error",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'read:user user:email',
        },
      },
      profile(profile) {
        console.log('GitHub profile received:', profile);
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email || `${profile.id}+${profile.login}@users.noreply.github.com`,
          image: profile.avatar_url,
          username: profile.login.toLowerCase(), // Ensure username is lowercase
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('Sign in callback:', { user, account, profile });
      // Ensure user has an email
      if (!user.email) {
        console.error('No email found in profile');
        return false;
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
        try {
          // Fetch additional user data from database
          const dbUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { 
              id: true,
              name: true, 
              email: true, 
              image: true, 
              username: true 
            }
          });
          
          if (dbUser) {
            // Create a new user object with all the necessary properties
            const userWithUsername = {
              ...session.user,
              ...dbUser,
              // Ensure we have a fallback for username
              username: (dbUser as any).username || session.user.email?.split('@')[0] 
            };
            
            // Type assertion to bypass TypeScript errors
            session.user = userWithUsername as any;
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      console.log('New user created:', user);
    },
    async linkAccount({ account }) {
      console.log('Account linked:', account);
    },
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', { user, account, profile, isNewUser });
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export async function getSession(
  req?: NextApiRequest | GetServerSidePropsContext["req"],
  res?: NextApiResponse | GetServerSidePropsContext["res"]
) {
  if (!req || !res) {
    return (await getServerSession(authOptions)) as Session;
  }

  return (await getServerSession(req, res, authOptions)) as Session;
}
