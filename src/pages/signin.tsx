import { NextPage } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../utils/constants";
import Head from "next/head";
import Image from "next/image";
import {
  signInValidator,
  SignInValidator,
} from "../validators/signin.validator copy";
import { queryClient } from "../lib/queryClient";

type SignInResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
};

const SignupPage: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValidator>({
    resolver: zodResolver(signInValidator),
  });

  const router = useRouter();

  const { mutateAsync } = useMutation(async (data: SignInValidator) => {
    const response = await fetch(`${BASE_URL}/api/v1/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.status === 500) {
      const { message } = await response.json();
      return {
        error: {
          message,
        },
      };
    }

    const { user, token } = (await response.json()) as SignInResponse;

    return {
      user,
      token,
    };
  });

  const onSubmit: SubmitHandler<SignInValidator> = async (values) => {
    const res = await mutateAsync(values);

    if (!res.error) {
      toast.success("Successfully signed in");
      localStorage.setItem("jid", res.token);
      queryClient.invalidateQueries(["auth.me"]);
      await router.replace("/app");
    } else {
      toast.error(res.error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Shout | Signin</title>
      </Head>
      <div className="flex h-screen flex-col">
        <div className="grid flex-1 grid-cols-2">
          <div className="mx-auto flex h-full w-3/5 flex-col justify-center">
            <span className="relative mb-8">
              <Image
                src="/logo.svg"
                alt="shout logo"
                width={48}
                height={48}
                className="left-0"
              />
            </span>
            <h4 className="text-sm font-light tracking-widest text-gray-300">
              Welcome back!
            </h4>
            <h1 className="my-2 text-4xl font-bold">
              Sign in with <span className="text-emerald-400">Shout</span>
            </h1>

            <form
              className="my-8 flex flex-col items-start gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="email" className="block w-full space-y-1">
                <span>Email address</span>
                <input
                  type="email"
                  placeholder="john@doe.com"
                  className="form-input block w-full rounded bg-gray-800"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </label>
              <label htmlFor="password" className="block w-full space-y-1">
                <span>Password</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="form-input block w-full rounded bg-gray-800"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </label>
              <button
                type="submit"
                className="mt-2 rounded bg-emerald-600 py-3 px-6 font-medium"
              >
                Sign In
              </button>
            </form>
          </div>
          <div className="relative">
            <Image
              src="/signup.jpg"
              alt="signup"
              layout="fill"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
