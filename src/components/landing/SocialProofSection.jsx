import SectionContainer from './SectionContainer';

const proofCards = [
  {
    title: 'Fluxo completo para consultorias',
    description: 'Do cadastro ao relatório final, com visão integrada de execução, cliente e resultado financeiro.',
  },
  {
    title: 'Operação por perfil de usuário',
    description: 'Experiências dedicadas para administração, consultores e clientes, com controle de acesso por função.',
  },
  {
    title: 'Documentos e gestão profissional',
    description: 'Padronização de proposta técnica e relatório de prestação, reduzindo retrabalho e inconsistência.',
  },
];

export default function SocialProofSection() {
  return (
    <SectionContainer id="credibilidade" className="bg-[#1e293b]">
      <div className="mb-10 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Credibilidade operacional</p>
        <h2 className="text-3xl font-bold text-white md:text-4xl">Construído para a rotina real de quem vive consultoria</h2>
        <p className="mx-auto max-w-3xl text-slate-300">
          Plataforma orientada a execução técnica, governança e resultado. Sem promessas vazias, com foco em gestão sólida.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {proofCards.map((card) => (
          <div key={card.title} className="rounded-2xl border border-slate-700 bg-slate-800 p-6">
            <h3 className="mb-2 text-lg font-semibold text-white">{card.title}</h3>
            <p className="text-slate-300">{card.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
