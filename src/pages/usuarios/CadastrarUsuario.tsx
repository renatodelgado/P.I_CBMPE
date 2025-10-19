import { useState } from "react";
import { UserIcon, TreeViewIcon, ShieldCheckIcon, CheckSquareIcon } from "@phosphor-icons/react";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  ContainerPainel,
  PageTopHeader,
  PageTitle,
  PageSubtitle,
  RequiredNotice,
  ResponsiveRow,
  GridColumn,
  BoxInfo,
  SectionTitle,
  Grid,
  Field,
  ToggleSwitch,
  ToggleRow,
} from "../../components/EstilosPainel.styles";
import { PerfilCard } from "../../components/NewUserPerfilCard/NewUserPerfilCards";
import { Button } from "../../components/Button";
import axios from "axios";

export function NovoUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [matricula, setMatricula] = useState("");
  const [perfil, setPerfil] = useState("Administrador");
  const [status, setStatus] = useState("Ativo");
  const [unidade, setUnidade] = useState("");
  const [superior, setSuperior] = useState("");
  const [turno, setTurno] = useState("");

  const onlyDigits = (v: string) => v.replace(/\D/g, "");

  const sanitizeEmail = (value: string) => {
    let v = value.trim().toLowerCase();
    v = v.replace(/\s+/g, "");
    v = v.replace(/[^a-z0-9@._+-]/g, "");
    const parts = v.split("@");
    if (parts.length > 2) v = parts.shift() + "@" + parts.join("");
    return v.slice(0, 254);
  };

  const formatCPF = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    let out = d;
    out = out.replace(/^(\d{3})(\d)/, "$1.$2");
    out = out.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    out = out.replace(/(\d{3})-(\d{1,2})$/, "$1-$2");
    out = out.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, "$1.$2.$3-$4");
    return out;
  };

  const formatPhone = (value: string) => {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 10) {
      return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return d.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  
  e.preventDefault();

  const perfilIdMap: Record<string, number> = {
    "Administrador": 1,
    "Gestor de Ocorrências": 2,
    "Analista Estatístico": 3,
    "Operador de Campo": 4,
  };

  const newUser = {
    nome,
    patente: "Soldado", 
    funcao: "Brigadista", 
    email,
    senha: "123456", 
    unidadeOperacional: { id: 1 }, 
    perfil: { id: perfilIdMap[perfil] || 1 }, 
  };

  try {
    const response = await axios.post("http://localhost:3333/users", newUser);
    console.log("✅ Usuário cadastrado com sucesso:", response.data);
    alert("Usuário cadastrado com sucesso!");
  } catch (error: any) {
    console.error("❌ Erro ao cadastrar usuário:", error);
    alert("Erro ao cadastrar usuário: " + (error.response?.data?.message || error.message));
  }
};
  

  return (
    <ContainerPainel>
      <PageTopHeader>
        <Breadcrumb
          items={[
            { label: "Usuários", onClick: () => console.log("Voltar à lista de usuários") },
            { label: "Cadastrar Usuário" },
          ]}
        />
        <PageTitle>Cadastrar novo usuário</PageTitle>
        <PageSubtitle>Preencha os dados do usuário e defina o tipo de perfil de acesso.</PageSubtitle>
        <RequiredNotice>
          <span>*</span>Campos obrigatórios
        </RequiredNotice>
      </PageTopHeader>

      <form onSubmit={handleSubmit}>
        <ResponsiveRow>
          <GridColumn weight={1}>
            {/* INFORMAÇÕES PESSOAIS */}
            <BoxInfo>
              <SectionTitle>
                <UserIcon size={22} weight="fill" />
                Informações Pessoais
              </SectionTitle>
              <Grid>
                <Field>
                  <label className="required">Nome completo</label>
                  <input
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <label className="required">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(formatCPF(e.target.value))}
                    maxLength={14}
                    
                  />
                </Field>

                <Field>
                  <label className="required">E-mail institucional</label>
                  <input
                    type="email"
                    placeholder="usuario@cbm.pe.gov.br"
                    value={email}
                    onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
                    
                  />
                </Field>

                <Field>
                  <label className="required">Telefone</label>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) => setTelefone(formatPhone(e.target.value))}
                    maxLength={15}
                    
                  />
                </Field>

                <Field>
                  <label className="required">Matrícula</label>
                  <input
                    type="text"
                    placeholder="Ex: 123456"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    
                  />
                </Field>

                <Field>
                  <label>Status do usuário</label>
                  <ToggleRow>
                    <ToggleSwitch
                      type="button"
                      active={status === "Ativo"}
                      onClick={() => setStatus((s) => (s === "Ativo" ? "Inativo" : "Ativo"))}
                      aria-pressed={status === "Ativo"}
                      aria-label="Alternar status do usuário"
                    />
                    <span>{status}</span>
                  </ToggleRow>
                </Field>
              </Grid>
            </BoxInfo>

            

            {/* PERMISSÕES E FUNÇÃO */}
            <BoxInfo>
              <SectionTitle>
                <ShieldCheckIcon size={22} weight="fill" />
                Permissões e Função
              </SectionTitle>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                <PerfilCard
                  titulo="Administrador"
                  descricao="Acesso total (gestão de usuários, logs, relatórios, dashboards)"
                  ativo={perfil === "Administrador"}
                  color="#dc2625"
                  onClick={() => setPerfil("Administrador")}
                />
                <PerfilCard
                  titulo="Gestor de Ocorrências"
                  descricao="Pode criar e editar ocorrências, gerar relatórios operacionais"
                  ativo={perfil === "Gestor de Ocorrências"}
                  color="#f97316"
                  onClick={() => setPerfil("Gestor de Ocorrências")}
                />
                <PerfilCard
                  titulo="Analista Estatístico"
                  descricao="Acesso a dashboards e exportações, sem poder de edição"
                  ativo={perfil === "Analista Estatístico"}
                  color="#2563eb"
                  onClick={() => setPerfil("Analista Estatístico")}
                />
                <PerfilCard
                  titulo="Operador de Campo"
                  descricao="Usado no app mobile; aqui apenas leitura no painel"
                  ativo={perfil === "Operador de Campo"}
                  color="#16a34a"
                  onClick={() => setPerfil("Operador de Campo")}
                />
              </div>
            </BoxInfo>

            {/* VINCULAÇÃO HIERÁRQUICA */}
            <BoxInfo>
              <SectionTitle>
                <TreeViewIcon size={22} weight="fill" />
                Vinculação Hierárquica (opcional)
              </SectionTitle>
              <Grid>
                <Field>
                  <label>Unidade / Grupamento</label>
                  <select value={unidade} onChange={(e) => setUnidade(e.target.value)}>
                    <option>Selecione a unidade</option>
                    <option>1º Grupamento</option>
                    <option>2º Grupamento</option>
                  </select>
                </Field>
                <Field>
                  <label>Superior Imediato</label>
                  <select value={superior} onChange={(e) => setSuperior(e.target.value)}>
                    <option>Selecione o superior</option>
                    <option>Tenente Silva</option>
                    <option>Capitão Oliveira</option>
                  </select>
                </Field>
                <Field>
                  <label>Turno de Atuação</label>
                  <select value={turno} onChange={(e) => setTurno(e.target.value)}>
                    <option>Selecione o turno</option>
                    <option>Manhã</option>
                    <option>Tarde</option>
                    <option>Noite</option>
                  </select>
                </Field>
              </Grid>
            </BoxInfo>

            {/* PERMISSÕES ESPECÍFICAS */}
            <BoxInfo>
              <SectionTitle>
                <CheckSquareIcon size={22} weight="fill" />
                Permissões Específicas
              </SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label>
                  <input type="checkbox" /> Visualizar relatórios estatísticos
                </label>
                <label>
                  <input type="checkbox" /> Gerenciar usuários
                </label>
                <label>
                  <input type="checkbox" /> Editar ocorrências
                </label>
                <label>
                  <input type="checkbox" /> Exportar dados (CSV/PDF)
                </label>
                <label>
                  <input type="checkbox" /> Acessar logs e auditorias
                </label>
              </div>
            </BoxInfo>

            {/* BOTÕES */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <Button
                text="Cancelar"
                type="button"
                variant="secondary"
                onClick={() => console.log("Cancelar")}
                style={{ padding: "8px 14px", borderRadius: 6 }}
              />
              <Button
                text="Salvar Usuário"
                type="submit"
                variant="danger"
                style={{ padding: "8px 14px", borderRadius: 6 }}
              />
            </div>
          </GridColumn>
        </ResponsiveRow>
      </form>
    </ContainerPainel>
  );
}