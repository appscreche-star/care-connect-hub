import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataProvider";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Turmas from "./pages/admin/Turmas";
import TurmaDetalhes from "./pages/admin/TurmaDetalhes";
import Alunos from "./pages/admin/Alunos";
import Educadores from "./pages/admin/Educadores";
import Saude from "./pages/admin/Saude";
import Configuracoes from "./pages/admin/Configuracoes";
import EducadorLayout from "./layouts/EducadorLayout";
import HomeTurma from "./pages/educador/HomeTurma";
import PerfilAluno from "./pages/educador/PerfilAluno";
import PaisLayout from "./layouts/PaisLayout";
import Hoje from "./pages/pais/Hoje";
import Galeria from "./pages/pais/Galeria";
import Mochila from "./pages/pais/Mochila";
import Calendario from "./pages/pais/Calendario";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="turmas" element={<Turmas />} />
                <Route path="turmas/:id" element={<TurmaDetalhes />} />
                <Route path="alunos" element={<Alunos />} />
                <Route path="educadores" element={<Educadores />} />
                <Route path="saude" element={<Saude />} />
                <Route path="configuracoes" element={<Configuracoes />} />
              </Route>
              <Route path="/educador" element={<EducadorLayout />}>
                <Route path="turma" element={<HomeTurma />} />
                <Route path="aluno/:id" element={<PerfilAluno />} />
              </Route>
              <Route path="/pais" element={<PaisLayout />}>
                <Route path="hoje" element={<Hoje />} />
                <Route path="galeria" element={<Galeria />} />
                <Route path="mochila" element={<Mochila />} />
                <Route path="calendario" element={<Calendario />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
