
import { atom } from 'nanostores';

// Import types from types directory
import type {
  UserList,
  ListItem,
  CreateListData,
  UpdateListData,
  AddItemData
} from '@/types';

// API base URL
const API_BASE_URL = '/api/v1/lists';

// Helper per le chiamate API
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return { data };
  } catch (error: any) {
    console.error('API request error:', error);
    return { error: error.message };
  }
}

// Store per le liste e gli elementi
export const userLists = atom<UserList[]>([]);
export const listItems = atom<ListItem[]>([]);
export const loading = atom(true);

// Actions
export async function fetchUserLists() {
  try {
    loading.set(true);
    const { data, error } = await apiRequest<{ data: UserList[] }>('/lists');
    
    if (error) throw new Error(error);
    
    userLists.set(data?.data || []);
    return { success: true, data: data?.data };
  } catch (error: any) {
    console.error('Error fetching user lists:', error);
    return { success: false, error: error.message };
  } finally {
    loading.set(false);
  }
}

export async function fetchListItems(listId: number) {
  try {
    loading.set(true);
    const { data, error } = await apiRequest<{ data: ListItem[] }>(`/lists/items?listId=${listId}`);
    
    if (error) throw new Error(error);
    
    listItems.set(data?.data || []);
    return { success: true, data: data?.data };
  } catch (error: any) {
    console.error('Error fetching list items:', error);
    return { success: false, error: error.message };
  } finally {
    loading.set(false);
  }
}

export async function createList(listData: CreateListData) {
  try {
    const { data, error } = await apiRequest<{ data: UserList }>('/lists', {
      method: 'POST',
      body: JSON.stringify(listData)
    });
    
    if (error) throw new Error(error);
    
    if (data?.data) {
      userLists.set([data.data, ...userLists.get()]);
    }
    
    return { 
      success: true, 
      data: data?.data 
    };
  } catch (error: any) {
    console.error('Error creating list:', error);
    return { success: false, error: error.message };
  }
}

export async function addItemToList(itemData: AddItemData) {
  try {
    const { data, error } = await apiRequest<{ data: ListItem }>('/lists/items', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
    
    if (error) throw new Error(error);
    
    if (data?.data) {
      listItems.set([data.data, ...listItems.get()]);
    }
    
    return { 
      success: true, 
      data: data?.data 
    };
  } catch (error: any) {
    console.error('Error adding item to list:', error);
    return { success: false, error: error.message };
  }
}

export async function removeItemFromList(itemId: number) {
  try {
    const { error } = await apiRequest(`/lists/items`, {
      method: 'DELETE',
      body: JSON.stringify({ itemId })
    });
    
    if (error) throw new Error(error);
    
    // Aggiorna lo store rimuovendo l'elemento
    listItems.set(listItems.get().filter(item => item.id !== itemId));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error removing item from list:', error);
    return { success: false, error: error.message };
  }
}

export async function updateList(listId: number, updates: UpdateListData) {
  try {
    const { data, error } = await apiRequest<{ data: UserList }>(`/lists?id=${listId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    
    if (error) throw new Error(error);
    
    if (data?.data) {
      // Aggiorna lo store con la lista modificata
      userLists.set(
        userLists.get().map(list => 
          list.id === listId ? { ...list, ...data.data } : list
        )
      );
    }
    
    return { 
      success: true, 
      data: data?.data 
    };
  } catch (error: any) {
    console.error('Error updating list:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteList(listId: number) {
  try {
    const { error } = await apiRequest(`/lists?id=${listId}`, {
      method: 'DELETE'
    });
    
    if (error) throw new Error(error);
    
    // Rimuovi la lista dallo store
    userLists.set(userLists.get().filter(list => list.id !== listId));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting list:', error);
    return { success: false, error: error.message };
  }
}
