export interface Treatment {
  id: string;
  name: string;
  description: string;
  image: string;
  specialties: string[];
}

export const treatments: Treatment[] = [
  {
    id: "artroplastia",
    name: "Artroplastia",
    description: "Procedimento cirúrgico para substituição total ou parcial de articulações danificadas por próteses, restaurando a função e aliviando a dor causada por artrose ou artrite.",
    image: "https://images.pexels.com/photos/8460255/pexels-photo-8460255.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Quadril", "Joelho", "Ombro e Cotovelo"]
  },
  {
    id: "artroscopia",
    name: "Artroscopia",
    description: "Procedimento cirúrgico minimamente invasivo que utiliza uma pequena câmera (artroscópio) para visualizar, diagnosticar e tratar problemas dentro das articulações.",
    image: "https://images.pexels.com/photos/8453536/pexels-photo-8453536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Joelho", "Ombro e Cotovelo", "Quadril"]
  },
  {
    id: "tratamento-hernia-disco",
    name: "Tratamento de Hérnia de Disco",
    description: "Abordagem terapêutica para hérnia de disco, que pode incluir tratamentos conservadores ou cirúrgicos, dependendo da gravidade da condição.",
    image: "https://images.pexels.com/photos/4506108/pexels-photo-4506108.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Coluna"]
  },
  {
    id: "reconstrucao-ligamentar",
    name: "Reconstrução Ligamentar",
    description: "Procedimento cirúrgico para reparar ligamentos rompidos, como o ligamento cruzado anterior (LCA) do joelho, restaurando a estabilidade da articulação.",
    image: "https://images.pexels.com/photos/7659567/pexels-photo-7659567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Joelho", "Tornozelo"]
  },
  {
    id: "cirurgia-mao",
    name: "Cirurgia da Mão",
    description: "Procedimentos cirúrgicos especializados para tratar condições como síndrome do túnel do carpo, dedo em gatilho, artrite e lesões traumáticas da mão.",
    image: "https://images.pexels.com/photos/6823652/pexels-photo-6823652.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Mão"]
  },
  {
    id: "tratamento-escoliose",
    name: "Tratamento de Escoliose",
    description: "Abordagem terapêutica para escoliose, que pode incluir observação, uso de órteses ou cirurgia, dependendo da gravidade da curvatura da coluna.",
    image: "https://images.pexels.com/photos/5215199/pexels-photo-5215199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Coluna", "Ortopedia Pediátrica"]
  },
  {
    id: "tratamento-pe-chato",
    name: "Tratamento de Pé Chato",
    description: "Abordagem terapêutica para pé chato, que pode incluir fisioterapia, uso de órteses ou cirurgia, dependendo da gravidade da condição.",
    image: "https://images.pexels.com/photos/7625126/pexels-photo-7625126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Pé e Tornozelo", "Ortopedia Pediátrica"]
  },
  {
    id: "bloqueios-anestesicos",
    name: "Bloqueios Anestésicos",
    description: "Procedimentos minimamente invasivos para alívio da dor, que consistem na injeção de medicamentos anestésicos próximo a nervos específicos.",
    image: "https://images.pexels.com/photos/8942047/pexels-photo-8942047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Medicina da Dor"]
  },
  {
    id: "fisioterapia",
    name: "Fisioterapia",
    description: "Conjunto de técnicas que visam a reabilitação física e funcional do paciente, utilizando recursos como exercícios terapêuticos, massagens e eletroterapia.",
    image: "https://images.pexels.com/photos/6098054/pexels-photo-6098054.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    specialties: ["Ortopedia Geral", "Coluna", "Joelho", "Quadril", "Ombro e Cotovelo", "Pé e Tornozelo", "Mão", "Medicina da Dor", "Ortopedia Pediátrica"]
  }
];