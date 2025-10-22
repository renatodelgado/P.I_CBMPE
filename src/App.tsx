
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import {Dashboard} from "./pages/Dashboard";
import {Auditoria} from "./pages/auditoria/Auditoria";
import { Ocorrencias } from "./pages/pageListaOcorrencia/ListaOcorrencias";
import { Relatorios } from "./pages/Relatorios";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { NovaOcorrencia } from "./pages/ocorrencias/CadastrarOcorrencia";
import { NovoUsuario } from "./pages/usuarios/CadastrarUsuario";
import { GestaoUsuarios } from "./pages/usuarios/GestaoUsuarios";
import { EditarUsuario } from "./pages/usuarios/EditarUsuario";
import { RelatorioRapido } from "./pages/relatorios/RelatorioRapido";


function App() {
  return (
    <AuthProvider>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<> <Header/> <Dashboard/> </>}/>
        <Route path="/listaocorrencias" element={<> <Header/> <Ocorrencias/> </>}/>
        <Route path="/relatorios" element={<> <Header/> <Relatorios/> </>}/>
        <Route path="/relatorios/rapido" element={<> <Header/> <RelatorioRapido/> </>}/>
        <Route path="/auditoria" element={<> <Header/> <Auditoria/> </>}/>
        <Route path="/usuarios" element={<> <Header/> <GestaoUsuarios/> </>}/>
        <Route path="/usuarios/cadastrar" element={<> <Header/> <NovoUsuario/> </>}/>
        <Route path="/usuarios/editar" element={<> <Header/> <EditarUsuario/> </>}/>
        <Route path="/ocorrencias/cadastrar" element={<> <Header/> <NovaOcorrencia/></>}/>
        </Routes>
        
     </BrowserRouter>
    
    </AuthProvider>
  );
}

export default App;



