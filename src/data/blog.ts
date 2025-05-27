export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "prevencao-lesoes-esportivas",
    title: "Prevenção de lesões esportivas: dicas importantes",
    excerpt: "Conheça as principais formas de prevenir lesões durante a prática esportiva e mantenha-se ativo com segurança.",
    content: `
      <p>A prática regular de atividades físicas é fundamental para a manutenção da saúde, mas é importante tomar alguns cuidados para evitar lesões que podem comprometer sua qualidade de vida.</p>
      
      <h3>Aquecimento adequado</h3>
      <p>Antes de iniciar qualquer atividade física, dedique pelo menos 10 minutos para o aquecimento. Isso prepara seus músculos e articulações para o esforço, reduzindo significativamente o risco de lesões.</p>
      
      <h3>Equipamentos adequados</h3>
      <p>Utilize calçados e roupas apropriados para cada modalidade esportiva. Um tênis inadequado, por exemplo, pode causar lesões nos pés, tornozelos e joelhos.</p>
      
      <h3>Progressão gradual</h3>
      <p>Aumente a intensidade, duração e frequência dos exercícios de forma gradual. Tentar fazer muito em pouco tempo é uma das principais causas de lesões esportivas.</p>
      
      <h3>Técnica correta</h3>
      <p>Aprenda a técnica correta para o esporte ou exercício que pratica. Movimentos realizados de forma inadequada podem sobrecarregar articulações e músculos.</p>
      
      <h3>Fortalecimento muscular</h3>
      <p>Inclua exercícios de fortalecimento em sua rotina, especialmente para os músculos que estabilizam as articulações mais exigidas em seu esporte.</p>
      
      <h3>Descanso e recuperação</h3>
      <p>Respeite os períodos de descanso entre os treinos. É durante o repouso que ocorre a recuperação muscular e a adaptação ao estímulo do exercício.</p>
      
      <h3>Hidratação e alimentação</h3>
      <p>Mantenha-se bem hidratado e tenha uma alimentação equilibrada, fornecendo ao corpo os nutrientes necessários para o bom funcionamento muscular.</p>
      
      <h3>Atenção aos sinais do corpo</h3>
      <p>Aprenda a diferenciar a dor muscular normal após o exercício de uma possível lesão. Persistindo o desconforto, procure orientação médica.</p>
      
      <p>Seguindo essas orientações, você poderá desfrutar dos benefícios da atividade física com maior segurança e menor risco de lesões.</p>
    `,
    author: "Dr. Ricardo Silva",
    date: "15/06/2025",
    image: "https://images.pexels.com/photos/3076509/pexels-photo-3076509.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Prevenção", "Esportes", "Lesões"]
  },
  {
    id: "dor-nas-costas",
    title: "Dor nas costas: quando procurar um especialista",
    excerpt: "Saiba identificar os sinais de alerta que indicam a necessidade de consultar um médico especialista em problemas de coluna.",
    content: `
      <p>A dor nas costas é uma das queixas mais comuns nos consultórios médicos e, embora muitas vezes seja temporária e sem gravidade, em alguns casos pode indicar problemas mais sérios que exigem atenção especializada.</p>
      
      <h3>Sinais de alerta</h3>
      <p>Alguns sintomas que acompanham a dor nas costas podem indicar condições que requerem avaliação médica imediata:</p>
      
      <ul>
        <li>Dor que irradia para braços, pernas ou causa dormência</li>
        <li>Dor que piora à noite ou ao deitar</li>
        <li>Dor acompanhada de febre, perda de peso inexplicada ou problemas intestinais/urinários</li>
        <li>Dor após trauma ou queda</li>
        <li>Dor intensa que limita movimentos básicos</li>
        <li>Dor persistente por mais de seis semanas</li>
      </ul>
      
      <h3>Causas comuns de dor nas costas</h3>
      <p>Existem diversas condições que podem causar dor nas costas, desde problemas musculares até condições mais complexas da coluna:</p>
      
      <ul>
        <li>Distensão muscular</li>
        <li>Hérnia de disco</li>
        <li>Artrose da coluna</li>
        <li>Estenose espinhal</li>
        <li>Escoliose</li>
        <li>Osteoporose com fraturas por compressão</li>
      </ul>
      
      <h3>Diagnóstico correto</h3>
      <p>Um especialista em coluna realizará uma avaliação completa, que pode incluir:</p>
      
      <ul>
        <li>Histórico médico detalhado</li>
        <li>Exame físico específico</li>
        <li>Exames de imagem quando necessário (raio-x, ressonância magnética)</li>
      </ul>
      
      <h3>Tratamentos disponíveis</h3>
      <p>O tratamento varia conforme a causa da dor e pode incluir:</p>
      
      <ul>
        <li>Medicamentos para controle da dor e inflamação</li>
        <li>Fisioterapia</li>
        <li>Orientações posturais</li>
        <li>Infiltrações</li>
        <li>Procedimentos minimamente invasivos</li>
        <li>Cirurgia em casos específicos</li>
      </ul>
      
      <p>Lembre-se: a automedicação prolongada pode mascarar sintomas importantes e atrasar o diagnóstico correto. Na dúvida, consulte um especialista.</p>
    `,
    author: "Dr. Ricardo Silva",
    date: "02/05/2025",
    image: "https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Coluna", "Dor nas costas", "Tratamento"]
  },
  {
    id: "cuidados-pos-operatorios",
    title: "Cuidados pós-operatórios em cirurgias ortopédicas",
    excerpt: "Orientações essenciais para uma recuperação adequada após procedimentos ortopédicos.",
    content: `
      <p>A recuperação após uma cirurgia ortopédica é tão importante quanto o próprio procedimento cirúrgico. Seguir corretamente as orientações médicas no período pós-operatório é fundamental para garantir bons resultados e prevenir complicações.</p>
      
      <h3>Medicação</h3>
      <p>Tome os medicamentos prescritos pelo seu médico nos horários indicados, especialmente analgésicos e anti-inflamatórios, que ajudam a controlar a dor e o inchaço. Não interrompa o uso sem orientação médica, mesmo que se sinta melhor.</p>
      
      <h3>Cuidados com o curativo</h3>
      <p>Mantenha o curativo limpo e seco. Siga as orientações médicas sobre quando e como trocá-lo. Observe sinais de infecção como vermelhidão, calor, inchaço excessivo ou secreção, e comunique imediatamente ao seu médico caso perceba algum destes sintomas.</p>
      
      <h3>Repouso e movimentação</h3>
      <p>Respeite as orientações sobre repouso e movimentação. Algumas cirurgias exigem imobilização completa da área operada, enquanto outras permitem ou até recomendam movimentação precoce. Seguir corretamente estas orientações é crucial para o sucesso do tratamento.</p>
      
      <h3>Elevação do membro</h3>
      <p>Em muitas cirurgias ortopédicas, especialmente de membros inferiores, é recomendado manter o membro elevado para reduzir o inchaço. Utilize almofadas para posicionar adequadamente a região operada quando estiver em repouso.</p>
      
      <h3>Aplicação de gelo</h3>
      <p>A aplicação de gelo nos primeiros dias após a cirurgia ajuda a reduzir dor e inchaço. Utilize uma bolsa de gelo envolta em um pano fino (nunca diretamente sobre a pele) por períodos de 15-20 minutos, várias vezes ao dia.</p>
      
      <h3>Alimentação e hidratação</h3>
      <p>Mantenha uma alimentação balanceada, rica em proteínas, vitaminas e minerais, que auxiliam na cicatrização. Beba bastante água para manter-se bem hidratado.</p>
      
      <h3>Fisioterapia</h3>
      <p>Siga rigorosamente o programa de reabilitação prescrito pelo seu médico. A fisioterapia é essencial para recuperar força, mobilidade e função após muitas cirurgias ortopédicas.</p>
      
      <h3>Retorno às atividades</h3>
      <p>Não apresse o retorno às atividades habituais. Respeite os prazos indicados pelo seu médico para voltar a dirigir, trabalhar, praticar esportes ou realizar esforços físicos.</p>
      
      <h3>Consultas de acompanhamento</h3>
      <p>Não falte às consultas de acompanhamento. Elas são fundamentais para que o médico avalie sua recuperação e faça os ajustes necessários no tratamento.</p>
      
      <p>Lembre-se: cada cirurgia é única, assim como cada paciente. As orientações aqui apresentadas são gerais e podem variar conforme o procedimento realizado e suas condições específicas. Sempre siga as recomendações do seu médico.</p>
    `,
    author: "Dra. Maria Costa",
    date: "10/04/2025",
    image: "https://images.pexels.com/photos/3376790/pexels-photo-3376790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    tags: ["Pós-operatório", "Cirurgia ortopédica", "Recuperação"]
  }
];