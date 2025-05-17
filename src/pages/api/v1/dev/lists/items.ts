import type { APIRoute } from 'astro';
import { supabase } from '@/providers/supabase';
import type { AddItemData } from '@/types';

// Helper per gestire le risposte API
const jsonResponse = (data: any, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });

// Aggiungi un elemento a una lista
export const POST: APIRoute = async ({ request }) => {
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

// Rimuovi un elemento da una lista
export const DELETE: APIRoute = async ({ request }) => {
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

// Ottieni gli elementi di una lista
export const GET: APIRoute = async ({ request }) => {
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
