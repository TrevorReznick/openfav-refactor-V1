// Estende l'interfaccia Error standard per includere proprietà aggiuntive
export interface ApiError extends Error {
  code?: string;
  details?: any;
  hint?: string;
  status?: number;
}

// Funzione helper per creare un errore API
export function createApiError(message: string, code?: string, status?: number): ApiError {
  const error = new Error(message) as ApiError;
  if (code) error.code = code;
  if (status) error.status = status;
  return error;
}

// Verifica se un valore è un errore API
export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && 'code' in error;
}

// Gestisce gli errori sconosciuti e li converte in un formato standard
export function handleError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }
  
  if (error instanceof Error) {
    return createApiError(error.message, 'UNKNOWN_ERROR', 500);
  }
  
  return createApiError('Si è verificato un errore sconosciuto', 'UNKNOWN_ERROR', 500);
}
