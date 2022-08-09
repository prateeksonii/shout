import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/constants";

const protectedRoutes: string[] = [];

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  const { data: user, isLoading } = useQuery(
    ["auth.me"],
    async () => {
      const user = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        credentials: "include",
      }).then((res) => res.json());
      return user ?? null;
    },
    {
      onSettled(user, error: any) {
        if (error) {
          toast.error(error.message);
        }

        setLoadingUser(false);
      },
    }
  );

  if (isLoading || loadingUser) return <div>Checking auth status</div>;

  if (!user && protectedRoutes.includes(router.pathname)) {
    router.replace("/signin");
  }

  return <>{children}</>;
};

export default Layout;
