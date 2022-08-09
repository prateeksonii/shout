import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import PublicNav from "../components/PublicNav";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shout</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PublicNav />
      <main className="container mx-auto my-8">
        <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
          The most <br />{" "}
          <span className="text-emerald-400">secure and reliable</span> <br />
          way of communication.
        </h1>

        <Link href="/signup">
          <a className="mt-8 block w-max rounded bg-emerald-600 px-8 py-4 text-xl font-medium text-white">
            Get started for free
          </a>
        </Link>
      </main>
    </>
  );
};

export default Home;
