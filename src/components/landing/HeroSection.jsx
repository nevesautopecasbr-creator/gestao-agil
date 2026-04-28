import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-12 md:pb-24 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1e3a5f_0%,transparent_55%)] opacity-20" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-10">
        <div className="inline-flex items-center rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-700">
          Sistema para Consultorias
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-900 md:text-6xl">
            Pare de gerenciar sua consultoria em planilhas soltas.
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:text-xl">
            O Gestão Ágil centraliza atendimento, execução, documentos e financeiro em um fluxo único para você
            ganhar previsibilidade operacional e margem.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="bg-[#1e3a5f] hover:bg-[#2d4a6f]">
            <a href="#contato">Quero falar com o time comercial</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/login">Acessar o sistema</a>
          </Button>
        </div>

        <p className="text-sm text-slate-500">
          Implantação guiada · Perfis por tipo de usuário · Operação pronta para crescer
        </p>
      </div>
    </section>
  );
}
