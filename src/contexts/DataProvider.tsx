import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { useAuth, DEFAULT_INST } from './AuthContext';

export interface Turma {
    id: string;
    nome_turma: string;
    instituicao_id: string;
    periodo: 'Manhã' | 'Tarde' | 'Integral';
    professor_id?: string | null;
    ano_letivo?: string;
    capacidade_maxima?: number;
    faixa_etaria_min?: number;
    faixa_etaria_max?: number;
}

export interface Aluno {
    id: string;
    instituicao_id: string;
    turma_id: string | null;
    nome: string;
    data_nascimento: string;
    foto_url: string;
    alergias?: string;
    restricoes_alimentares?: string;
    medicamentos_uso_continuo?: string;
    tipo_sanguineo?: string;
    saude_observacoes?: string;
    idade?: string;
    responsaveis?: any[];
    autorizados?: any[];
}

export interface Perfil {
    id: string;
    instituicao_id: string;
    auth_user_id?: string;
    nome: string;
    email?: string;
    telefone?: string;
    cpf?: string;
    rg?: string;
    endereco?: string;
    data_nascimento?: string;
    foto_url?: string;
    role: 'Admin' | 'Coordenador' | 'Professor' | 'Responsavel';
    turno?: 'manha' | 'tarde' | 'integral';
    status?: 'ativo' | 'inativo';
    formacao_academica?: string;
    especialidades?: string[];
    contato_emergencia?: string;
    observacoes?: string;
}

export interface MedicamentoAgenda {
    id: string;
    aluno_id: string;
    instituicao_id: string;
    nome_medicamento: string;
    dosagem?: string;
    horarios: string[];
    instrucoes?: string;
    ativo: boolean;
}

export interface Ocorrencia {
    id: string;
    aluno_id: string;
    instituicao_id: string;
    professor_id?: string;
    titulo: string;
    descricao?: string;
    data_hora: string;
    notificado_pais: boolean;
}

export interface ControleVacina {
    id: string;
    aluno_id: string;
    vacina_nome: string;
    status: 'em_dia' | 'pendente' | 'atrasada';
    data_prevista?: string;
    data_aplicacao?: string;
}

export interface RegistroDiario {
    id: string;
    aluno_id: string;
    tipo_registro: string;
    detalhes: any;
    data_registro: string;
    hora_registro: string;
    created_at?: string;
}

export interface Notificacao {
    id: string;
    mensagem: string;
    created_at: string;
    lida: boolean;
    tipo: string;
}

