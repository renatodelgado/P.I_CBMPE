import React from "react";
import {
  ContainerPainel,
  PageTopHeaderRow,
  PageTitle,
  PageSubtitle,
  BoxInfo,
  SectionTitle,
} from "../components/EstilosPainel.styles";

import {
  BracketsAngle,
  Buildings,
  CellSignalFull,
  CloudCheck,
  Code,
  CompassTool,
  Database,
  DeviceMobile,
  GraduationCap,
  HardDrives,
  Laptop,
  UsersFour,
  MapPin,
  NotePencil,
  ListChecks,
} from "@phosphor-icons/react";

const itemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.4rem",
  fontSize: "0.95rem",
};

const sectionCard = {
  padding: "1rem 1.2rem",
  borderRadius: "0.6rem",
  background: "rgba(255, 255, 255, 0.65)",
  border: "1px solid #e6e6e6",
  marginTop: "1.2rem",
};

export function Sobre() {
  return (
    <ContainerPainel>
      <PageTopHeaderRow>
        <div>
          <PageTitle>Sobre o Sistema</PageTitle>
          <PageSubtitle>
            Conheça o propósito, a arquitetura e o time responsável pelo
            desenvolvimento da plataforma.
          </PageSubtitle>
        </div>
      </PageTopHeaderRow>

      {/* ========================== VISÃO GERAL ========================== */}
      <BoxInfo style={sectionCard}>
        <SectionTitle>
          <CompassTool size={22} /> Visão Geral
        </SectionTitle>
        <p>
          O sistema foi desenvolvido para o{" "}
          <strong>Corpo de Bombeiros Militar de Pernambuco (CBMPE)</strong>, com
          o objetivo de modernizar o fluxo de{" "}
          <strong>registro, gestão e acompanhamento de ocorrências</strong>.
        </p>
        <p>
          É composto por dois módulos que operam de forma integrada:
          <strong> Painel Web Administrativo</strong> e{" "}
          <strong>Aplicativo Mobile para Operadores em Campo</strong>,
          compartilhando o mesmo backend.
        </p>
      </BoxInfo>

      {/* ========================== PAINEL E MOBILE ========================== */}
      <BoxInfo style={sectionCard}>
        <SectionTitle>
          <Buildings size={22} /> Estrutura da Plataforma
        </SectionTitle>

        <div style={{ marginTop: "0.6rem" }}>
          <h4 style={{ marginBottom: "0.4rem", fontWeight: 600 }}>
            <Laptop size={20} /> Painel Web — Administrativo
          </h4>
          <p style={{ margin: "0 0 0.7rem" }}>
            Utilizado por equipes administrativas do CBMPE. Permite:
          </p>

          <div style={{ marginLeft: "0.4rem" }}>
            <div style={itemStyle}>
              <MapPin size={18} /> Cadastro de novas ocorrências
            </div>
            <div style={itemStyle}>
              <ListChecks size={18} /> Gestão e edição de registros
            </div>
            <div style={itemStyle}>
              <Code size={18} /> Dashboard com mapas e heatmaps
            </div>
            <div style={itemStyle}>
              <UsersFour size={18} /> Gestão de usuários e permissões
            </div>
          </div>
        </div>

        <hr style={{ margin: "1rem 0", border: "none", borderTop: "1px solid #e4e4e4" }} />

        <div>
          <h4 style={{ marginBottom: "0.4rem", fontWeight: 600 }}>
            <DeviceMobile size={20} /> Aplicativo Mobile — Operadores em Campo
          </h4>
          <p style={{ margin: "0 0 0.7rem" }}>
            Desenvolvido para equipes que atuam diretamente nas ocorrências.
          </p>

          <div style={{ marginLeft: "0.4rem" }}>
            <div style={itemStyle}>
              <NotePencil size={18} /> Cadastro e edição de ocorrências
            </div>
            <div style={itemStyle}>
              <CellSignalFull size={18} /> Funcionamento também{" "}
              <strong>offline</strong>
            </div>
            <div style={itemStyle}>
              <CloudCheck size={18} /> Sincronização automática ao ficar online
            </div>
          </div>
        </div>
      </BoxInfo>

      {/* ========================== EQUIPE ========================== */}
      <BoxInfo style={sectionCard}>
        <SectionTitle>
          <UsersFour size={22} /> Equipe Desenvolvedora
        </SectionTitle>
        <p>
          Projeto desenvolvido pelos estudantes do <strong>Grupo 1</strong> da
          turma <strong>43</strong> da Faculdade <strong>Senac Pernambuco</strong>, como{" "}
          <strong>Projeto Integrador do 3º período</strong>.
        </p>

        <div style={{ marginTop: "0.6rem", marginLeft: "0.4rem", lineHeight: "1.8" }}>
          • João Victor Rodrigues Basante
          <br />• João Vitor Malveira da Silva
          <br />• Maria Clara de Melo
          <br />• Renato Trancoso Branco Delgado
          <br />• Thayana Anália dos Santos Lira
          <br />• Vinicius Henrique Silva Nascimento
        </div>
      </BoxInfo>

      {/* ========================== PROFESSORES ========================== */}
      <BoxInfo style={sectionCard}>
        <SectionTitle>
          <GraduationCap size={22} /> Professores e Disciplinas
        </SectionTitle>

        <div style={{ lineHeight: "1.8", marginLeft: "0.4rem" }}>
          • <strong>Coding Mobile</strong> — Prof. Geraldo Júnior (orientador)
          <br />• <strong>User Experience</strong> — Prof. Marcos Tenório
          <br />• <strong>Backend e Arquitetura</strong> — Prof. Danilo Farias
          <br />• <strong>Comunicação Empresarial</strong> — Prof. Carol Luz
          <br />• <strong>Engenharia de Software</strong> — Prof. Sonia Gomes
          <br />• <strong>Data Science</strong> — Prof. Welton Dionísio
        </div>
      </BoxInfo>

      {/* ========================== TECNOLOGIAS ========================== */}
      <BoxInfo style={sectionCard}>
        <SectionTitle>
          <Code size={22} /> Tecnologias Utilizadas
        </SectionTitle>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.6rem" }}>
          <div style={itemStyle}>
            <Laptop size={18} /> React + TypeScript (Web)
          </div>
          <div style={itemStyle}>
            <DeviceMobile size={18} /> React Native + Expo (Mobile)
          </div>
          <div style={itemStyle}>
            <HardDrives size={18} /> Node.js + Express (Backend)
          </div>
          <div style={itemStyle}>
            <Database size={18} /> MySQL + TypeORM (Banco)
          </div>
          <div style={itemStyle}>
            <CloudCheck size={18} /> Vercel / Netlify (Deploy Web)
          </div>
          <div style={itemStyle}>
            <CellSignalFull size={18} /> Railway (API + Banco)
          </div>
          <div style={itemStyle}>
            <BracketsAngle size={18} /> Cloudinary (Uploads)
          </div>
        </div>
      </BoxInfo>

      {/* ========================== SUPORTE ========================== */}
      <BoxInfo style={sectionCard}>
        <SectionTitle>
          <HardDrives size={22} /> Suporte
        </SectionTitle>
        <p>
          Em caso de dúvidas ou sugestões de melhoria, consulte a documentação
          interna do projeto ou entre em contato com o time desenvolvedor.
        </p>
      </BoxInfo>
    </ContainerPainel>
  );
}

export default Sobre;
