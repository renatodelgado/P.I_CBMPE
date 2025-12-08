import { Login } from "./pages/Login";
import { Auditoria } from "./pages/auditoria/Auditoria";
import { ListaOcorrencias } from "./pages/ocorrencias/ListaOcorrencias";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import { Header } from "./components/Header/Header";
import { NovoUsuario } from "./pages/usuarios/CadastrarUsuario";
import { GestaoUsuarios } from "./pages/usuarios/GestaoUsuarios";
import { EditarUsuario } from "./pages/usuarios/EditarUsuario";
import { DashboardOperacional } from "./pages/dashboard/Dashboard";
import { CadastrarOcorrencia } from "./pages/ocorrencias/NovaOcorrencia";
import { MinhasOcorrencias } from "./pages/ocorrencias/MinhasOcorrencias";
import { PerfilPage } from "./pages/usuarios/Perfil";
import { Sobre } from "./pages/Sobre";


function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<RequireAuth><Header/><DashboardOperacional/></RequireAuth>} />
        <Route path="/ocorrencias" element={<RequireAuth><Header/><ListaOcorrencias/></RequireAuth>} />
        <Route path="/auditoria" element={<RequireAuth><Header/><Auditoria/></RequireAuth>} />
        <Route path="/usuarios" element={<RequireAuth><Header/><GestaoUsuarios/></RequireAuth>} />
        <Route path="/usuarios/cadastrar" element={<RequireAuth><Header/><NovoUsuario/></RequireAuth>} />
        <Route path="/usuarios/editar" element={<RequireAuth><Header/><EditarUsuario/></RequireAuth>} />
        <Route path="/ocorrencias/nova" element={<RequireAuth><Header/><CadastrarOcorrencia/></RequireAuth>} />
        <Route path="/ocorrencias/minhas" element={<RequireAuth><Header/><MinhasOcorrencias/></RequireAuth>} />
        <Route path="/perfil" element={<RequireAuth><Header/><PerfilPage/></RequireAuth>} />
        <Route path="/sobre" element={<RequireAuth><Header/><Sobre/></RequireAuth>} />
        </Routes>
     </BrowserRouter>
  );
}

export default App;