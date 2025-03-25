import ThreeScene from "@/components/threeScene";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative bg-slate-600">
      <ThreeScene />

      {/* Attribution */}
      <Link href={"https://www.amazonsky.com.br"} target="_blank">
        <div className="fixed bottom-4 left-4 flex flex-col items-center bg-white bg-opacity-80 px-3 py-2 rounded-lg shadow-md z-10">
          <span className="text-sm font-medium text-gray-700 mb-2">
            Aerofotogrametria feita por
          </span>
          <Image
            src="/logo.png"
            alt="Company Logo"
            width={160}
            height={60}
            className="h-auto"
          />
          <span className="text-sm font-medium text-gray-700 mb-2">
            Clique aqui e conheça melhor nossos serviços
          </span>
        </div>
      </Link>
    </div>
  );
}
