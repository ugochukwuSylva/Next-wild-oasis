import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    // This function returns a boolean value. It is responsible for determining if a user is authenticated or not.
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    // Responsible for registering / creating a new user on the database (supabase) where email is used as a unique means of identification
    async signIn({ user, account, profile }) {
      try {
        const existingUser = await getGuest(user.email);

        if (!existingUser)
          await createGuest({ email: user.email, fullName: user.name });

        return true;
      } catch {
        return false;
      }
    },
    // For updating the obeject with addditonal key(s), in this case, the ID
    async session({ session, user }) {
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id;

      return session;
    },
  },
  // Redirects the user to the signup/login page if currently not logged in
  pages: {
    signIn: "/login",
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig);
