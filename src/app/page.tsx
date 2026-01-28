import { LeadForm } from "@/components/elements/leadsForm";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* LOGO */}
        <Image
          src="/cropped-cropped-Bemzao.webp" // Caminho correto (começando com /)
          alt="Logo Bemzão"
          width={415}
          height={40}
          className="w-auto h-10 object-contain mb-5 mx-auto" // Sugestão: logos ficam melhores com 'object-contain' e 'w-auto' para não distorcer
          priority
        />

        {/* FORMULÁRIO DIRETO (Campanhas já inclusas no Select do LeadForm) */}
        <LeadForm />

        <footer className="mt-8 text-center text-sm text-gray-400">
          © 2026 Bemzão LP. Todos os direitos reservados.
        </footer>
      </div>
    </main>
  );
}