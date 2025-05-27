export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  availability: {
    [day: string]: string[];
  };
  hours: {
    [day: string]: string[];
  };
}

export const specialties: Specialty[] = [
  {
    id: "ortopedia-geral",
    name: "Ortopedia Geral",
    description: "Tratamento de problemas do sistema musculoesquelético, incluindo ossos, articulações, ligamentos, tendões e músculos.",
    icon: "bone",
    availability: {
      "Segunda": ["Manhã", "Tarde"],
      "Terça": ["Manhã", "Tarde"],
      "Quarta": ["Manhã", "Tarde"],
      "Quinta": ["Manhã", "Tarde"],
      "Sexta": ["Manhã", "Tarde"]
    },
    hours: {
      "Segunda": ["08:30 - 11:30", "13:30 - 17:30"],
      "Terça": ["08:30 - 11:30", "13:30 - 17:30"],
      "Quarta": ["08:30 - 11:30", "13:30 - 17:30"],
      "Quinta": ["08:30 - 11:30", "13:30 - 17:30"],
      "Sexta": ["08:30 - 11:30", "13:30 - 17:30"]
    }
  },
  {
    id: "coluna",
    name: "Coluna",
    description: "Diagnóstico e tratamento de condições da coluna vertebral, incluindo hérnia de disco, escoliose e dor lombar.",
    icon: "spine",
    availability: {
      "Segunda": ["Manhã"],
      "Quarta": ["Manhã", "Tarde"],
      "Sexta": ["Tarde"]
    },
    hours: {
      "Segunda": ["08:30 - 11:30"],
      "Quarta": ["08:30 - 10:30", "15:00 - 16:00"],
      "Sexta": ["15:00 - 17:00"]
    }
  },
  {
    id: "joelho",
    name: "Joelho",
    description: "Especialidade dedicada ao tratamento de lesões e doenças do joelho, como ruptura de ligamentos, lesões meniscais e artrose.",
    icon: "knee",
    availability: {
      "Segunda": ["Manhã"],
      "Terça": ["Manhã"],
      "Quinta": ["Tarde"]
    },
    hours: {
      "Segunda": ["09:30 - 11:00"],
      "Terça": ["08:30 - 11:30"],
      "Quinta": ["14:00 - 16:30"]
    }
  },
  {
    id: "quadril",
    name: "Quadril",
    description: "Tratamento de problemas relacionados à articulação do quadril, incluindo artrose, displasia e fraturas.",
    icon: "hip",
    availability: {
      "Terça": ["Manhã"],
      "Quarta": ["Manhã"],
      "Quinta": ["Tarde"],
      "Sexta": ["Tarde"]
    },
    hours: {
      "Terça": ["11:30 - 12:30"],
      "Quarta": ["08:00 - 09:30"],
      "Quinta": ["14:00 - 16:00", "09:00 - 10:30"],
      "Sexta": ["15:00 - 16:30"]
    }
  },
  {
    id: "ombro-cotovelo",
    name: "Ombro e Cotovelo",
    description: "Especialidade focada no diagnóstico e tratamento de lesões e doenças do ombro e cotovelo.",
    icon: "shoulder",
    availability: {
      "Terça": ["Manhã", "Tarde"],
      "Quinta": ["Manhã"]
    },
    hours: {
      "Terça": ["08:30 - 10:30", "13:30 - 15:00"],
      "Quinta": ["08:30 - 11:00"]
    }
  },
  {
    id: "pe-tornozelo",
    name: "Pé e Tornozelo",
    description: "Tratamento de condições e lesões que afetam o pé e o tornozelo, como entorses, fraturas e deformidades.",
    icon: "foot",
    availability: {
      "Quinta": ["Tarde"]
    },
    hours: {
      "Quinta": ["15:00 - 16:30"]
    }
  },
  {
    id: "mao",
    name: "Mão",
    description: "Especialidade dedicada ao tratamento de lesões e doenças da mão, punho e antebraço.",
    icon: "hand",
    availability: {
      "Segunda": ["Tarde"],
      "Quarta": ["Manhã"],
      "Sexta": ["Manhã"]
    },
    hours: {
      "Segunda": ["14:00 - 16:00"],
      "Quarta": ["15:00 - 15:45"],
      "Sexta": ["11:15 - 12:00"]
    }
  },
  {
    id: "medicina-dor",
    name: "Medicina da Dor",
    description: "Especialidade médica focada no diagnóstico e tratamento da dor crônica e aguda.",
    icon: "plus",
    availability: {
      "Segunda": ["Manhã"],
      "Quarta": ["Tarde"]
    },
    hours: {
      "Segunda": ["09:00 - 11:00"],
      "Quarta": ["14:00 - 16:00"]
    }
  },
  {
    id: "ortopedia-pediatrica",
    name: "Ortopedia Pediátrica",
    description: "Tratamento de problemas ortopédicos em crianças e adolescentes, incluindo deformidades congênitas e adquiridas.",
    icon: "child",
    availability: {
      "Quarta": ["Tarde"]
    },
    hours: {
      "Quarta": ["16:00 - 17:30"]
    }
  }
];