interface DataContextType {
    turmas: Turma[];
    alunos: Aluno[];
    perfis: Perfil[];
    registros: RegistroDiario[];
    notificacoes: Notificacao[];
    medicamentos: MedicamentoAgenda[];
    ocorrencias: Ocorrencia[];
    vacinas: ControleVacina[];
    loading: boolean;
    refreshTurmas: () => Promise<void>;
    refreshAlunos: () => Promise<void>;
    refreshNotificacoes: () => Promise<void>;
    refreshPerfis: () => Promise<void>;
    refreshSaude: () => Promise<void>;
    addTurma: (turma: Partial<Turma>) => Promise<void>;
    deleteTurma: (id: string) => Promise<void>;
    updateTurma: (id: string, turma: Partial<Turma>) => Promise<void>;
    addAluno: (aluno: Omit<Aluno, 'id'>) => Promise<void>;
    updateAluno: (id: string, aluno: Partial<Aluno>) => Promise<void>;
    deleteAluno: (id: string) => Promise<void>;
    vincularAlunoTurma: (alunoId: string, turmaId: string | null) => Promise<void>;
    addPerfil: (perfil: Omit<Perfil, 'id'>) => Promise<void>;
    updatePerfil: (id: string, perfil: Partial<Perfil>) => Promise<void>;
    deletePerfil: (id: string) => Promise<void>;
    addRegistro: (registro: Omit<RegistroDiario, 'id' | 'data_registro' | 'hora_registro' | 'created_at'>) => Promise<void>;
    fetchRegistrosAluno: (alunoId: string) => Promise<void>;
    addMedicamento: (med: Omit<MedicamentoAgenda, 'id' | 'instituicao_id'>) => Promise<void>;
    addOcorrencia: (oc: Omit<Ocorrencia, 'id' | 'instituicao_id' | 'data_hora'>) => Promise<void>;
    toggleMedicamentoAtivo: (id: string, ativo: boolean) => Promise<void>;
    refreshVacinasAluno: (alunoId: string) => Promise<ControleVacina[]>;
    updateOcorrencia: (id: string, updates: Partial<Ocorrencia>) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used inside DataProvider');
    return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, instituicao } = useAuth();
    const [turmas, setTurmas] = useState<Turma[]>([]);
    const [alunos, setAlunos] = useState<Aluno[]>([]);
    const [perfis, setPerfis] = useState<Perfil[]>([]);
    const [registros, setRegistros] = useState<RegistroDiario[]>([]);
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [medicamentos, setMedicamentos] = useState<MedicamentoAgenda[]>([]);
    const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
    const [vacinas, setVacinas] = useState<ControleVacina[]>([]);
    const [loading, setLoading] = useState(true);

    const sanitizePayload = <T extends Record<string, any>>(payload: T): T => {
        const sanitized = { ...payload };
        Object.keys(sanitized).forEach(key => {
            if (sanitized[key] === '') {
                (sanitized as any)[key] = null;
            }
        });
        return sanitized;
    };

    const refreshTurmas = useCallback(async () => {
        if (!instituicao?.id) return;
        const { data, error } = await supabase
            .from('turmas')
            .select('*')
            .eq('instituicao_id', instituicao.id)
            .order('nome_turma');

        if (error) {
            console.error('Error fetching turmas:', error);
        } else {
            setTurmas(data || []);
        }
    }, [instituicao?.id]);

    const refreshAlunos = useCallback(async () => {
        if (!instituicao?.id || instituicao.id === DEFAULT_INST.id) return;
        const { data, error } = await supabase
            .from('alunos')
            .select('*')
            .eq('instituicao_id', instituicao.id)
            .order('nome');

        if (error) {
            console.error('Error fetching alunos:', error);
        } else {
            setAlunos(data || []);
        }
    }, [instituicao?.id]);

    const refreshNotificacoes = useCallback(async () => {
        if (!instituicao?.id || instituicao.id === DEFAULT_INST.id) return;
        const { data, error } = await supabase
            .from('notificacoes')
            .select('*')
            .eq('instituicao_id', instituicao.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notificacoes:', error);
        } else {
            setNotificacoes(data || []);
        }
    }, [instituicao?.id]);

    const refreshPerfis = useCallback(async () => {
        if (!instituicao?.id) return;
        const { data, error } = await supabase
            .from('perfis')
            .select('*')
            .eq('instituicao_id', instituicao.id)
            .order('nome');

        if (error) {
            console.error('Error fetching perfis:', error);
        } else {
            setPerfis(data || []);
        }
    }, [instituicao?.id]);

    const refreshSaude = useCallback(async () => {
        if (!instituicao?.id) return;

        const [medsRes, ocsRes] = await Promise.all([
            supabase.from('agenda_medicamentos').select('*').eq('instituicao_id', instituicao.id),
            supabase.from('ocorrencias').select('*').eq('instituicao_id', instituicao.id).order('data_hora', { ascending: false })
        ]);

        if (medsRes.error) console.error('Error fetching medicamentos:', medsRes.error);
        else setMedicamentos(medsRes.data || []);

        if (ocsRes.error) console.error('Error fetching ocorrencias:', ocsRes.error);
        else setOcorrencias(ocsRes.data || []);
    }, [instituicao?.id]);

    const addTurma = async (turma: Partial<Turma>) => {
        if (!instituicao?.id) return;
        const { error } = await supabase
            .from('turmas')
            .insert([{ ...turma, instituicao_id: instituicao.id }]);

        if (error) {
            toast({ title: '❌ Erro ao criar turma', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Turma criada com sucesso!' });
            refreshTurmas();
        }
    };

    const updateTurma = async (id: string, turma: Partial<Turma>) => {
        const { error } = await supabase.from('turmas').update(turma).eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao atualizar turma', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Turma atualizada!' });
            refreshTurmas();
        }
    };

    const deleteTurma = async (id: string) => {
        const { error } = await supabase.from('turmas').delete().eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao excluir turma', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Turma excluída!' });
            refreshTurmas();
        }
    };

    const addAluno = async (aluno: Omit<Aluno, 'id'>) => {
        if (!instituicao?.id) return;
        const sanitized = sanitizePayload(aluno);
        const { error } = await supabase
            .from('alunos')
            .insert([{ ...sanitized, instituicao_id: instituicao.id }]);

        if (error) {
            toast({ title: '❌ Erro ao cadastrar aluno', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Aluno cadastrado!' });
            refreshAlunos();
        }
    };

    const updateAluno = async (id: string, aluno: Partial<Aluno>) => {
        const sanitized = sanitizePayload(aluno);
        const { error } = await supabase.from('alunos').update(sanitized).eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao atualizar aluno', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Aluno atualizado!' });
            refreshAlunos();
        }
    };

    const deleteAluno = async (id: string) => {
        const { error } = await supabase.from('alunos').delete().eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao excluir aluno', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Aluno excluído!' });
            refreshAlunos();
        }
    };

    const vincularAlunoTurma = async (alunoId: string, turmaId: string | null) => {
        const { error } = await supabase.from('alunos').update({ turma_id: turmaId }).eq('id', alunoId);
        if (error) {
            toast({ title: '❌ Erro ao vincular aluno', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Vínculo atualizado!' });
            refreshAlunos();
        }
    };

    const addPerfil = async (perfil: Omit<Perfil, 'id'>) => {
        if (!instituicao?.id) return;
        const sanitized = sanitizePayload(perfil);
        const { error } = await supabase
            .from('perfis')
            .insert([{ ...sanitized, instituicao_id: instituicao.id }]);

        if (error) {
            toast({ title: '❌ Erro ao cadastrar perfil', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Perfil cadastrado!' });
            refreshPerfis();
        }
    };

    const updatePerfil = async (id: string, perfil: Partial<Perfil>) => {
        const sanitized = sanitizePayload(perfil);
        const { error } = await supabase.from('perfis').update(sanitized).eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao atualizar perfil', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Perfil atualizado!' });
            refreshPerfis();
        }
    };

    const deletePerfil = async (id: string) => {
        const { error } = await supabase.from('perfis').delete().eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao excluir perfil', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Perfil excluído!' });
            refreshPerfis();
        }
    };

    const addRegistro = async (registro: Omit<RegistroDiario, 'id' | 'data_registro' | 'hora_registro' | 'created_at'>) => {
        const { error } = await supabase.from('registros_diarios').insert([{
            ...registro,
            criado_por: user?.id
        }]);

        if (error) {
            toast({ title: '❌ Erro ao salvar registro', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Registro salvo!' });
        }
    };

    const fetchRegistrosAluno = async (alunoId: string) => {
        const { data, error } = await supabase
            .from('registros_diarios')
            .select('*')
            .eq('aluno_id', alunoId)
            .order('data_registro', { ascending: false })
            .order('hora_registro', { ascending: false });

        if (error) {
            console.error('Error fetching registros:', error);
        } else {
            setRegistros(data || []);
        }
    };

    const addMedicamento = async (med: Omit<MedicamentoAgenda, 'id' | 'instituicao_id'>) => {
        if (!instituicao?.id) return;
        const { error } = await supabase.from('agenda_medicamentos').insert([{ ...med, instituicao_id: instituicao.id }]);
        if (error) toast({ title: '❌ Erro ao agendar medicamento', description: error.message, variant: 'destructive' });
        else {
            toast({ title: '✅ Medicamento agendado!' });
            refreshSaude();
        }
    };

    const addOcorrencia = async (oc: Omit<Ocorrencia, 'id' | 'instituicao_id' | 'data_hora'>) => {
        if (!instituicao?.id) return;
        const { error } = await supabase.from('ocorrencias').insert([{ ...oc, instituicao_id: instituicao.id, professor_id: user?.id }]);
        if (error) {
            toast({ title: '❌ Erro ao registrar ocorrência', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Ocorrência registrada!' });
            refreshSaude();
        }
    };

    const updateOcorrencia = async (id: string, updates: Partial<Ocorrencia>) => {
        const { error } = await supabase.from('ocorrencias').update(updates).eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao atualizar ocorrência', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Status da ocorrência atualizado!' });
            refreshSaude();
        }
    };

    const toggleMedicamentoAtivo = async (id: string, ativo: boolean) => {
        const { error } = await supabase.from('agenda_medicamentos').update({ ativo }).eq('id', id);
        if (error) toast({ title: '❌ Erro ao atualizar status', description: error.message, variant: 'destructive' });
        else refreshSaude();
    };

    const refreshVacinasAluno = async (alunoId: string) => {
        const { data, error } = await supabase.from('controle_vacinas').select('*').eq('aluno_id', alunoId);
        if (error) {
            console.error('Error fetching vacinas:', error);
            return [];
        }
        return data || [];
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await refreshTurmas();
            await refreshNotificacoes();
            await refreshPerfis();
            await refreshAlunos();
            await refreshSaude();
            setLoading(false);
        };
        init();
    }, [refreshTurmas, refreshNotificacoes, refreshPerfis, refreshAlunos, refreshSaude]);

    return (
        <DataContext.Provider value={{
            turmas, alunos, perfis, registros, notificacoes, medicamentos, ocorrencias, vacinas, loading,
            refreshTurmas, refreshAlunos, refreshNotificacoes, refreshPerfis, refreshSaude,
            addTurma, deleteTurma, updateTurma, addAluno, updateAluno, deleteAluno,
            vincularAlunoTurma, addPerfil, updatePerfil, deletePerfil, addRegistro,
            fetchRegistrosAluno, addMedicamento, addOcorrencia, updateOcorrencia, toggleMedicamentoAtivo,
            refreshVacinasAluno
        }}>
            {children}
        </DataContext.Provider>
    );
};
// Sync marker for Lovable - 2026-03-01 01:13
