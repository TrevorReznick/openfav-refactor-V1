import type { APIRoute } from 'astro';
import { supabase } from '../../../../providers/supabase';
import { createSuccessResponse, createErrorResponse, methodNotAllowed } from '../../../../utils/apiResponse';

// Gestisce le richieste GET per ottenere un elemento specifico
export const get: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return createErrorResponse('ID mancante', 400, 'MISSING_ID');
    }
    
    // Esempio di query a Supabase
    const { data, error } = await supabase
      .from('your_table') // Sostituisci con il nome della tua tabella
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return createErrorResponse(error, 404, 'NOT_FOUND');
    }

    return createSuccessResponse(data);
  } catch (error) {
    return createErrorResponse(error);
  }
};

// Gestisce le richieste POST per creare un nuovo elemento
export const post: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body) {
      return createErrorResponse('Il corpo della richiesta è vuoto', 400, 'EMPTY_BODY');
    }
    
    // Esempio di inserimento in Supabase
    const { data, error } = await supabase
      .from('your_table') // Sostituisci con il nome della tua tabella
      .insert([body])
      .select()
      .single();

    if (error) {
      return createErrorResponse(error, 400, 'INSERT_ERROR');
    }

    return createSuccessResponse(data, 201, 'Elemento creato con successo');
  } catch (error) {
    return createErrorResponse(error);
  }
};

// Gestisce le richieste PUT per aggiornare un elemento
export const put: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return createErrorResponse('ID mancante', 400, 'MISSING_ID');
    }
    
    if (!body) {
      return createErrorResponse('Il corpo della richiesta è vuoto', 400, 'EMPTY_BODY');
    }
    
    // Esempio di aggiornamento in Supabase
    const { data, error } = await supabase
      .from('your_table')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return createErrorResponse(error, 400, 'UPDATE_ERROR');
    }

    return createSuccessResponse(data, 200, 'Elemento aggiornato con successo');
  } catch (error) {
    return createErrorResponse(error);
  }
};

// Gestisce le richieste DELETE per eliminare un elemento
export const del: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return createErrorResponse('ID mancante', 400, 'MISSING_ID');
    }
    
    // Esempio di eliminazione in Supabase
    const { error } = await supabase
      .from('your_table')
      .delete()
      .eq('id', id);

    if (error) {
      return createErrorResponse(error, 400, 'DELETE_ERROR');
    }

    return createSuccessResponse({ id }, 200, 'Elemento eliminato con successo');
  } catch (error) {
    return createErrorResponse(error);
  }
};

// Gestisce i metodi non supportati
export const all: APIRoute = ({ request }) => {
  return methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE']);
};

// Aggiungi altri metodi HTTP se necessario (PUT, DELETE, ecc.)
