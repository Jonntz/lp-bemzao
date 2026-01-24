import Image from "next/image";
import { LeadModal } from "@/components/elements/leadsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, ShieldCheck, Trophy, Menu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--ast-color-5)]">
      {/* --- NAVBAR --- */}
      <header className="w-full py-4 px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-[var(--ast-color-7)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={`https://bemzao.com/wp-content/uploads/2025/07/cropped-cropped-Bemzao.com-logomarca-scaled-1-215x40.webp`}
              alt="Aluno"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="inicio" className="relative pt-12 pb-20 overflow-hidden">
        <div className="container max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Coluna Esquerda: Texto */}
          {/* 'items-start' é crucial aqui para o botão não esticar */}
          <div className="flex flex-col items-start space-y-6 z-10">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[var(--ast-color-0)] text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--ast-color-0)]"></span>
              </span>
              Novas Campanhas
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--ast-color-2)] leading-[1.1]">
              Transforme sua vida com nossas <span className="text-[var(--ast-color-0)]">Campanhas exclusivas</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-lg text-[var(--ast-color-3)] leading-relaxed max-w-lg">
              Junte-se a milhares de pessoas que já receberam nossas ajudas e com isso puderam mudar suas vidas.
            </p>

            {/* Botões CTA */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
              <LeadModal />
            </div>

            {/* Social Proof (Avatares) */}
            <div className="flex items-center gap-4 text-sm text-[var(--ast-color-3)] pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    {/* Adicionado w-full h-full para forçar a imagem a caber na bolinha */}
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="Aluno"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="font-medium">+1.000 doações foram feitas</p>
            </div>
          </div>

          {/* Coluna Direita: Imagem */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform lg:rotate-2 hover:rotate-0 transition-all duration-500 bg-gray-200">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Equipe trabalhando"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ast-color-2)]/40 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="beneficios" className="py-24 bg-white relative border-t border-[var(--ast-color-7)]">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--ast-color-2)]">
              Por que escolher nossa plataforma?
            </h2>
            <p className="text-[var(--ast-color-3)] text-lg">
              Oferecemos doações de várias formas e ajudamos pessoas a mudarem suas vidas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
                  <Rocket className="w-7 h-7 text-[var(--ast-color-0)]" />
                </div>
                <CardTitle className="text-xl text-[var(--ast-color-2)]">Acesso a benefícios</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--ast-color-3)] leading-relaxed">
                Como acessar benefícios sociais e oportunidades de apoio de acordo com a sua necessidade.
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
                  <Trophy className="w-7 h-7 text-[var(--ast-color-0)]" />
                </div>
                <CardTitle className="text-xl text-[var(--ast-color-2)]">Orientações e garantia</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--ast-color-3)] leading-relaxed">
                Orientações sobre como garantir seus direitos de maneira fácil e segura, com explicação clara sobre o processo para que você tenha tranquilidade e confiança.
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border border-gray-100 shadow-lg shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-300">
              <CardHeader>
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-2">
                  <ShieldCheck className="w-7 h-7 text-[var(--ast-color-0)]" />
                </div>
                <CardTitle className="text-xl text-[var(--ast-color-2)]">Sem golpes</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--ast-color-3)] leading-relaxed">
                Nosso conteúdo é 100% honesto, não cobramos nada e nem tentamos vender nada, nosso foco é a transparência.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-5 bg-[var(--ast-color-2)] text-white/80">
        <div className="container max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm">© 2026 Bemzão LP. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}