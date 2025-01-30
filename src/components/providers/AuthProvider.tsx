"use client";

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { onAuthChange } from "@/lib/firebase.auth";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathName = usePathname();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && user && pathName === "/") router.push("/workspace");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user && loading]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
