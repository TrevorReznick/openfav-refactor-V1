import type { APIRoute } from 'astro';
import type { ApiError } from '../types/errors';
import { handleError } from '../types/errors';

type SuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
  message?: string;
};

type ErrorResponse = {
  success: false;
  error: string;
  timestamp: string;
  code?: string;
};

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export const createSuccessResponse = <T>(
  data: T,
  status = 200,
  message?: string
): Response => {
  const response: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  if (message) {
    response.message = message;
  }

  return new Response(JSON.stringify(response), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createErrorResponse = (
  error: unknown,
  status = 500,
  code?: string
): Response => {
  const handledError = handleError(error);
  
  // Se viene fornito un codice personalizzato, sovrascrivi quello dell'errore
  if (code) {
    handledError.code = code;
  }
  
  // Se viene fornito uno stato personalizzato, sovrascrivi quello dell'errore
  if (status) {
    handledError.status = status;
  }
  
  const response: ErrorResponse = {
    success: false,
    error: handledError.message,
    timestamp: new Date().toISOString(),
    code: handledError.code || 'UNKNOWN_ERROR',
  };

  return new Response(JSON.stringify(response), {
    status: handledError.status || status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Helper per gestire i metodi non supportati
export const methodNotAllowed = (methods: string[] = ['GET', 'POST']): Response => {
  return new Response(
    JSON.stringify({
      success: false,
      error: `Metodo non consentito. Usa uno dei seguenti: ${methods.join(', ')}`,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 405,
      headers: {
        'Allow': methods.join(', '),
        'Content-Type': 'application/json',
      },
    }
  );
};
