
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import {Dashboard} from "./pages/Dashboard";
import {Auditoria} from "./pages/Auditoria";
import { Ocorrencias } from "./pages/pageListaOcorrencia/ListaOcorrencias";
import { Relatorios } from "./pages/Relatorios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { NovaOcorrencia } from "./pages/pageNovaOcorrencia/CadastrarOcorrencia";
import { NovoUsuario } from "./pages/usuarios/CadastrarUsuario";
import { ListarUsuarios } from "./pages/usuarios/ListarUsuarios";

function App() {
  return (
    <AuthProvider>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<> <Header/> <Dashboard/> </>}/>
        <Route path="/ocorrencias" element={<> <Header/> <Ocorrencias/> </>}/>
        <Route path="/relatorios" element={<> <Header/> <Relatorios/> </>}/>
        <Route path="/auditoria" element={<> <Header/> <Auditoria/> </>}/>
        <Route path="/usuarios" element={<> <Header/> <ListarUsuarios/> </>}/>
        <Route path="/usuarios/cadastrar" element={<> <Header/> <NovoUsuario/> </>}/>
        <Route path="/ocorrencias/cadastrar" element={<> <Header/> <NovaOcorrencia/></>}/>
        </Routes>
        
     </BrowserRouter>
    
    </AuthProvider>
  );
}

export default App;



