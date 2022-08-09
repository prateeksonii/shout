import Image from "next/future/image";

const PublicNav = () => {
  return (
    <nav className="flex h-20 items-end">
      <div className="container mx-auto">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="shout logo" width={48} height={48} />
        </div>
      </div>
    </nav>
  );
};

export default PublicNav;
