
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Auditoria } from "./pages/auditoria/Auditoria";
import { ListaOcorrencias } from "./pages/ocorrencias/ListaOcorrencias";
import { Relatorios } from "./pages/Relatorios";
import { RelatorioRapido } from "./pages/relatorios/RelatorioRapido";
import { NovaOcorrencia } from "./pages/ocorrencias/CadastrarOcorrencia";
import { NovoUsuario } from "./pages/usuarios/CadastrarUsuario";
import { GestaoUsuarios } from "./pages/usuarios/GestaoUsuarios";
import { EditarUsuario } from "./pages/usuarios/EditarUsuario";
import { Header } from "./components/Header/Header";
import { PrivateRoute } from "./routes/PrivateRoutes";

function App() {
  const withHeader = (page: JSX.Element) => (
    <>
      <Header />
      {page}
    </>
  );

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>{withHeader(<Dashboard />)}</PrivateRoute>
            }
          />
          <Route
            path="/ocorrencias"
            element={
              <PrivateRoute>{withHeader(<ListaOcorrencias />)}</PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>{withHeader(<Relatorios />)}</PrivateRoute>
            }
          />
          <Route
            path="/relatorios/rapido"
            element={
              <PrivateRoute>{withHeader(<RelatorioRapido />)}</PrivateRoute>
            }
          />
          <Route
            path="/auditoria"
            element={
              <PrivateRoute>{withHeader(<Auditoria />)}</PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute>{withHeader(<GestaoUsuarios />)}</PrivateRoute>
            }
          />
          <Route
            path="/usuarios/cadastrar"
            element={
              <PrivateRoute>{withHeader(<NovoUsuario />)}</PrivateRoute>
            }
          />
          <Route
            path="/usuarios/editar"
            element={
              <PrivateRoute>{withHeader(<EditarUsuario />)}</PrivateRoute>
            }
          />
          <Route
            path="/ocorrencias/cadastrar"
            element={
              <PrivateRoute>{withHeader(<NovaOcorrencia />)}</PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
