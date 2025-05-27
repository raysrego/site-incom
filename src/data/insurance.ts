export interface Insurance {
  id: string;
  name: string;
  logo?: string;
}

export const insuranceList: Insurance[] = [
  { id: "amil", name: "AMIL" },
  { id: "assefaz", name: "ASSEFAZ" },
  { id: "camed", name: "CAMED" },
  { id: "casf", name: "CASF" },
  { id: "cassi", name: "CASSI" },
  { id: "capesaude", name: "CAPESAUDE" },
  { id: "central-nacional-unimed", name: "CENTRAL NACIONAL UNIMED" },
  { id: "conab", name: "CONAB" },
  { id: "e-vida", name: "E-VIDA" },
  { id: "geap", name: "GEAP" },
  { id: "mediservice", name: "MEDISERVICE" },
  { id: "postal-saude", name: "POSTAL SAÚDE" },
  { id: "saude-bradesco", name: "SAÚDE BRADESCO" },
  { id: "saude-caixa", name: "SAÚDE CAIXA" },
  { id: "sulamerica", name: "SULAMERICA" },
  { id: "unimed-seguros", name: "UNIMED SEGUROS" },
  { id: "vale-e-pasa", name: "VALE E PASA" },
  { id: "veritas", name: "VERITAS" }
];