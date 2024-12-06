import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import avatar3 from '@/public/images/avatar/avatar-3.jpg';
import { JWT } from 'next-auth/jwt';
import { DefaultSession, NextAuthOptions, Session } from 'next-auth';
import { StaticImageData } from 'next/image';

interface JwtPayload {
  userId: string;
}

interface UserType {
  id: string;
  name: string;
  image: StaticImageData;
  password: string;
  email: string;
  resetToken: string | null;
  resetTokenExpiry: Date | null;
  profile: any;
  accessToken: string; // Defina o tipo do accessToken
}

interface CustomUser {
  email: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  profile?: string;
  accessToken?: string;
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user?: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.AUTH_GOOGLE_ID as string,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    // }),
    // GithubProvider({
    //   clientId: process.env.AUTH_GITHUB_ID as string,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    // }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        try {
          const res = await fetch('https://api.mrrodz.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            throw new Error('Credenciais inválidas');
          }

          const data = await res.json();

          if (data.accessToken) {
            // Decodificar o token JWT para extrair o userId
            const decoded = jwtDecode<JwtPayload>(data.accessToken);
            const userId = decoded.userId;

            if (!userId) {
              throw new Error('ID de usuário não encontrado no token');
            }

            const foundUser: UserType = {
              id: userId,
              name: 'John Doe',
              image: avatar3,
              password: password,
              email: email,
              resetToken: null,
              resetTokenExpiry: null,
              profile: null,
              accessToken: data.accessToken,
            };

            return foundUser as any;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Erro durante a autenticação:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.accessToken = customUser.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  debug: process.env.NODE_ENV !== 'production',
};
