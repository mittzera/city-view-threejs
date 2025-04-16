import React from 'react'
import Image from 'next/image';

export function Copyright() {
  return (
    <div className="fixed bottom-10 md:left-10 border border-zinc-600 bg-white bg-opacity-80 p-3 rounded-lg shadow-md">
     
      
      <div className="mt-2 pt-2 border-t border-zinc-200 flex flex-col items-center md:flex-row md:justify-between gap-2 z-10 text-black">
        <p className="m-0 text-xs">
          Pollaris Digital - {new Date().getFullYear()} © Todos os direitos reservados
        </p>

        <a
          href="https://www.PollarisDigital.com.br/"
          target="_blank"
          rel="noreferrer"
          className="flex flex-row items-center gap-1"
        >
          <small>Desenvolvido por</small>
          <Image
            src="/logo-pollaris-texto.png"
            alt="logo Pollaris"
            width={85}
            height={20}
            className="w-16"
          />
        </a>
      </div>
    </div>
  );
}
