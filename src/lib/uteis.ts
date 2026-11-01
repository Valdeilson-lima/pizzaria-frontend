/**
 * Utilitários para formatação e manipulação de dados
 */

interface FormatDateOptions {
  includeTime?: boolean;
}

/**
 * Formata uma data para o padrão brasileiro (pt-BR).
 * Exemplo sem hora: "26/10/2026"
 * Exemplo com hora: "26/10/2026 às 23:07"
 *
 * @param date Data em string ISO, objeto Date ou timestamp em número
 * @param options Opções adicionais de formatação (ex: includeTime)
 * @returns Data formatada em string ou vazia se inválida
 */
export function formatarData(
  date: string | Date | number | null | undefined,
  options?: FormatDateOptions
): string {
  if (!date) return "";

  const parsedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return "";
  }

  if (options?.includeTime) {
    const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parsedDate);

    const horaFormatada = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate);

    return `${dataFormatada} às ${horaFormatada}`;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate);
}

/**
 * Formata data e hora para o padrão brasileiro (pt-BR).
 * Exemplo: "26/10/2026 às 23:07"
 */
export function formatarDataHora(
  date: string | Date | number | null | undefined
): string {
  return formatarData(date, { includeTime: true });
}

// Aliases em inglês por conveniência
export const formatDate = formatarData;
export const formatDateTime = formatarDataHora;

/**
 * Retorna o tempo decorrido amigável em português (ex: "agora", "há 4 min", "há 1h 15m").
 */
export function tempoDecorrido(
  date: string | Date | number | null | undefined
): string {
  if (!date) return "";
  const parsedDate = date instanceof Date ? date : new Date(date);
  if (isNaN(parsedDate.getTime())) return "";

  const diffMs = Date.now() - parsedDate.getTime();
  if (diffMs < 0) return "agora";

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "agora";
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    return remainingMinutes > 0
      ? `há ${diffHours}h ${remainingMinutes}m`
      : `há ${diffHours}h`;
  }
  return `há ${diffDays}d`;
}

/**
 * Formata um valor em centavos vindo do banco de dados para o padrão monetário brasileiro (BRL - R$).
 * Exemplo: 4500 centavos -> "R$ 45,00"
 */
export function formatarPreco(
  valorEmCentavos: number | string | null | undefined
): string {
  if (
    valorEmCentavos === null ||
    valorEmCentavos === undefined ||
    valorEmCentavos === ""
  ) {
    return "R$ 0,00";
  }

  const centavos =
    typeof valorEmCentavos === "string"
      ? parseInt(valorEmCentavos.replace(/\D/g, ""), 10)
      : valorEmCentavos;

  if (isNaN(centavos)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);
}

/**
 * Formata automaticamente a digitação de moeda em tempo real e extrai os centavos inteiros.
 * Exemplo:
 * Digita "4"    -> display: "R$ 0,04", centavos: 4
 * Digita "45"   -> display: "R$ 0,45", centavos: 45
 * Digita "4500" -> display: "R$ 45,00", centavos: 4500
 */
export function formatarInputMoeda(value: string): {
  display: string;
  centavos: number;
} {
  const digitsOnly = value.replace(/\D/g, "");
  if (!digitsOnly) {
    return { display: "", centavos: 0 };
  }

  const centavos = parseInt(digitsOnly, 10);
  const display = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);

  return { display, centavos };
}
