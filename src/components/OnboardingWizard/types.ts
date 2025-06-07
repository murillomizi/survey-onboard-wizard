
export type OnboardingData = {
  setor: string;
  tamanhoEmpresa: string;
  palavrasChave: string[];

  cargo: string;
  desafios: string[];
  objetivos: string[];

  csvFileName?: string;
  csvData?: any[];

  userEmail?: string;
};
