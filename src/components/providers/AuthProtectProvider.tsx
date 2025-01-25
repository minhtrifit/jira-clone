"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";
import Loading from "@/components/Loading/Loading";

interface PropType {
  children: React.ReactElement;
}

const AuthProtectProvider = (props: PropType) => {
  const { children } = props;
  const router = useRouter();
  const { user, loading }: any = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !user) router.push("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loading width={60} height={60} />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProtectProvider;
