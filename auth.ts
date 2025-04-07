import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from '@/auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // ✅ ハードコーディングによる認証
          if (
            email === 'taro@example.com' &&
            password === 'pass1234'
          ) {
            const user: User = {
              id: '1',
              name: 'Taro',
              email: 'taro@example.com',
              // 必要であれば他のフィールドもここに追加
            };
            return user;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
