'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Cookies from 'js-cookie';

type AuthContextType = {
  user: string | null;
  signIn: () => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const router = useRouter();

  useEffect(() => {
    const handleOnline = () => {
      console.log('Ficando Online');
      setIsOffline(false);
    };
    const handleOffline = () => {
      console.log('Ficando Offline');
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOffline) {
      console.log('Está Offline');
      const token = Cookies.get('token');

      // const handleRedirect = async (targetPath: string) => {
      //   const cache = await caches.open('pages');
      //   const cachedResponse = await cache.match(targetPath);
      //   if (cachedResponse) {
      //     router.push(targetPath);
      //   } else {
      //     console.log(
      //       `Offline: Não redirecionando para ${targetPath} - não cacheado.`
      //     );
      //   }
      // };

      if (token) {
        console.log('Indo para dashboard');
        router.push('/dashboard');
      } else {
        console.log('Indo para home');
        router.push('/');
      }
    }
  }, [isOffline, router]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = Cookies.get('user');

      if (user) {
        console.log('Usuário encontrado');
        setUser(user);
      }
    };

    fetchUser();
  }, []);

  function signIn() {
    Cookies.set('user', 'your_user_here');
    Cookies.set('token', 'your_token_here');
  }

  function signOut() {
    Cookies.remove('user');
    Cookies.remove('token');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};
