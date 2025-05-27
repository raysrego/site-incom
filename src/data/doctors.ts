export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  education: string[];
  biography: string;
}

export const doctors: Doctor[] = [
  {
    id: "dr-ricardo-silva",
    name: "Dr. Ricardo Silva",
    specialty: "Ortopedia - Coluna",
    image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFMA",
      "Residência em Ortopedia e Traumatologia - Hospital Sarah Kubitschek",
      "Especialização em Cirurgia da Coluna - Instituto de Ortopedia e Traumatologia da USP"
    ],
    biography: "Dr. Ricardo Silva é especialista em Cirurgia da Coluna, com mais de 15 anos de experiência no tratamento de patologias da coluna vertebral."
  },
  {
    id: "dra-maria-costa",
    name: "Dra. Maria Costa",
    specialty: "Ortopedia - Joelho",
    image: "https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFMA",
      "Residência em Ortopedia e Traumatologia - Hospital das Clínicas FMUSP",
      "Fellowship em Cirurgia do Joelho - Instituto Nacional de Traumatologia e Ortopedia (INTO)"
    ],
    biography: "Dra. Maria Costa é especializada em cirurgia do joelho, com foco em procedimentos minimamente invasivos e reconstrução ligamentar."
  },
  {
    id: "dr-antonio-ferreira",
    name: "Dr. Antonio Ferreira",
    specialty: "Ortopedia - Quadril",
    image: "https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFMA",
      "Residência em Ortopedia e Traumatologia - Hospital das Clínicas FMUSP",
      "Especialização em Cirurgia do Quadril - Hospital Sírio-Libanês"
    ],
    biography: "Dr. Antonio Ferreira é especialista em cirurgia do quadril, com vasta experiência em artroplastia e tratamento de fraturas complexas."
  },
  {
    id: "dra-carolina-santos",
    name: "Dra. Carolina Santos",
    specialty: "Ortopedia - Ombro e Cotovelo",
    image: "https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFRJ",
      "Residência em Ortopedia e Traumatologia - Santa Casa de São Paulo",
      "Fellowship em Cirurgia de Ombro e Cotovelo - Instituto de Ortopedia e Traumatologia da USP"
    ],
    biography: "Dra. Carolina Santos é especialista em cirurgia de ombro e cotovelo, com foco em artroscopia e tratamento de lesões de manguito rotador."
  },
  {
    id: "dr-pedro-oliveira",
    name: "Dr. Pedro Oliveira",
    specialty: "Ortopedia - Pé e Tornozelo",
    image: "https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFC",
      "Residência em Ortopedia e Traumatologia - Santa Casa de São Paulo",
      "Fellowship em Cirurgia do Pé e Tornozelo - Hospital Israelita Albert Einstein"
    ],
    biography: "Dr. Pedro Oliveira é especialista em cirurgia do pé e tornozelo, com experiência no tratamento de deformidades e lesões esportivas."
  },
  {
    id: "dra-amanda-lima",
    name: "Dra. Amanda Lima",
    specialty: "Ortopedia - Mão",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFMA",
      "Residência em Ortopedia e Traumatologia - Hospital das Clínicas FMUSP",
      "Fellowship em Cirurgia da Mão - Hospital Sírio-Libanês"
    ],
    biography: "Dra. Amanda Lima é especialista em cirurgia da mão, com foco em microcirurgia e reconstrução de lesões traumáticas."
  },
  {
    id: "dr-marcos-almeida",
    name: "Dr. Marcos Almeida",
    specialty: "Medicina da Dor",
    image: "https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFMA",
      "Residência em Anestesiologia - Hospital das Clínicas FMUSP",
      "Especialização em Medicina da Dor - Hospital Alemão Oswaldo Cruz"
    ],
    biography: "Dr. Marcos Almeida é especialista em Medicina da Dor, com foco no tratamento multidisciplinar da dor crônica e aguda."
  },
  {
    id: "dra-julia-rodrigues",
    name: "Dra. Julia Rodrigues",
    specialty: "Ortopedia Pediátrica",
    image: "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    education: [
      "Graduação em Medicina - UFMG",
      "Residência em Ortopedia e Traumatologia - Santa Casa de São Paulo",
      "Fellowship em Ortopedia Pediátrica - Hospital Pequeno Príncipe"
    ],
    biography: "Dra. Julia Rodrigues é especialista em Ortopedia Pediátrica, com experiência no tratamento de deformidades congênitas e adquiridas em crianças."
  }
];