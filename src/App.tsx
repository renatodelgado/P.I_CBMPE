import { Login } from "./pages/Login";
import { Auditoria } from "./pages/auditoria/Auditoria";
import { ListaOcorrencias } from "./pages/ocorrencias/ListaOcorrencias";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { NovaOcorrencia } from "./pages/ocorrencias/CadastrarOcorrencia";
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
        <Route path="/dashboard" element={<> <Header/> <DashboardOperacional/> </>}/>
        <Route path="/ocorrencias" element={<> <Header/> <ListaOcorrencias/> </>}/>
        <Route path="/auditoria" element={<> <Header/> <Auditoria/> </>}/>
        <Route path="/usuarios" element={<> <Header/> <GestaoUsuarios/> </>}/>
        <Route path="/usuarios/cadastrar" element={<> <Header/> <NovoUsuario/> </>}/>
        <Route path="/usuarios/editar" element={<> <Header/> <EditarUsuario/> </>}/>
        <Route path="/ocorrencias/cadastrar" element={<> <Header/> <NovaOcorrencia/></>}/>
        <Route path="/ocorrencias/nova" element={<> <Header/> <CadastrarOcorrencia/></>}/>
        <Route path="/ocorrencias/minhas" element={<> <Header/> <MinhasOcorrencias/> </>}/>
        <Route path="/perfil" element={<> <Header/> <PerfilPage/> </>}/>
        <Route path="/sobre" element={<> <Header/> <Sobre/> </>}/>
        </Routes>
     </BrowserRouter>
  );
}

export default App;