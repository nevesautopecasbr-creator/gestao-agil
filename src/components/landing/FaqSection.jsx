import SectionContainer from './SectionContainer';

const faqs = [
  {
    question: 'O Gestão Ágil serve para qualquer consultoria?',
    answer: 'Foi desenhado para operações de consultoria que precisam organizar atendimento, execução técnica e gestão financeira em um fluxo único.',
  },
  {
    question: 'Preciso mudar toda a minha operação para implantar?',
    answer: 'Não. A proposta é estruturar o que você já executa hoje, com método, visibilidade e padronização.',
  },
  {
    question: 'O cliente também consegue acompanhar os atendimentos?',
    answer: 'Sim. O portal do cliente permite acompanhar progresso, tarefas, documentos e comunicação de forma transparente.',
  },
  {
    question: 'Existe controle por tipo de usuário?',
    answer: 'Sim. O sistema possui perfis específicos para administrador, consultor e cliente, com permissões adequadas.',
  },
];

export default function FaqSection() {
  return (
    <SectionContainer id="faq">
      <div className="mb-10 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Dúvidas frequentes</p>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Objeções comuns respondidas</h2>
      </div>

      <div className="mx-auto max-w-4xl space-y-4">
        {faqs.map((item) => (
          <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.question}</h3>
            <p className="text-slate-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
