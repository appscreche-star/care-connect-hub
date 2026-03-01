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
    username?: string; // New field for custom login
    password?: string; // New field for custom login
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

export interface Evento {
    id: string;
    instituicao_id: string;
    titulo: string;
    descricao?: string;
    data: string;
    hora?: string;
    tipo: 'reuniao' | 'festa' | 'feriado' | 'outro';
    publico_alvo: 'todos' | 'pais' | 'professores';
    created_at?: string;
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
    eventos: Evento[];
    loading: boolean;
    refreshTurmas: () => Promise<void>;
    refreshAlunos: () => Promise<void>;
    refreshNotificacoes: () => Promise<void>;
    refreshPerfis: () => Promise<void>;
    refreshSaude: () => Promise<void>;
    refreshEventos: () => Promise<void>;
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
    addEvento: (evento: Omit<Evento, 'id' | 'instituicao_id' | 'created_at'>) => Promise<void>;
    updateEvento: (id: string, evento: Partial<Evento>) => Promise<void>;
    deleteEvento: (id: string) => Promise<void>;
    addRegistro: (registro: Omit<RegistroDiario, 'id' | 'data_registro' | 'hora_registro' | 'created_at'>) => Promise<void>;
    fetchRegistrosAluno: (alunoId: string) => Promise<void>;
    addMedicamento: (med: Omit<MedicamentoAgenda, 'id' | 'instituicao_id'>) => Promise<void>;
    addOcorrencia: (oc: Omit<Ocorrencia, 'id' | 'instituicao_id' | 'data_hora'>) => Promise<void>;
    toggleMedicamentoAtivo: (id: string, ativo: boolean) => Promise<void>;
    refreshVacinasAluno: (alunoId: string) => Promise<ControleVacina[]>;
    updateOcorrencia: (id: string, updates: Partial<Ocorrencia>) => Promise<void>;
    vincularResponsavelAluno: (perfilId: string, alunoId: string) => Promise<void>;
    selectedAlunoId: string | null;
    setSelectedAlunoId: (id: string | null) => void;
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
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [selectedAlunoId, setSelectedAlunoId] = useState<string | null>(null);
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
            if (data && data.length > 0) {
                // Use functional update to avoid dependency on selectedAlunoId if we just want to set it once
                setSelectedAlunoId(current => current || data[0].id);
            }
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

    const refreshEventos = useCallback(async () => {
        if (!instituicao?.id) return;
        const { data, error } = await supabase
            .from('eventos')
            .select('*')
            .eq('instituicao_id', instituicao.id)
            .order('data', { ascending: true });

        if (error) {
            console.error('Error fetching eventos:', error);
        } else {
            setEventos(data || []);
        }
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
        const { responsaveis, ...rest } = aluno;
        const sanitized = sanitizePayload(rest);

        const { data, error } = await supabase
            .from('alunos')
            .insert([{ ...sanitized, instituicao_id: instituicao.id }])
            .select()
            .single();

        if (error) {
            toast({ title: '❌ Erro ao cadastrar aluno', description: error.message, variant: 'destructive' });
        } else if (data) {
            // Se houver responsáveis com credenciais, cria os perfis
            if (responsaveis && responsaveis.length > 0) {
                for (const resp of responsaveis) {
                    if (resp.username && resp.password) {
                        try {
                            const { data: perfilData, error: pError } = await supabase
                                .from('perfis')
                                .insert([{
                                    nome: resp.nome,
                                    username: resp.username,
                                    password: resp.password,
                                    role: 'Responsavel',
                                    instituicao_id: instituicao.id
                                }])
                                .select()
                                .single();

                            if (!pError && perfilData) {
                                // Aqui poderíamos salvar o vínculo numa tabela de junção se existisse
                                // Por enquanto, vamos atualizar o array de responsáveis com o ID do perfil
                                resp.perfil_id = perfilData.id;
                            }
                        } catch (e) {
                            console.error('Erro ao criar perfil de responsável:', e);
                        }
                    }
                }
                // Atualiza o aluno com os IDs dos perfis no JSONB (se suportado)
                await supabase.from('alunos').update({ responsaveis }).eq('id', data.id);
            }

            toast({ title: '✅ Aluno cadastrado!' });
            refreshAlunos();
            refreshPerfis();
        }
    };

    const updateAluno = async (id: string, aluno: Partial<Aluno>) => {
        const { responsaveis, ...rest } = aluno;
        const sanitized = sanitizePayload(rest);

        // Se houver responsáveis novos com credenciais, cria os perfis
        if (responsaveis && responsaveis.length > 0 && instituicao?.id) {
            for (const resp of (responsaveis as any[])) {
                if (resp.username && resp.password && !resp.perfil_id) {
                    const { data: perfilData, error: pError } = await supabase
                        .from('perfis')
                        .insert([{
                            nome: resp.nome,
                            username: resp.username,
                            password: resp.password,
                            role: 'Responsavel',
                            instituicao_id: instituicao.id
                        }])
                        .select()
                        .single();

                    if (!pError && perfilData) {
                        resp.perfil_id = perfilData.id;
                    }
                }
            }
        }

        const { error } = await supabase.from('alunos').update({ ...sanitized, responsaveis }).eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao atualizar aluno', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Aluno atualizado!' });
            refreshAlunos();
            refreshPerfis();
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

    const vincularResponsavelAluno = async (perfilId: string, alunoId: string) => {
        const aluno = alunos.find(a => a.id === alunoId);
        const perfil = perfis.find(p => p.id === perfilId);

        if (!aluno || !perfil) return;

        const responsaveis = [...(aluno.responsaveis || [])];
        const jaVinculado = responsaveis.some(r => r.perfil_id === perfilId);

        if (jaVinculado) {
            toast({ title: 'ℹ️ Já vinculado', description: 'Este responsável já está vinculado ao aluno.' });
            return;
        }

        responsaveis.push({
            nome: perfil.nome,
            perfil_id: perfilId,
            parentesco: 'Responsável',
            financeiro: false
        });

        const { error } = await supabase.from('alunos').update({ responsaveis }).eq('id', alunoId);

        if (error) {
            toast({ title: '❌ Erro ao vincular', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Vínculo estabelecido!' });
            refreshAlunos();
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

    const addEvento = async (evento: Omit<Evento, 'id' | 'instituicao_id' | 'created_at'>) => {
        if (!instituicao?.id) return;
        const { error } = await supabase
            .from('eventos')
            .insert([{ ...evento, instituicao_id: instituicao.id }]);

        if (error) {
            toast({ title: '❌ Erro ao criar evento', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Evento criado com sucesso!' });
            refreshEventos();
        }
    };

    const updateEvento = async (id: string, evento: Partial<Evento>) => {
        const { error } = await supabase.from('eventos').update(evento).eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao atualizar evento', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Evento atualizado!' });
            refreshEventos();
        }
    };

    const deleteEvento = async (id: string) => {
        const { error } = await supabase.from('eventos').delete().eq('id', id);
        if (error) {
            toast({ title: '❌ Erro ao excluir evento', description: error.message, variant: 'destructive' });
        } else {
            toast({ title: '✅ Evento excluído!' });
            refreshEventos();
        }
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
            await refreshEventos();
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
            refreshVacinasAluno, selectedAlunoId, setSelectedAlunoId,
            vincularResponsavelAluno,
            eventos, refreshEventos, addEvento, updateEvento, deleteEvento
        }}>
            {children}
        </DataContext.Provider>
    );
};
// Sync marker for Lovable - 2026-03-01 01:13
