export interface Instituicao {
  id: string;
  nome: string;
  logo_url: string;
  cor_primaria: string;
}

export interface Usuario {
  id: string;
  role: 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel';
  nome: string;
  email: string;
  instituicao_id: string;
}

export interface Turma {
  id: string;
  nome_turma: string;
  instituicao_id: string;
  periodo: 'Manhã' | 'Tarde' | 'Integral';
  professor_id?: string | null;
  capacidade_maxima?: number;
  faixa_etaria_min?: number;
  faixa_etaria_max?: number;
}

export interface Aluno {
  id: string;
  nome: string;
  data_nascimento: string;
  foto_url: string;
  turma_id: string | null;
  idade: string;
  alergias?: string;
  restricoes_alimentares?: string;
}

export interface RegistroDiario {
  id: string;
  alunoId: string;
  data: string;
  hora: string;
  tipo: 'chegada' | 'alimentacao' | 'fralda' | 'sono' | 'saida' | 'atividade' | 'bemestar';
  detalhes: string;
  cor: string;
  icone: string;
}

export interface Notificacao {
  id: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
  tipo: 'urgente' | 'info' | 'sucesso';
}

export interface EventoCalendario {
  id: string;
  titulo: string;
  data: string;
  descricao: string;
}

export interface Medicamento {
  id: string;
  alunoId: string;
  nome: string;
  horario: string;
  dosagem: string;
  administrado: boolean;
}

export interface Ocorrencia {
  id: string;
  aluno_id: string;
  titulo: string;
  descricao: string;
  data_hora: string;
  status: 'Pendente' | 'Notificado' | 'Resolvido';
}

export const instituicao: Instituicao = {
  id: '1',
  nome: 'Creche Arco-Íris',
  logo_url: '/placeholder.svg',
  cor_primaria: '234 89% 74%',
};

export const usuarios: Usuario[] = [
  { id: '1', role: 'Admin', nome: 'Carolina Silva', email: 'admin@creche.com', instituicao_id: '1' },
  { id: '2', role: 'Professor', nome: 'Professora Ana', email: 'ana@creche.com', instituicao_id: '1' },
  { id: '3', role: 'Responsavel', nome: 'Mariana Santos', email: 'mariana@email.com', instituicao_id: '1' },
  { id: '4', role: 'Coordenador', nome: 'Carlos Oliveira', email: 'carlos@creche.com', instituicao_id: '1' },
];

export const turmas: Turma[] = [
  { id: '1', nome_turma: 'Berçário', instituicao_id: '1', periodo: 'Integral', capacidade_maxima: 10 },
  { id: '2', nome_turma: 'Maternal I', instituicao_id: '1', periodo: 'Manhã', capacidade_maxima: 15 },
  { id: '3', nome_turma: 'Maternal II', instituicao_id: '1', periodo: 'Tarde', capacidade_maxima: 20 },
];

export const alunos: Aluno[] = [
  { id: '1', nome: 'Joãozinho', data_nascimento: '2024-02-15', foto_url: '', turma_id: '1', idade: '2 anos', alergias: 'Amendoim' },
  { id: '2', nome: 'Maria', data_nascimento: '2024-08-20', foto_url: '', turma_id: '1', idade: '1a 6m' },
  { id: '3', nome: 'Pedro', data_nascimento: '2023-11-10', foto_url: '', turma_id: '2', idade: '2a 3m' },
  { id: '4', nome: 'Ana', data_nascimento: '2024-06-05', foto_url: '', turma_id: '2', idade: '1a 8m', restricoes_alimentares: 'Lactose' },
];

export const registrosDiarios: RegistroDiario[] = [
  { id: '1', alunoId: '1', data: '2026-02-28', hora: '08:00', tipo: 'chegada', detalhes: 'Check-in realizado', cor: 'text-emerald-500', icone: 'DoorOpen' },
];

export const notificacoes: Notificacao[] = [
  { id: '1', mensagem: '🔴 Joãozinho: Fralda G solicitada', tempo: 'Há 10 min', lida: false, tipo: 'urgente' },
];

export const eventosCalendario: EventoCalendario[] = [
  { id: '1', titulo: 'Reunião de Pais', data: '2026-03-05', descricao: 'Reunião semestral com os responsáveis' },
  { id: '2', titulo: 'Festa do Dia das Mães', data: '2026-05-10', descricao: 'Apresentação dos alunos para as mães' },
  { id: '3', titulo: 'Semana da Criança', data: '2026-10-12', descricao: 'Atividades especiais durante a semana' },
  { id: '4', titulo: 'Encerramento do Ano', data: '2026-12-15', descricao: 'Festa de encerramento e formatura' },
];

export const medicamentos: Medicamento[] = [
  { id: '1', alunoId: '1', nome: 'Paracetamol Gotas', horario: '14:00', dosagem: '5 gotas', administrado: false },
];

export const ocorrencias: Ocorrencia[] = [
  { id: '1', aluno_id: '1', titulo: 'Febre leve', descricao: 'Aluno apresentou 37.8 de febre', data_hora: '2026-02-28 10:30', status: 'Notificado' },
];

export const fotosGaleria = [
  { id: '1', alunoId: '1', url: '/placeholder.svg', legenda: 'Pintura com as mãos', data: '2026-02-25', primeiraVez: false },
  { id: '2', alunoId: '1', url: '/placeholder.svg', legenda: 'Primeiro passo sozinho! 🎉', data: '2026-02-20', primeiraVez: true },
  { id: '3', alunoId: '1', url: '/placeholder.svg', legenda: 'Brincando no parquinho', data: '2026-02-24', primeiraVez: false },
  { id: '4', alunoId: '1', url: '/placeholder.svg', legenda: 'Primeira palavra: "mamãe"', data: '2026-02-18', primeiraVez: true },
];
