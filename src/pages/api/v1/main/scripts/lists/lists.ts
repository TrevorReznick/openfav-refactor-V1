import type { APIRoute } from 'astro';
import { supabase } from '@/providers/supabase';
import type {
  CreateListData,
  UpdateListData,
  AddItemData
} from '@/types'

// Helper per gestire le risposte API
const jsonResponse = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

// Ottieni tutte le liste dell'utente
export const GET: APIRoute = async ({ request }) => {
  try {
    const { data, error } = await supabase
      .from('lists_users')
      .select('*')
      .order('modified_at', { ascending: false });

    if (error) throw error;

    return jsonResponse({ data });
  } catch (error: any) {
    console.error('Error fetching lists:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};

// Crea una nuova lista
export const POST: APIRoute = async ({ request }) => {
  try {
    const body: CreateListData = await request.json();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    const newList = {
      ...body,
      id_user: user.id,
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('lists_users')
      .insert([newList])
      .select()
      .single();

    if (error) throw error;

    return jsonResponse({ data }, 201);
  } catch (error: any) {
    console.error('Error creating list:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};

// Aggiorna una lista
export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const updates: UpdateListData = await request.json();
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'List ID is required' }, 400);
    }

    const { data, error } = await supabase
      .from('lists_users')
      .update({
        ...updates,
        modified_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return jsonResponse({ data });
  } catch (error: any) {
    console.error('Error updating list:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};

// Elimina una lista
export const DELETE: APIRoute = async ({ request, params }) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return jsonResponse({ error: 'List ID is required' }, 400);
    }

    const { error } = await supabase
      .from('lists_users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('Error deleting list:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};

// API per gli elementi della lista
export const addItemToList: APIRoute = async ({ request }) => {
  try {
    const itemData: AddItemData = await request.json();

    const { data, error } = await supabase
      .from('lists_items')
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;

    return jsonResponse({ data }, 201);
  } catch (error: any) {
    console.error('Error adding item to list:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};

export const removeItemFromList: APIRoute = async ({ request }) => {
  try {
    const { itemId } = await request.json();

    if (!itemId) {
      return jsonResponse({ error: 'Item ID is required' }, 400);
    }

    const { error } = await supabase
      .from('lists_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;

    return jsonResponse({ success: true });
  } catch (error: any) {
    console.error('Error removing item from list:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};

export const getListItems: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const listId = url.searchParams.get('listId');

    if (!listId) {
      return jsonResponse({ error: 'List ID is required' }, 400);
    }

    const { data, error } = await supabase
      .from('lists_items')
      .select('*')
      .eq('id_list', listId);

    if (error) throw error;

    return jsonResponse({ data });
  } catch (error: any) {
    console.error('Error fetching list items:', error);
    return jsonResponse({ error: error.message }, 500);
  }
};
