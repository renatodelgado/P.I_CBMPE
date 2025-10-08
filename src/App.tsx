
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./pages/Login";
import {Dashboard} from "./pages/Dashboard";
import {Auditoria} from "./pages/Auditoria";
import {Usuarios} from "./pages/Usuarios";
import { Ocorrencias } from "./pages/pageListaOcorrencia/ListaOcorrencias";
import { Relatorios } from "./pages/Relatorios";
import{ BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";

function App() {
  return (
    <AuthProvider>
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/dashboard" element={<> <Header/> <Dashboard/> </>}/>
        <Route path="/ocorrencias" element={<> <Header/> <Ocorrencias/> </>}/>
        <Route path="/relatorios" element={<> <Header/> <Relatorios/> </>}/>
        <Route path="/Auditoria" element={<> <Header/> <Auditoria/> </>}/>
        <Route path="/Usuarios" element={<> <Header/> <Usuarios/> </>}/>
      </Routes>
        
     </BrowserRouter>
    
    </AuthProvider>
  );
}

export default App;



