import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../utils/constants";

const protectedRoutes: string[] = ["/app"];

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const [loadingUser, setLoadingUser] = useState(true);
  const router = useRouter();

  const { data: user, isLoading } = useQuery(
    ["auth.me"],
    async () => {
      const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jid")}`,
        },
      });

      if (response.status !== 200) {
        return null;
      }

      const user = await response.json();

      console.log(user, protectedRoutes.includes(router.pathname));

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
