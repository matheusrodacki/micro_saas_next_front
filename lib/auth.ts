import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';
import { User as UserType, user } from '@/app/api/user/data';
import avatar3 from '@/public/images/avatar/avatar-3.jpg';

interface JwtPayload {
  userId: string;
}

export const authOptions = {
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

            const foundUser = {
              id: userId,
              name: 'John Doe',
              image: avatar3,
              password: password,
              email: email,
              resetToken: null,
              resetTokenExpiry: null,
              profile: null,
            };

            console.log('foundUser:', foundUser);

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
  debug: process.env.NODE_ENV !== 'production',
};
