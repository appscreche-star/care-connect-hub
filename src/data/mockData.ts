export interface Instituicao {
  id: string;
  nome: string;
  logo_url: string;
  cor_primaria: string;
}

export interface Usuario {
  id: string;
  role: 'admin' | 'educador' | 'responsavel';
  nome: string;
  email: string;
  instituicao_id: string;
}

export interface Turma {
  id: string;
  nome_turma: string;
  instituicao_id: string;
  educador_id: string;
}

export interface Aluno {
  id: string;
  nome: string;
  data_nascimento: string;
  foto_url: string;
  turma_id: string | null;
  idade: string;
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

export const instituicao: Instituicao = {
  id: '1',
  nome: 'Creche Arco-Íris',
  logo_url: '/placeholder.svg',
  cor_primaria: '234 89% 74%',
};

export const usuarios: Usuario[] = [
  { id: '1', role: 'admin', nome: 'Carolina Silva', email: 'admin@creche.com', instituicao_id: '1' },
  { id: '2', role: 'educador', nome: 'Professora Ana', email: 'ana@creche.com', instituicao_id: '1' },
  { id: '3', role: 'responsavel', nome: 'Mariana Santos', email: 'mariana@email.com', instituicao_id: '1' },
];

export const turmas: Turma[] = [
  { id: '1', nome_turma: 'Berçário', instituicao_id: '1', educador_id: '2' },
  { id: '2', nome_turma: 'Maternal I', instituicao_id: '1', educador_id: '2' },
  { id: '3', nome_turma: 'Maternal II', instituicao_id: '1', educador_id: '2' },
];

export const alunos: Aluno[] = [
  { id: '1', nome: 'Joãozinho', data_nascimento: '2024-02-15', foto_url: '', turma_id: '1', idade: '2 anos' },
  { id: '2', nome: 'Maria', data_nascimento: '2024-08-20', foto_url: '', turma_id: '1', idade: '1a 6m' },
  { id: '3', nome: 'Pedro', data_nascimento: '2023-11-10', foto_url: '', turma_id: '2', idade: '2a 3m' },
  { id: '4', nome: 'Ana', data_nascimento: '2024-06-05', foto_url: '', turma_id: '2', idade: '1a 8m' },
  { id: '5', nome: 'Lucas', data_nascimento: '2024-01-12', foto_url: '', turma_id: '3', idade: '2a 1m' },
  { id: '6', nome: 'Sofia', data_nascimento: '2024-04-28', foto_url: '', turma_id: '3', idade: '1a 10m' },
];

export const registrosDiarios: RegistroDiario[] = [
  { id: '1', alunoId: '1', data: '2026-02-26', hora: '08:00', tipo: 'chegada', detalhes: 'Check-in realizado', cor: 'text-emerald-500', icone: 'DoorOpen' },
  { id: '2', alunoId: '1', data: '2026-02-26', hora: '09:30', tipo: 'alimentacao', detalhes: 'Lanche: Maçã raspada — Aceitou tudo', cor: 'text-blue-500', icone: 'Apple' },
  { id: '3', alunoId: '1', data: '2026-02-26', hora: '10:15', tipo: 'fralda', detalhes: 'Fralda trocada — Xixi', cor: 'text-slate-400', icone: 'Baby' },
  { id: '4', alunoId: '1', data: '2026-02-26', hora: '11:00', tipo: 'bemestar', detalhes: 'Humor: Feliz 😊', cor: 'text-yellow-500', icone: 'Smile' },
  { id: '5', alunoId: '1', data: '2026-02-26', hora: '12:00', tipo: 'alimentacao', detalhes: 'Almoço: Arroz, feijão e frango — Aceitou metade', cor: 'text-blue-500', icone: 'UtensilsCrossed' },
  { id: '6', alunoId: '1', data: '2026-02-26', hora: '13:00', tipo: 'sono', detalhes: 'Soneca: Dormiu por 1h20min', cor: 'text-purple-500', icone: 'Moon' },
  { id: '7', alunoId: '1', data: '2026-02-26', hora: '15:00', tipo: 'alimentacao', detalhes: 'Lanche da tarde: Suco e bolacha — Aceitou tudo', cor: 'text-blue-500', icone: 'Apple' },
];

export const notificacoes: Notificacao[] = [
  { id: '1', mensagem: '🔴 Joãozinho: Fralda G solicitada', tempo: 'Há 10 min', lida: false, tipo: 'urgente' },
  { id: '2', mensagem: '🟢 Turma Berçário: Novo cardápio da semana disponível', tempo: 'Há 2 horas', lida: false, tipo: 'info' },
  { id: '3', mensagem: '🟡 Maria: Pai a caminho', tempo: 'Há 30 min', lida: true, tipo: 'sucesso' },
  { id: '4', mensagem: '🔴 Pedro: Pomada para assaduras solicitada', tempo: 'Há 1 hora', lida: true, tipo: 'urgente' },
];

export const eventosCalendario: EventoCalendario[] = [
  { id: '1', titulo: 'Reunião de Pais', data: '2026-03-05', descricao: 'Reunião semestral com os responsáveis' },
  { id: '2', titulo: 'Festa do Dia das Mães', data: '2026-05-10', descricao: 'Apresentação dos alunos para as mães' },
  { id: '3', titulo: 'Semana da Criança', data: '2026-10-12', descricao: 'Atividades especiais durante a semana' },
  { id: '4', titulo: 'Encerramento do Ano', data: '2026-12-15', descricao: 'Festa de encerramento e formatura' },
];

export const medicamentos: Medicamento[] = [
  { id: '1', alunoId: '1', nome: 'Paracetamol Gotas', horario: '14:00', dosagem: '5 gotas', administrado: false },
  { id: '2', alunoId: '1', nome: 'Vitamina D', horario: '10:00', dosagem: '2 gotas', administrado: true },
];

export const fotosGaleria = [
  { id: '1', alunoId: '1', url: '/placeholder.svg', legenda: 'Pintura com as mãos', data: '2026-02-25', primeiraVez: false },
  { id: '2', alunoId: '1', url: '/placeholder.svg', legenda: 'Primeiro passo sozinho! 🎉', data: '2026-02-20', primeiraVez: true },
  { id: '3', alunoId: '1', url: '/placeholder.svg', legenda: 'Brincando no parquinho', data: '2026-02-24', primeiraVez: false },
  { id: '4', alunoId: '1', url: '/placeholder.svg', legenda: 'Primeira palavra: "mamãe"', data: '2026-02-18', primeiraVez: true },
];
