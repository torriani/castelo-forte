export interface Carousel {
  id: string;
  title: string;
  type: string;
  framework: string;
  status: "pendente" | "aprovado" | "publicado" | "rejeitado";
  slides: { number: number; text: string; imagePath?: string }[];
  caption: string;
  hashtags: string[];
  createdAt: string;
  publishedAt?: string;
  postUrl?: string;
  slideCount: number;
  sourceFile: string;
}

export const mockCarousels: Carousel[] = [
  {
    id: "car-001",
    title: "Por que voce nao consegue cobrar mais caro",
    type: "Imperial",
    framework: "PAS",
    status: "pendente",
    slides: [
      {
        number: 1,
        text: "Por que voce nao consegue cobrar mais caro (e o que fazer sobre isso)",
      },
      {
        number: 2,
        text: "O problema nao e o preco. O problema e que voce nao construiu uma percepcao de valor que justifique o investimento.",
      },
      {
        number: 3,
        text: "Quando voce compete por preco, voce atrai clientes que so querem desconto. E esses clientes nunca ficam.",
      },
      {
        number: 4,
        text: "A solucao? Posicione-se como autoridade. Quem e autoridade nao justifica preco — define preco.",
      },
      {
        number: 5,
        text: "3 passos para cobrar mais caro: 1) Especialize-se em um nicho. 2) Documente resultados. 3) Crie uma oferta irrecusavel.",
        imagePath: "outputs/carrosseis/precificacao/slide-5.png",
      },
      {
        number: 6,
        text: "Se voce quer aprender a estruturar ofertas de alto valor, comenta 'VALOR' que eu te envio o material completo.",
      },
    ],
    caption:
      "A maioria dos empreendedores tem MEDO de cobrar mais caro. Mas o problema nunca foi o preco — foi a percepcao de valor.\n\nNeste carrossel eu mostro os 3 passos que usei para triplicar meu ticket medio em 90 dias.\n\nSalva esse post e aplica hoje.",
    hashtags: [
      "#precificacao",
      "#altoticket",
      "#empreendedorismo",
      "#posicionamento",
      "#marketingdigital",
    ],
    createdAt: "2026-03-28",
    slideCount: 6,
    sourceFile: "outputs/precificacao-imperial.md",
  },
  {
    id: "car-002",
    title: "Consistencia e uma mentira que te contaram",
    type: "Polemico",
    framework: "AIDA",
    status: "aprovado",
    slides: [
      {
        number: 1,
        text: "Consistencia e uma mentira que te contaram",
      },
      {
        number: 2,
        text: "Todo guru fala: 'seja consistente'. Mas ninguem te explica que consistencia sem estrategia e so barulho.",
      },
      {
        number: 3,
        text: "Postar todo dia sem um plano e como correr numa esteira — voce sua, cansa, mas nao sai do lugar.",
      },
      {
        number: 4,
        text: "O que funciona: publicar com intencao. Cada post precisa ter um objetivo claro — atrair, nutrir ou converter.",
      },
      {
        number: 5,
        text: "Para de postar por postar. Comeca a publicar com proposito. Seu conteudo e uma ferramenta de vendas, nao um diario.",
      },
    ],
    caption:
      "Voce nao precisa postar todo dia. Voce precisa postar com ESTRATEGIA.\n\nConsistencia sem direcao e desperdicio de energia. Cada conteudo que voce publica precisa ter um objetivo: atrair, nutrir ou converter.\n\nConcorda? Comenta 'SIM' aqui embaixo.",
    hashtags: [
      "#conteudo",
      "#estrategia",
      "#marketingdeconteudo",
      "#redessociais",
      "#instagram",
    ],
    createdAt: "2026-03-27",
    slideCount: 5,
    sourceFile: "outputs/consistencia-polemica.md",
  },
  {
    id: "car-003",
    title: "A crenca que impede 90% dos experts de escalar",
    type: "Crenca",
    framework: "Storytelling",
    status: "publicado",
    slides: [
      {
        number: 1,
        text: "A crenca que impede 90% dos experts de escalar",
        imagePath: "outputs/carrosseis/crenca-escalar/slide-1.png",
      },
      {
        number: 2,
        text: "'Se eu crescer muito, vou perder qualidade.' Essa frase destruiu mais negocios do que qualquer concorrente.",
        imagePath: "outputs/carrosseis/crenca-escalar/slide-2.png",
      },
      {
        number: 3,
        text: "A verdade: escala nao e o oposto de qualidade. Escala e qualidade com sistema.",
        imagePath: "outputs/carrosseis/crenca-escalar/slide-3.png",
      },
      {
        number: 4,
        text: "Os melhores do mundo escalam PORQUE tem qualidade, nao apesar dela. McDonalds tem processo. Apple tem processo.",
        imagePath: "outputs/carrosseis/crenca-escalar/slide-4.png",
      },
      {
        number: 5,
        text: "Troque a crenca: 'Eu nao consigo escalar' por 'Eu ainda nao tenho o sistema certo para escalar.'",
        imagePath: "outputs/carrosseis/crenca-escalar/slide-5.png",
      },
    ],
    caption:
      "Essa crenca me travou por 3 anos: 'se eu crescer, vou perder qualidade.'\n\nAte que entendi que os maiores do mundo escalam JUSTAMENTE porque tem qualidade + sistema.\n\nQual crenca esta te travando? Me conta nos comentarios.",
    hashtags: [
      "#mindset",
      "#escala",
      "#mentalidade",
      "#crescimento",
      "#negocios",
    ],
    createdAt: "2026-03-25",
    publishedAt: "2026-03-26",
    postUrl: "https://instagram.com/p/abc123",
    slideCount: 5,
    sourceFile: "outputs/crenca-escalar.md",
  },
  {
    id: "car-004",
    title: "O framework que uso para criar ofertas irrecusaveis",
    type: "Educativo",
    framework: "RMBC",
    status: "pendente",
    slides: [
      {
        number: 1,
        text: "O framework que uso para criar ofertas irrecusaveis (e voce pode copiar)",
      },
      {
        number: 2,
        text: "Toda oferta irrecusavel tem 4 elementos: Resultado, Mecanismo, Bonus e CTA. Sem qualquer um deles, a conversao despenca.",
      },
      {
        number: 3,
        text: "RESULTADO: O que o cliente vai conquistar? Seja especifico. 'Emagrecer' e fraco. 'Perder 7kg em 60 dias sem academia' e forte.",
      },
      {
        number: 4,
        text: "MECANISMO: Como funciona? Qual o metodo unico? O mecanismo e o que diferencia voce de todos os outros.",
      },
      {
        number: 5,
        text: "BONUS: O que mais o cliente leva? Bonus estrategicos reduzem a percepcao de risco e aumentam o valor percebido.",
      },
      {
        number: 6,
        text: "CTA: Qual o proximo passo? Nunca termine sem um chamado claro para acao. Ambiguidade mata conversao.",
      },
      {
        number: 7,
        text: "Quer o template completo desse framework? Comenta 'OFERTA' que eu te envio direto no DM.",
      },
    ],
    caption:
      "Toda oferta irrecusavel segue a mesma estrutura: Resultado + Mecanismo + Bonus + CTA.\n\nSe sua oferta nao esta convertendo, provavelmente esta faltando um desses 4 pilares.\n\nSalva esse post como referencia e aplica na sua proxima campanha.",
    hashtags: [
      "#ofertas",
      "#copywriting",
      "#vendas",
      "#marketing",
      "#framework",
    ],
    createdAt: "2026-03-29",
    slideCount: 7,
    sourceFile: "outputs/framework-ofertas-rmbc.md",
  },
  {
    id: "car-005",
    title: "5 sinais de que seu posicionamento esta errado",
    type: "Lista",
    framework: "Listicle",
    status: "rejeitado",
    slides: [
      {
        number: 1,
        text: "5 sinais de que seu posicionamento esta errado (e voce nem percebe)",
      },
      {
        number: 2,
        text: "1. Voce atrai muitos curiosos mas poucos compradores. Isso significa que seu conteudo nao filtra o publico certo.",
      },
      {
        number: 3,
        text: "2. As pessoas te comparam com concorrentes mais baratos. Se voce e comparavel, voce e substituivel.",
      },
      {
        number: 4,
        text: "3. Ninguem indica voce espontaneamente. Posicionamento forte gera boca a boca natural.",
      },
      {
        number: 5,
        text: "4. Voce muda de nicho toda hora. Falta de clareza interna gera confusao externa.",
      },
      {
        number: 6,
        text: "5. Voce nao consegue explicar o que faz em uma frase. Se voce nao consegue, seu cliente tambem nao.",
      },
    ],
    caption:
      "Se voce se identificou com 3 ou mais desses sinais, e hora de repensar seu posicionamento.\n\nPosicionamento nao e o que voce diz sobre voce — e o que o mercado entende sobre voce.\n\nQual desses sinais mais te surpreendeu? Me conta aqui.",
    hashtags: [
      "#posicionamento",
      "#branding",
      "#marcapessoal",
      "#autoridade",
      "#nicho",
    ],
    createdAt: "2026-03-26",
    slideCount: 6,
    sourceFile: "outputs/sinais-posicionamento.md",
  },
  {
    id: "car-006",
    title: "A verdade sobre vender no Instagram em 2026",
    type: "Tendencia",
    framework: "Before-After-Bridge",
    status: "aprovado",
    slides: [
      {
        number: 1,
        text: "A verdade sobre vender no Instagram em 2026 (que ninguem esta falando)",
      },
      {
        number: 2,
        text: "ANTES: Em 2023, bastava postar Reels virais e os clientes apareciam. A plataforma entregava alcance de graca.",
      },
      {
        number: 3,
        text: "DEPOIS: Em 2026, o algoritmo prioriza conexao. Quem cria comunidade vende. Quem busca viralizar, some.",
      },
      {
        number: 4,
        text: "A PONTE: Troque metricas de vaidade por metricas de conversao. Salvamentos, compartilhamentos e DMs valem mais que likes.",
      },
      {
        number: 5,
        text: "3 acoes para vender mais em 2026: 1) Stories com CTA diario 2) Carrosseis educativos 3) DMs personalizados",
      },
      {
        number: 6,
        text: "O Instagram mudou. A pergunta e: voce vai mudar junto ou vai continuar fazendo o que funcionava 3 anos atras?",
      },
    ],
    caption:
      "O Instagram de 2026 nao e o mesmo de 2023. Quem ainda esta tentando viralizar vai ficar para tras.\n\nO jogo agora e sobre CONEXAO e COMUNIDADE. Quem cria relacionamento, vende. Quem cria barulho, desaparece.\n\nSalva esse post e muda sua estrategia hoje.",
    hashtags: [
      "#instagram2026",
      "#vendasonline",
      "#marketingdigital",
      "#redessociais",
      "#estrategia",
    ],
    createdAt: "2026-03-28",
    slideCount: 6,
    sourceFile: "outputs/instagram-2026-tendencia.md",
  },
];
