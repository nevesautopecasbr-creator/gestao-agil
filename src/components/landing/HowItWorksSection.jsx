import SectionContainer from './SectionContainer';

const steps = [
  {
    index: '01',
    title: 'Configure sua operação',
    description: 'Cadastre clientes, consultores, áreas de atuação, serviços e regras financeiras em um único ambiente.',
  },
  {
    index: '02',
    title: 'Execute com método',
    description: 'Gerencie atendimentos com fases, agenda, tarefas, horas técnicas, documentos e interação com cliente.',
  },
  {
    index: '03',
    title: 'Meça resultado real',
    description: 'Acompanhe faturamento, despesas, impostos, DRE e relatórios para decidir com confiança.',
  },
];

export default function HowItWorksSection() {
  return (
    <SectionContainer id="como-funciona">
      <div className="mb-12 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Como funciona</p>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Profissionalize sua consultoria em 3 passos</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.index} className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-3 text-sm font-bold text-[#1e3a5f]">{step.index}</div>
            <h3 className="mb-2 text-xl font-semibold text-slate-900">{step.title}</h3>
            <p className="text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
