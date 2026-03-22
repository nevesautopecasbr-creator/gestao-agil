// Áreas e subáreas baseadas no Edital SEBRAE 01/2024 - Anexo I
// "active" = área que já atuamos (destacada)

export const SERVICE_AREAS = {
  pessoas: {
    label: "Pessoas",
    number: 1,
    active: false,
    subareas: [
      { id: "1.1", name: "Provimento", description: "Definição de perfil, recrutamento e seleção, ferramentas e instrumentos de mapeamento de perfil." },
      { id: "1.2", name: "Carreira, Remuneração, Acompanhamento e Avaliação de Desempenho e Resultados", description: "Sistemas de gestão de carreira, métodos de acompanhamento, métodos de avaliação, preparação para aposentadoria, remuneração fixa, tabela salarial, remuneração variável, reconhecimento não financeiro, benefícios, sistemas de gestão do desempenho, técnicas de elaboração de metas, indicadores de desempenho, gestão de dados (People Analytics)." },
      { id: "1.3", name: "Desenvolvimento e Treinamento de Pessoas", description: "Levantamento de necessidades, programas de treinamento, educação e desenvolvimento profissional, indicadores, soluções de treinamento." },
      { id: "1.4", name: "Gestão Trabalhista", description: "Admissão, registro, rescisão contratual, obrigações trabalhistas do empregador, encargos, folha de pagamento, relações de trabalho, acordo coletivo, relações sindicais." },
      { id: "1.5", name: "Cultura e Clima Organizacional", description: "Estudo da cultura e clima organizacional, fatores culturais, comportamento organizacional, ações de intervenção." },
      { id: "1.6", name: "Liderança", description: "Identificação de lideranças, desenvolvimento de líderes, estilos de liderança, gestão da diversidade na empresa." },
      { id: "1.7", name: "Gestão de Saúde, Medicina e Segurança do Trabalho", description: "Programa de Prevenção de Riscos Ambientais (PPRA), Programa de Controle Médico de Saúde Ocupacional (PCMSO), Comissão Interna de Prevenção de Acidentes (CIPA), indicadores de saúde." },
      { id: "1.8", name: "Condução de Grupos", description: "Metodologias de condução de grupos, processo, ferramentas, dinâmicas, vivências, percepção de movimentos grupais, mediação do processo de construção da aprendizagem em grupo." },
      { id: "1.9", name: "Qualidade de Vida no Trabalho", description: "Programas de qualidade de vida, programas de prevenção e cuidados com a saúde, indicadores de qualidade de vida." },
      { id: "1.10", name: "Planejamento Estratégico de Pessoal", description: "Dimensionamento quantitativo e qualitativo do quadro de pessoal, definição quanto às lacunas de competências, revisão e automatização de processos, redefinição de papéis, alçadas e responsabilidades." },
      { id: "1.11", name: "Inteligência Emocional", description: "Levantamento do perfil psicológico de candidatos em processos seletivos; desenvolvimento e aplicação de treinamento utilizando metodologias comportamentais para aprimoramento da Inteligência Emocional coletiva." }
    ]
  },
  empreendedorismo: {
    label: "Empreendedorismo",
    number: 2,
    active: false,
    subareas: [
      { id: "2.1", name: "Comportamento Empreendedor", description: "Mapear, planejar, desenvolver e aplicar soluções e metodologias para o desenvolvimento de atitudes e características do comportamento empreendedor (soft skills)." },
      { id: "2.2", name: "Negociação", description: "Mapear, planejar, desenvolver e aplicar soluções e metodologias de técnicas e habilidades de negociação e seus principais elementos (perfis e papeis de negociadores, poder de barganha, acordos e concessão)." },
      { id: "2.3", name: "Sucessão Empresarial", description: "Programas de sucessão empresarial, instrumentos de profissionalização e conscientização da gestão de empresas familiares." },
      { id: "2.4", name: "Empreendedorismo Social", description: "Desenvolver e aplicar soluções para apoiar pequenos negócios que resolvam problemas sociais da base da pirâmide, em comunidades e territórios deprimidos e fragilizados." }
    ]
  },
  educacao: {
    label: "Educação",
    number: 3,
    active: false,
    subareas: [
      { id: "3.1", name: "Educacional Pedagógico", description: "Analisar e propor teorias e práticas educacionais para o desenvolvimento de produtos e serviços educacionais, referenciais, metodologias, aprendizagem por competência." },
      { id: "3.2", name: "Educação à Distância - WEB", description: "Estratégias de aprendizagem para aprendizado via internet (Aprendizagem baseada em problemas, sala de aula invertida, instrução linear, trilha de aprendizagem, aprendizagem adaptativa entre outros)." },
      { id: "3.8", name: "Didática e Metodologias Ativas na Educação", description: "Conhecer e desenvolver soluções com foco em metodologias ativas; atualizar soluções com olhar metodológico que promova engajamento dos participantes para uma aprendizagem efetiva." },
      { id: "3.13", name: "Design Educacional", description: "Planejar, desenvolver e utilizar métodos, técnicas, atividades, materiais, eventos e soluções educacionais em situações didáticas específicas, a fim de facilitar a aprendizagem." },
      { id: "3.19", name: "Inovação na Educação", description: "Desenvolvimento, validação atualização e aplicação de ferramentas de design e de modelagem de negócios para inovação junto a jovens empreendedores." }
    ]
  },
  financas: {
    label: "Finanças, Contabilidade e Serviços Financeiros",
    number: 4,
    active: true,
    subareas: [
      { id: "4.1", name: "Gestão Econômico/Financeira", description: "Diagnóstico financeiro; controles financeiros; Fluxo de caixa; Formação de preço de venda; Capital de giro; Indicadores financeiros e econômicos." },
      { id: "4.2", name: "Projetos de Viabilidade", description: "Projetos de viabilidade econômico/financeiro, análise de mercado, indicadores de rentabilidade e retorno do projeto; análise de projeção de receitas; projeção de custos, despesas e os investimentos necessários." },
      { id: "4.3", name: "Captação de Recursos Financeiros", description: "Projetos para captação de recursos junto a empresas e instituições de fomento nacionais e internacionais, avaliação, fontes financiadoras e patrocinadoras." },
      { id: "4.4", name: "Orientação para Crédito e Microcrédito", description: "Políticas públicas para acesso a crédito e microcrédito, formação de redes e organizações de microcrédito, aspectos relacionados à orientação pré e pós-crédito." },
      { id: "4.5", name: "Capitalização de Empresas", description: "Financiamento de pequenos negócios inovadores por meio de investimentos de capital empreendedor e de risco com investidores-anjo, fundos de private equity e venture capital." },
      { id: "4.9", name: "Tributação para Pequenos Negócios", description: "Tributos, alíquotas, incidências, isenção, imunidades, livros exigidos, contabilidade fiscal, obrigações/guias, renegociação de dívida fiscal, legislação das MPE e regimes especiais." },
      { id: "4.10", name: "Contabilidade Financeira e Fiscal", description: "Coleta, classificação, registros, análise e geração de relatórios oficiais (balanço, balancetes, diário, demonstrativo de resultados) sobre as transações econômicas e financeiras." },
      { id: "4.14", name: "Fintech", description: "Sistema Financeiro Nacional, gestão e estudo de viabilidade para fintechs, tecnologia e inovação em serviços financeiros em plataformas digitais, operacionalização de fintechs." },
      { id: "4.16", name: "Captação de Recursos Financeiros para Órgãos Públicos", description: "Projetos para captação de recursos junto a empresas e instituições de fomento nacionais e internacionais para a viabilização de projetos de modernização administrativa e tributária em prefeituras." },
      { id: "4.17", name: "Ativos Imobiliários", description: "Avaliações de imóveis; Análises de investimento; Estudos estratégicos de compra, venda, built to suit e sale & leaseback; Estruturação e aprovação de documentações para obtenção de alvarás." }
    ]
  },
  marketing: {
    label: "Marketing e Vendas",
    number: 5,
    active: true,
    subareas: [
      { id: "5.1", name: "Marketing Estratégico", description: "Diagnóstico, estratégias de marketing, metodologia de análise e segmentação de mercado e de ambiente, comportamento do consumidor, construção de Naming, canais de distribuição, promoção e propaganda." },
      { id: "5.2", name: "Marketing Territorial", description: "Estratégias de comunicação territorial e de grupos de empresas, comunicação e identidade territorial, agregação de valor decorrentes das especificidades do território." },
      { id: "5.3", name: "Franquias", description: "Modelos de gestão de franquias envolvendo franqueador e rede de franqueados, planejamento e formatação de franquias, estruturação de formas de supervisão e gestão da rede de franquias." },
      { id: "5.4", name: "Vendas", description: "Planejamento, estratégias e técnicas de vendas, avaliação de ponto comercial, estratégia e gestão de varejo e atacado, canais de comercialização." },
      { id: "5.5", name: "Negócios Digitais", description: "Estratégias de acesso ao ambiente web (website, e-commerce, hotsite, blog, redes sociais, marketplaces), metodologias e ferramentas de apoio aos pequenos negócios na convergência digital." },
      { id: "5.6", name: "Marketing de Relacionamento", description: "Estratégias, soluções tecnológicas de relacionamento com o cliente, pós-venda, fidelização." },
      { id: "5.7", name: "Canais Digitais", description: "Administração de mobile sites e serviços on-line, metodologia de criação, implantação e lançamento de canais digitais, produtos e serviços via mobile." },
      { id: "5.8", name: "Pesquisa de Mercado e Análise Mercadológica", description: "Escopo da pesquisa, elaboração e aplicação de pesquisas quantitativas e/ou qualitativas, relatórios, análise e interpretação de dados, metodologias." },
      { id: "5.9", name: "Inteligência Competitiva", description: "Modelos, sistemas, ferramentas, processos, fatores críticos de sucesso, aplicabilidade de inteligência competitiva." },
      { id: "5.10", name: "Atendimento ao Cliente", description: "Processos, técnicas e habilidades do atendimento e relacionamento, canais de atendimento ao cliente, estruturação de equipes." },
      { id: "5.12", name: "Marketing de Conteúdo e Inbound Marketing", description: "Diagnóstico de cenário, planejamento da jornada de compra do cliente, elaboração de persona, definição das etapas do funil, configuração dos gatilhos de conversão, produção dos conteúdos." },
      { id: "5.14", name: "Novos Negócios e Estratégias de Diferenciação Comercial", description: "Pesquisa de cenários, modelagem de negócios, promoção comercial, comportamento e jornada do consumidor, gestão de canais, diagnósticos e estratégias diferenciadas de acesso a mercados." },
      { id: "5.15", name: "Marketing Digital", description: "Desenvolvimento de ações de comunicação por meio da internet, de telefonia celular e outros meios digitais, para divulgar e comercializar produtos, conquistar novos clientes, trabalho de SEO." }
    ]
  },
  negocios_internacionais: {
    label: "Negócios Internacionais",
    number: 6,
    active: false,
    subareas: [
      { id: "6.1", name: "Comércio Exterior", description: "Políticas nacionais e internacionais de comércio exterior, barreiras tarifárias e não tarifárias, acordos comerciais bilaterais e multilaterais, procedimentos de exportação e importação." },
      { id: "6.2", name: "Estratégias e Modalidades de Acesso ao Mercado Internacional", description: "Modalidades de negócios internacionais, bases de dados nacionais e internacionais de comércio, diagnóstico de aptidão exportadora, planos de internacionalização." },
      { id: "6.3", name: "Análise de Viabilidade Técnica de Exportação e Importação", description: "Formação de preços de importação e exportação, modalidades de pagamento, certificação, registros, procedimentos alfandegários, transporte internacional." },
      { id: "6.4", name: "Procedimento de Exportação e Importação", description: "Sistemática de importação e exportação, portal SISCOMEX, RADAR, classificação de mercadorias, tributos." },
      { id: "6.6", name: "Planejamento Estratégico Internacional", description: "Cenários, análise do ambiente externo e interno, perspectivas conjunturais, indicadores, identificação do diferencial competitivo, avaliação das oportunidades de mercado." }
    ]
  },
  planejamento: {
    label: "Planejamento Empresarial",
    number: 7,
    active: true,
    subareas: [
      { id: "7.1", name: "Diagnóstico Empresarial", description: "Mapeamento da situação global da empresa, levantamento e análise das práticas de planejamento e de gestão, governança, ferramentas de gestão, estratégia de recursos humanos." },
      { id: "7.2", name: "Planejamento Estratégico", description: "Cenários, análise do ambiente externo e interno, perspectivas conjunturais, indicadores, identificação do diferencial competitivo, avaliação das oportunidades de mercado e análise de rentabilidade." },
      { id: "7.3", name: "Gestão de Processos Empresariais", description: "Mapeamento, fluxos, métodos, técnicas e ferramentas de gestão de processos." },
      { id: "7.4", name: "Plano de Negócio", description: "Estudos de viabilidade, identificação de oportunidades, elaboração de planos de negócios." },
      { id: "7.5", name: "Design Estratégico", description: "Aplicação do design para subsidiar processos de tomada de decisão a fim de aumentar as qualidades inovadoras e competitivas de um empreendimento, englobando o branding e design thinking." }
    ]
  },
  gestao_producao: {
    label: "Gestão da Produção e Qualidade",
    number: 8,
    active: false,
    subareas: [
      { id: "8.1", name: "Gestão e Administração do Processo Produtivo", description: "Layout fabril, organização e métodos de trabalho, sistemas produtivos, processos produtivos, administração de materiais, planejamento e controle da produção, manufatura enxuta." },
      { id: "8.2", name: "Logística", description: "Sistematização e automatização de compras de materiais, insumos e serviços, organização e gestão de transporte, distribuição, armazenamento de bens e materiais." },
      { id: "8.3", name: "Suprimentos e Produção", description: "Administração de produtos e insumos, suprimentos, compras, gestão de estoque e fornecedores." },
      { id: "8.4", name: "Gestão de Projetos", description: "Aplicação de técnicas e conhecimentos de gestão de projetos e aplicação de metodologias referências na área, tais como PMBOK, Pert, Waterfall, Scrum, Agile, Kanban etc." }
    ]
  },
  legislacao: {
    label: "Legislação Aplicada aos Pequenos Negócios",
    number: 9,
    active: false,
    subareas: [
      { id: "9.1", name: "Direito Tributário/Fiscal", description: "Legislação, doutrina, jurisprudência nacional ou comparada, impostos, em especial ICMS, IPI, ISS e PIS/COFINS, incluindo regime de Substituição Tributária." },
      { id: "9.2", name: "Direito Empresarial", description: "Tipos de empresas, constituição das sociedades, contratos sociais, tipos de sociedade, procedimentos formais e legais contratos, títulos de crédito, direito e código de defesa do consumidor." },
      { id: "9.4", name: "Propriedade Intelectual", description: "Legislação, doutrina, jurisprudência nacional ou comparada envolvendo direitos autorais, direitos conexos, indicações geográficas, marcas, patentes, software e programa de computador." },
      { id: "9.7", name: "Mediação, Conciliação e Arbitragem", description: "Legislação aplicável aos métodos extra judiciais de soluções de conflitos, teoria do conflito, técnicas de negociação, mediação, conciliação e arbitragem." },
      { id: "9.11", name: "Direito Digital", description: "Legislação, doutrina, jurisprudência comparadas sobre Direito Digital." }
    ]
  },
  sustentabilidade: {
    label: "Sustentabilidade",
    number: 10,
    active: false,
    subareas: [
      { id: "10.1", name: "Sustentabilidade", description: "Diagnóstico, desenvolvimento de ações que possibilitem a manutenção dos recursos naturais, uso dos recursos naturais de forma eficiente, monitoramento e análise de indicadores de sustentabilidade." },
      { id: "10.2", name: "Gestão Ambiental", description: "Licenciamento ambiental (EIA, RIMA), plano de controle ambiental (PCA), sistema de gestão ambiental (SGA), tratamento de efluentes industriais, controle da poluição industrial e doméstica." },
      { id: "10.4", name: "Gestão Energética", description: "Elaboração de diagnósticos e desenvolvimento de projetos de eficiência energética, fontes alternativas (energia solar, eólica, bioenergia, entre outras)." },
      { id: "10.7", name: "Responsabilidade Social", description: "Ética empresarial, conceitos e princípios de gestão responsável, atuação social das empresas, normas de responsabilidade social, ferramentas e indicadores sociais, elaboração de balanço social." },
      { id: "10.8", name: "Eficiência Energética", description: "Ações que visam à eficiência energética e à utilização de fontes alternativas de energia: avaliação de condições de fornecimento, projetos de energias alternativas, sistemas de iluminação eficientes." },
      { id: "10.9", name: "Saúde e Segurança no Trabalho", description: "Ações gerenciais que visam prevenir acidentes do trabalho e doenças ocupacionais, garantindo a integridade física e saúde dos trabalhadores por meio de normas de saúde, higiene e segurança." },
      { id: "10.12", name: "Gestão da Sustentabilidade", description: "Grupo de ações gerenciais do empreendimento que visa à diminuição/eliminação do impacto socioambiental negativo de suas atividades, inclusas as ações de adequação à legislação ambiental vigente." }
    ]
  },
  inovacao: {
    label: "Inovação",
    number: 11,
    active: true,
    subareas: [
      { id: "11.4", name: "Inovação", description: "Conceitos de inovação e de inovação tecnológica, indicadores, sistemas e processos voltados a cultura da gestão da inovação, ambiente para apoio à inovação nos pequenos negócios." },
      { id: "11.6", name: "Startup", description: "Gestão e operação de startup, modelagem e validação de modelos de negócios, análise de mercado, definição de métricas, pitches de negócios, valuation de startups." },
      { id: "11.8", name: "Inteligência Artificial", description: "Disseminação do conceito de Inteligência Artificial, prospecção e implantação de sistemas de suporte a decisão baseado em Inteligência Artificial no contexto de processos produtivos." },
      { id: "11.14", name: "Gestão de Projetos de PD&I", description: "Competência na elaboração e gestão de projetos de PD&I, no acompanhamento e validação de entregas técnicas/tecnológicas previstas nos projetos, na prestação de contas dos recursos." }
    ]
  },
  tecnologia: {
    label: "Tecnologia da Informação",
    number: 12,
    active: false,
    subareas: [
      { id: "12.1", name: "Governança da Tecnologia da Informação", description: "Diagnosticar e propor soluções que contribuam para que as necessidades, decisões e objetivos corporativos estejam alinhados com os objetivos de TI." },
      { id: "12.2", name: "Segurança da Informação", description: "Diagnóstico e desenvolvimento de soluções que contribuam para o aperfeiçoamento e aplicação da política de segurança da informação, visando preservar a confidencialidade, integridade, disponibilidade e autenticidade." },
      { id: "12.5", name: "Desenvolvimento de Sistemas", description: "Diagnóstico e desenvolvimento de Sistemas de Informações necessários ao pleno funcionamento da empresa." },
      { id: "12.6", name: "Gestão de Dados", description: "Diagnóstico e desenvolvimento de soluções e práticas para integração e controle dos dados corporativos." },
      { id: "12.8", name: "Business Intelligence", description: "Diagnóstico e desenvolvimento de soluções e práticas que visem apoiar as empresas na tomada de decisões inteligentes, mediante dados e informações recolhidas pelos diversos sistemas de informação." }
    ]
  },
  desenvolvimento_territorial: {
    label: "Desenvolvimento Territorial",
    number: 13,
    active: false,
    subareas: [
      { id: "13.1", name: "Aglomerações Produtivas/Arranjos Produtivos Locais", description: "Aglomeração de empresas, governança entre lideranças, entidades e empresários locais, arranjos produtivos, clusters, cadeias produtivas, distritos industriais." },
      { id: "13.2", name: "Planejamento Territorial", description: "Metodologias, estratégias de desenvolvimento a partir da abordagem territorial, diagnósticos, pesquisas que indiquem de que forma as potencialidades econômicas internas e externas podem ser desenvolvidas nos territórios." },
      { id: "13.4", name: "Governança Territorial", description: "Aplicação de metodologias, técnicas e ferramentas para a criação, formação, fortalecimento e dinamização dos atores e instituições dos territórios." }
    ]
  },
  associativismo: {
    label: "Associativismo e Cooperativismo",
    number: 14,
    active: true,
    subareas: [
      { id: "14.1", name: "Organização, Constituição e Funcionamento", description: "Modelo de gestão e ferramentas para melhoria de resultados em associações, cooperativas, clubes de serviços, organizações não governamentais, centrais de negócios, OSCIP e demais formas associativas." },
      { id: "14.2", name: "Cooperação", description: "Cultura da cooperação, cooperação empresarial, formação, implantação e fortalecimento de redes associativas, organizações de cooperação de pequenos empreendimentos, redes empresariais, ações coletivas." }
    ]
  },
  desenvolvimento_setorial: {
    label: "Desenvolvimento Setorial",
    number: 15,
    active: false,
    subareas: [
      { id: "15.16", name: "Gestão do Agronegócio", description: "Diagnóstico de competitividade do empreendimento, estudos de viabilidade, logística, armazenagem, preços agropecuários, comercialização de produtos, identificação de nichos de mercado." },
      { id: "15.22", name: "Serviços de Alimentação", description: "Elaboração de análises e estudos de serviços de alimentação (alimentação fora do lar, marmitaria e delivery), considerando temáticas transversais e específicas do ramo." },
      { id: "15.23", name: "Negócios de Impacto Social", description: "Conceitos, modelagens, processos e ferramentas de prospecção, análise, gestão e aceleração; fontes de acesso a financiamentos e investimentos; atuação transversal com o desenvolvimento territorial e ODS." },
      { id: "15.30", name: "Varejo", description: "Ações de desenvolvimento setorial voltadas para o segmento de Varejo, consultoria em análise, planejamento, implementação e monitoramento de diagnósticos, planos, técnicas, ferramentas e tendências." },
      { id: "15.33", name: "Serviços", description: "Ações de desenvolvimento setorial voltadas para o segmento de serviços, atendendo às especificidades dos clientes em suas demandas de gestão empresarial." }
    ]
  },
  politicas_publicas: {
    label: "Políticas Públicas",
    number: 16,
    active: true,
    subareas: [
      { id: "16.1", name: "Gestão Pública", description: "Ferramentas e instrumentos de gestão pública (Lei Orçamentária Anual, Lei de Diretrizes Orçamentárias, Código de Postura, Código Tributário, Plano Plurianual, Lei de Responsabilidade Fiscal, Plano Diretor, Lei Orgânica etc.)." },
      { id: "16.2", name: "Desenvolvimento Local e Políticas Públicas", description: "Estratégias de desenvolvimento local e regional por meio de políticas públicas municipais de apoio aos pequenos negócios." },
      { id: "16.3", name: "Políticas Públicas de Apoio aos Pequenos Negócios", description: "Estratégias de desenvolvimento focadas em políticas de apoio aos pequenos negócios, políticas públicas tributárias de incentivo, estratégias e metodologias de formulação, implementação e avaliação de programas." },
      { id: "16.5", name: "Compras Públicas", description: "Legislação, doutrina, jurisprudência sobre licitações públicas, com foco no tratamento favorecido para os pequenos negócios nas compras públicas, previsto no Art. 170 CF, na LC 123/06." },
      { id: "16.7", name: "Microempreendedor Individual", description: "Regras e procedimentos burocráticos públicos específicos do Microempreendedor Individual (MEI), políticas e procedimentos públicos para aplicação dos benefícios da legislação relativa ao MEI." },
      { id: "16.8", name: "Microempresa e Empresa de Pequeno Porte", description: "Legislação, doutrina, jurisprudência nacional ou comparada, definição de MPE, inscrição e baixa da empresa, tributos e contribuições, Simples Nacional, tratamento favorecido e jurídico diferenciado para as MPE." }
    ]
  },
  desenvolvimento_tecnologico: {
    label: "Desenvolvimento Tecnológico",
    number: 17,
    active: false,
    subareas: [
      { id: "17.1", name: "Gestão da Inovação", description: "Criação de condições para que ocorra o processo contínuo e permanente de produção de inovações na empresa. Inovação em produtos e processos, inovação organizacional e inovação no modelo do negócio." },
      { id: "17.2", name: "Planejamento Tecnológico", description: "Auxilia na estruturação, desdobramento, comunicação e estabelecimento da visão de futuro da organização e na sua integração com os planos de mercado, produto e tecnologia." },
      { id: "17.3", name: "Transformação Digital", description: "Ação para implementação de tecnologias digitais e adaptação às tendências tecnológicas, tais como Internet das Coisas, Indústria 4.0, Inteligência Artificial, Big Data, Business Intelligence." },
      { id: "17.5", name: "Desenvolvimento do Produto", description: "Desenvolvimento de novos produtos com o objetivo de gerar inovações na empresa. Elaboração de projetos complexos e/ou prototipação para novas máquinas, equipamentos e produtos." },
      { id: "17.6", name: "Propriedade Intelectual", description: "Busca, análise e pedidos de concessão dos ativos de propriedade intelectual (patentes, desenho industrial, cultivares, programa de computador e topografia de circuitos integrados) das empresas." }
    ]
  },
  design: {
    label: "Design",
    number: 18,
    active: false,
    subareas: [
      { id: "18.1", name: "Design de Ambiente", description: "Arquitetura e design relacionados ao planejamento e ao desenvolvimento de projetos aplicados aos ambientes internos envolvendo soluções estéticas, técnicas e funcionais voltadas à experiência do usuário." },
      { id: "18.2", name: "Design de Comunicação", description: "Design aplicada ao planejamento, ao projeto e ao desenvolvimento de soluções de comunicação visual, por meio da articulação e da organização de elementos visuais e textos sobre diversos suportes." },
      { id: "18.3", name: "Design de Produto", description: "Design relacionada ao planejamento e ao projeto que envolvem soluções estéticas formais, de funcionalidade, de tecnologias, de âmbito emocional, de uso, de processos e de soluções de produção aplicadas a um produto." },
      { id: "18.4", name: "Design de Serviço", description: "Design relacionada ao planejamento e ao projeto de soluções, criativas e inovadoras, para proporcionar experiências de uso e de âmbito emocional aos usuários. É o conjunto de elementos e fatores relativos à experiência do usuário (UX)." }
    ]
  },
  producao_qualidade: {
    label: "Produção e Qualidade",
    number: 19,
    active: false,
    subareas: [
      { id: "19.1", name: "Mapeamento de Melhoria de Processos", description: "Mapeamento e melhoria de processos para identificar e padronizar a forma de produção/operação atual, aplicar diagnósticos tecnológicos para os processos produtivos da empresa." },
      { id: "19.2", name: "Cadeia de Suprimento", description: "Planejamento e controle de processos, materiais, fluxos de informação e atividades logísticas dentro da empresa e de sua cadeia de suprimentos." },
      { id: "19.3", name: "Gestão da Qualidade", description: "Atividade coordenada no sentido de possibilitar a melhoria de produtos/serviços com vistas a garantir a satisfação das necessidades dos clientes. Inclui as ações de controle, bem como medições aplicadas na garantia da qualidade." },
      { id: "19.4", name: "Certificação/Inspeção", description: "Certificação de produtos, processos, serviços e sistemas de gestão é realizada por terceira parte, para executar a avaliação da conformidade de um ou mais desses objetos a requisitos preestabelecidos." }
    ]
  }
};

export const AREA_OPTIONS = Object.entries(SERVICE_AREAS).map(([key, val]) => ({
  value: key,
  label: `${val.number}. ${val.label}`,
  active: val.active
})).sort((a, b) => {
  const numA = SERVICE_AREAS[a.value].number;
  const numB = SERVICE_AREAS[b.value].number;
  return numA - numB;
});

export const getSubareas = (areaKey) => {
  return SERVICE_AREAS[areaKey]?.subareas?.map(s => s.name) || [];
};

export const getSubareasWithDetails = (areaKey) => {
  return SERVICE_AREAS[areaKey]?.subareas || [];
};