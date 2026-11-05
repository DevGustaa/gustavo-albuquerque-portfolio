import { companyLogos } from "./profile";
import type { Content } from "./types";

export const pt: Content = {
  meta: {
    title: "Gustavo de Albuquerque Lemos | Desenvolvedor Full Stack",
    description:
      "Portfólio de Gustavo de Albuquerque Lemos, desenvolvedor full stack em Fortaleza – CE. Sistemas hospitalares, SSO, segurança, LGPD e aplicações com IA.",
  },
  nav: {
    about: "Sobre",
    skills: "Skills",
    projects: "Projetos",
    experience: "Experiência",
    contact: "Contato",
  },
  ui: {
    toggleTheme: "Alternar tema claro/escuro",
    switchLanguage: "Switch to English",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    repository: "Código",
    liveDemo: "Demo",
    mainNavigation: "Navegação principal",
    statusProduction: "Em produção",
    statusStaging: "Em homologação",
    screenshotUnavailableTitle: "Prévia indisponível",
    screenshotUnavailableText: "Nem todo projeto pode ter as telas divulgadas. Por diretrizes da empresa ou do cliente, este pode não ter imagem.",
    previousProject: "Projeto anterior",
    nextProject: "Próximo projeto",
  },
  hero: {
    greeting: "Olá, eu sou",
    role: "Desenvolvedor Full Stack",
    roles: [
      "Desenvolvedor Full Stack",
      "Engenheiro de Software",
      "SSO, RBAC & LGPD",
      "Apps com IA premiados",
    ],
    tagline:
      "Atuo em todo o ciclo de vida do software — requisitos, arquitetura, desenvolvimento, infraestrutura, deploy e sustentação — com foco em segurança, LGPD e aplicações com IA.",
    ctaProjects: "Ver projetos",
    ctaContact: "Fale comigo",
  },
  about: {
    title: "Sobre mim",
    role: "Desenvolvedor Full Stack",
    now: {
      label: "Hoje @ HGF",
      text: "Sou responsável, de forma solo, pelo desenvolvimento dos sistemas do Hospital Geral de Fortaleza, com foco em autenticação centralizada, segurança e LGPD no tratamento de dados de saúde.",
    },
    award: {
      label: "Reconhecimento",
      title: "21º Prêmio Banking Transformation",
      text: "No Banco do Nordeste, desenvolvi o front-end e o back-end de aplicações de IA para análise de crédito premiadas na categoria Inovação em Crédito.",
    },
    workflow: {
      label: "Como trabalho",
      text: "Uso IA no fluxo de engenharia para ganhar produtividade, mantendo sob minha responsabilidade arquitetura, revisão de código e segurança.",
    },
    location: {
      label: "Base",
      city: "Fortaleza – CE",
    },
    highlights: [
      { value: "2+", label: "anos de experiência" },
      { value: "8", label: "sistemas entregues no HGF" },
    ],
    hobbies: {
      label: "Fora do código",
      items: [
        { name: "Violão", icon: "guitar" },
        { name: "Videogames", icon: "gamepad" },
        { name: "Trilhas", icon: "mountain" },
        { name: "Animes", icon: "tv" },
      ],
    },
  },
  skills: {
    title: "Skills",
    subtitle: "Tecnologias e práticas que uso no dia a dia.",
    allTab: "todas",
    tabsLabel: "Categorias de skills",
    countLabel: "itens",
    groups: [
      {
        name: "Front-end",
        items: ["HTML5", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "React Native"],
      },
      {
        name: "Back-end",
        items: ["TypeScript", "NestJS", "Java", "Spring Boot", "APIs REST"],
      },
      { name: "Dados", items: ["PostgreSQL", "SQL", "Redis"] },
      {
        name: "Infra e DevOps",
        items: [
          "Docker",
          "Linux",
          "Windows Server",
          "Nginx",
          "CI/CD",
          "GitHub Actions/Runners",
          "Git",
          "AWS",
        ],
      },
      {
        name: "Segurança",
        items: ["SSO", "RBAC", "Trilha de auditoria", "Desenvolvimento seguro", "LGPD"],
      },
      {
        name: "Engenharia",
        items: [
          "Elicitação de requisitos",
          "Histórias de usuário",
          "Regras de negócio",
          "Prototipação",
          "Arquitetura",
        ],
      },
      {
        name: "IA",
        items: [
          "Aplicações com IA",
          "Análise de documentos",
          "Assistentes",
          "Desenvolvimento assistido por IA",
        ],
      },
    ],
  },
  projects: {
    title: "Projetos em destaque",
    subtitle: "Sistemas que desenvolvi e que estão em produção ou homologação.",
    items: [
      {
        title: "SIGA",
        logo: companyLogos.hgf,
        host: "siga.hgf.local",
        status: "production",
        description:
          "Sistema de chamada e gestão de atendimento em rede local do HGF. Passou a registrar dados reais do fluxo, revelando horários de pico e permitindo ajustar a escala do setor, e eliminou a chamada de pacientes em voz alta.",
        stack: ["TypeScript", "NestJS", "React", "PostgreSQL"],
      },
      {
        title: "Nexus",
        logo: companyLogos.hgf,
        host: "nexus.hgf.local",
        status: "production",
        description:
          "Serviço de autenticação centralizada (SSO), RBAC e trilha de auditoria para as aplicações do hospital, com práticas de desenvolvimento seguro e LGPD.",
        stack: ["TypeScript", "NestJS", "PostgreSQL", "SSO", "RBAC"],
      },
      {
        title: "Sala Pronta",
        logo: companyLogos.hgf,
        host: "salapronta.hgf.local",
        status: "production",
        description:
          "Gestão em tempo real das salas cirúrgicas, com painel de TV, RBAC e auditoria.",
        stack: ["TypeScript", "NestJS", "React", "PostgreSQL"],
      },
      {
        title: "Design System HGF",
        logo: companyLogos.hgf,
        host: "design-system.hgf.local",
        status: "production",
        description:
          "Biblioteca de componentes reutilizáveis publicada via GitHub Packages e usada nas aplicações do hospital.",
        stack: ["React", "TypeScript", "GitHub Packages"],
      },
      {
        title: "AnalisaAI",
        logo: companyLogos.bnb,
        host: "analisaai.bnb.local",
        description:
          "Aplicação de IA para leitura e análise de documentos no Banco do Nordeste, que acelerou o trabalho dos analistas. Premiada no 21º Prêmio Banking Transformation, categoria Inovação em Crédito.",
        stack: ["IA", "Front-end", "Back-end"],
      },
      {
        title: "LuzIA",
        logo: companyLogos.bnb,
        host: "luzia.bnb.local",
        description:
          "Assistente que responde dúvidas sobre as linhas de crédito do Banco do Nordeste, melhorando o atendimento. Premiada no 21º Prêmio Banking Transformation.",
        stack: ["IA", "Assistente", "Front-end", "Back-end"],
      },
    ],
  },
  experience: {
    title: "Experiência",
    subtitle: "Minha trajetória profissional.",
    items: [
      {
        company: "Hospital Geral de Fortaleza",
        role: "Engenheiro de Software",
        period: "Jul/2026 — atual",
        location: "Fortaleza – CE",
        achievements: [
          "Entrega de 8 sistemas (4 em produção e 4 em homologação), de serviços críticos como SSO e gestão de salas cirúrgicas a aplicações de quiosque para TVs e tablets.",
          "Em homologação: Sentinela Digital (rastreamento de computadores, tablets e TVs com comandos remotos), FeedbackHGF (pesquisa de satisfação em totens e tablets), Kiosk TV e Kiosk Tablet.",
          "Levantamento e validação de requisitos com stakeholders, histórias de usuário, regras de negócio e prototipação.",
          "Definição de stack e arquitetura; desenvolvimento solo de todo o código.",
          "Criação da organização do hospital no GitHub (padrões de repositório e permissões), CI/CD com GitHub Actions e runners, Docker, servidores Linux e Nginx.",
        ],
        stack: ["TypeScript", "NestJS", "React", "PostgreSQL", "Docker", "Nginx", "GitHub Actions"],
      },
      {
        company: "Banco do Nordeste",
        role: "Desenvolvedor Full Stack",
        period: "Jan/2025 — Dez/2025",
        location: "Fortaleza – CE",
        achievements: [
          "Desenvolvimento do front-end e do back-end do AnalisaAI, aplicação de IA para leitura e análise de documentos, e da LuzIA, assistente sobre as linhas de crédito do banco.",
          "As soluções aceleraram a análise feita pelos analistas, melhoraram o atendimento e foram premiadas na 21ª edição do Prêmio Banking Transformation, categoria Inovação em Crédito.",
        ],
        stack: ["IA", "Front-end", "Back-end"],
      },
      {
        company: "Ilegra",
        role: "Desenvolvedor de Software",
        period: "1 ano",
        achievements: [
          "Desenvolvimento do SOS, sistema web para um escritório de advocacia que administra empregados domésticos de seus clientes, com cadastro e controle de funcionários e apoio aos registros no eSocial.",
          "Desenvolvimento de software sob demanda para empresas clientes.",
        ],
        stack: ["NestJS", "Next.js", "TypeScript"],
      },
    ],
  },
  contact: {
    title: "Vamos conversar?",
    subtitle:
      "Estou aberto a novas oportunidades e parcerias. Fique à vontade para entrar em contato.",
    gmailLabel: "Enviar pelo Gmail",
    copyLabel: "Copiar e-mail",
    copiedLabel: "Copiado!",
    copyErrorLabel: "Não foi possível copiar",
    mailtoLabel: "ou abrir no app de e-mail",
  },
  footer: { rights: "Todos os direitos reservados." },
};
