import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Input,
  Button,
  Wrapper,
  Background,
  LogoLogin,
  Header,
  ContainerContent,
  Label,
  RememberMe,
  Checkbox,
  InputWrapper,
  InputIcon,
  DivLogin,
  ForgotPassword,
  RememberMeForgotPassword,
} from "./Login.styles";
import logoImg from "../assets/logo.svg";
import userIcon from "../assets/clipboard.svg";
import lockIcon from "../assets/lock.svg";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/api";

export function Login() {
  const auth = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!auth) return null;

 const handleLogin = async () => {
    if (!auth) return;

    if (!username.trim() || !password) {
      alert("Preencha matrícula e senha");
      return;
    }

    try {
      setLoading(true);
      const response = await apiLogin(username.trim(), password);

      const token = response?.token || response?.accessToken || response?.data?.token;
      const usuario = response?.usuario || response?.user || response?.data?.usuario || response?.data || response;

      if (!token || !usuario) {
        alert("Falha no login: resposta inválida do servidor");
        return;
      }

      auth.login(token, usuario, remember);
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Erro no login:", err);

      const getErrorMessage = (error: unknown): string => {
        // axios style error: error.response?.data?.message
        if (
          error &&
          typeof error === "object" &&
          "response" in error &&
          (error).response &&
          typeof (error).response === "object" &&
          "data" in (error).response &&
          (error).response.data &&
          typeof (error).response.data === "object" &&
          "message" in (error).response.data &&
          typeof ((error).response.data).message === "string"
        ) {
          return ((error).response.data).message;
        }

        // generic Error object
        if (error && typeof error === "object" && "message" in error && typeof (error).message === "string") {
          return (error).message;
        }

        // fallback
        return "Erro ao conectar ao servidor. Verifique sua internet.";
      };

      const msg = getErrorMessage(err);
      alert("Erro no login: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <DivLogin>
        <Wrapper>
          <LogoLogin src={logoImg} alt="Logo" />
          <Header>
            <h1>Chama</h1>
            <h2>Sistema de Gestão de Ocorrências CBMPE</h2>
          </Header>

            <ContainerContent>
              <Label>Matrícula</Label>
              <InputWrapper>
                <InputIcon src={userIcon} alt="Ícone de usuário" />
                <Input
                  type="text"
                  placeholder="Digite sua matrícula"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputWrapper>

              <Label>Senha</Label>
              <InputWrapper>
                <InputIcon src={lockIcon} alt="Ícone de cadeado" />
                <Input
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputWrapper>
            </ContainerContent>

            <RememberMeForgotPassword>
              <RememberMe onClick={() => setRemember(!remember)} style={{ cursor: "pointer" }}>
                <Checkbox />
                <p style={{ marginLeft: 8 }}>{remember ? "Lembrar de mim" : "Não lembrar"}</p>
              </RememberMe>
              <ForgotPassword>
                <p style={{ marginLeft: "auto" }}>
                  <a href="#">Esqueci minha senha</a>
                </p>
              </ForgotPassword>
            </RememberMeForgotPassword>

            <Button onClick={handleLogin}>
              {loading ? "Aguarde..." : "Entrar"}
            </Button>
         </Wrapper>
       </DivLogin>
     </Background>
   );
 }