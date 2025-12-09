// Utilitários compartilhados para ocorrências
export interface DataHoraFormatada {
  data: string;
  hora: string;
  completa: string;
}

export const formatarDataHora = (dataHora: string): DataHoraFormatada | null => {
  try {
    const data = new Date(dataHora);
    if (isNaN(data.getTime())) return null;
    
    return {
      data: data.toLocaleDateString("pt-BR"),
      hora: data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      completa: data.toLocaleString("pt-BR")
    };
  } catch {
    return null;
  }
};

export const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "pendente":
    case "em_andamento":
    case "em andamento":
      return "#3B82F6";
    case "atendida":
    case "atendido":
      return "#10B981";
    case "não atendida":
    case "não_atendida":
    case "nao_atendido":
    case "não atendido":
      return "#F59E0B";
    default:
      return "#EF4444";
  }
};

export const getStatusTexto = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "pendente": return "Pendente";
    case "em_andamento": return "Em andamento";
    case "atendida": return "Atendida";
    case "nao_atendido": return "Não Atendida";
    default: return status;
  }
};

export const mapStatus = (s: string) => {
  switch (s) {
    case "Pendente":
      return "pendente";
    case "Em andamento":
      return "em_andamento";
    case "Atendida":
      return "atendida";
    case "Não Atendida":
      return "nao_atendida";
    default:
      return String(s).toLowerCase().replace(/\s+/g, "_");
  }
};