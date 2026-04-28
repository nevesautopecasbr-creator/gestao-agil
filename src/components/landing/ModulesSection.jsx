import SectionContainer from './SectionContainer';

const modules = [
  {
    title: 'Gestão de Atendimentos e Projetos',
    description: 'Pipeline, Kanban, status, fases e visão detalhada por projeto para manter escopo e prazos sob controle.',
  },
  {
    title: 'Portal do Cliente',
    description: 'Compartilhe progresso, tarefas, documentos e mensagens em um espaço organizado e profissional.',
  },
  {
    title: 'Agenda, Tarefas e Horas',
    description: 'Coordene o time técnico com agenda operacional, checklists e apontamento de horas por atendimento.',
  },
  {
    title: 'Financeiro e DRE',
    description: 'Conecte execução e resultado com contas, despesas, impostos, a faturar, faturado e recebido.',
  },
  {
    title: 'Documentação Técnica',
    description: 'Padronize proposta técnica, relatórios de prestação e entregáveis essenciais da consultoria.',
  },
  {
    title: 'Relatórios Gerenciais',
    description: 'Tenha indicadores para tomada de decisão sobre produtividade, margem e capacidade operacional.',
  },
];

export default function ModulesSection() {
  return (
    <SectionContainer id="modulos" className="bg-slate-50">
      <div className="mb-12 space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Módulos principais</p>
        <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Tudo o que sua consultoria precisa em um único sistema</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => (
          <div key={module.title} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{module.title}</h3>
            <p className="text-slate-600">{module.description}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
