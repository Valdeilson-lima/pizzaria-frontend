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
