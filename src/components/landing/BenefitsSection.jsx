import SectionContainer from './SectionContainer';

const benefits = [
  'Mais previsibilidade de receita com operação e financeiro conectados.',
  'Mais produtividade do time com fluxos claros e padronização.',
  'Mais controle de qualidade em entregas e documentação.',
  'Mais confiança para crescer com dados gerenciais em tempo real.',
];

export default function BenefitsSection() {
  return (
    <SectionContainer id="beneficios">
      <div className="grid items-start gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Benefícios</p>
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Mais controle, menos improviso na rotina da consultoria</h2>
          <p className="text-slate-600">
            O Gestão Ágil foi estruturado para apoiar consultorias que precisam escalar operação sem perder qualidade técnica.
          </p>
        </div>

        <ul className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
          {benefits.map((benefit) => (
            <li key={benefit} className="text-slate-700">- {benefit}</li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
