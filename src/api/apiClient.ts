import { makeRequest } from '@/api/apiBuilder';
import type { ApiResponse, Link, Collection, UserList, CreateListData, UpdateListData, LinkFormData, CollectionFormData } from '@/types';

const API_ENDPOINT = 'api/v1/main';

/**
 * Funzione di utilità per inviare richieste API.
 * Gestisce la risposta e gli errori in modo centralizzato.
 */
export const sendApiRequest = async <T>(fetchFunc: () => Promise<ApiResponse<T>>): Promise<T> => {
    try {
        const response = await fetchFunc();
        if (response.data) {
            return response.data;
        }
        throw new Error(response.error || 'Errore nella risposta dell\'API');
    } catch (error) {
        console.error('Errore durante la richiesta API:', error);
        throw error;
    }
};

/**
 * Funzioni generiche per operazioni CRUD.
 */

// GET methods
export const fetchElements = <T>(type: string, params?: Record<string, any>): Promise<ApiResponse<T[]>> =>
    makeRequest<T[]>(API_ENDPOINT, { type: `get${capitalize(type)}`, ...params });

export const fetchElement = <T>(type: string, id: string | number): Promise<ApiResponse<T>> =>
    makeRequest<T>(API_ENDPOINT, { type: `get${capitalize(type)}`, id });

// POST methods
export const createElement = <T>(type: string, data: any): Promise<ApiResponse<T>> =>
    makeRequest<T>(API_ENDPOINT, { type: `create${capitalize(type)}`, ...data }, 'POST');

// PUT methods
export const updateElement = <T>(type: string, id: string | number, data: any): Promise<ApiResponse<T>> =>
    makeRequest<T>(API_ENDPOINT, { type: `update${capitalize(type)}`, id, ...data }, 'PUT');

// DELETE methods
export const deleteElement = (type: string, id: string | number): Promise<ApiResponse<void>> =>
    makeRequest<void>(API_ENDPOINT, { type: `delete${capitalize(type)}`, id }, 'DELETE');

/**
 * Helper per capitalizzare la prima lettera di una stringa.
 */
const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Helpers tipizzati per operazioni specifiche su liste, link e collezioni.
 */

export const lists = {
    getAll: (): Promise<ApiResponse<UserList[]>> => fetchElements<UserList>('lists'),
    getOne: (id: number): Promise<ApiResponse<UserList>> => fetchElement<UserList>('list', id),
    create: (data: CreateListData): Promise<ApiResponse<UserList>> => createElement<UserList>('list', data),
    update: (id: number, data: UpdateListData): Promise<ApiResponse<UserList>> =>
        updateElement<UserList>('list', id, data),
    delete: (id: number): Promise<ApiResponse<void>> => deleteElement('list', id),
};

export const links = {
    getAll: (): Promise<ApiResponse<Link[]>> => fetchElements<Link>('links'),
    getOne: (id: string): Promise<ApiResponse<Link>> => fetchElement<Link>('link', id),
    create: (data: LinkFormData): Promise<ApiResponse<Link>> => createElement<Link>('link', data),
    update: (id: string, data: Partial<LinkFormData>): Promise<ApiResponse<Link>> => updateElement<Link>('link', id, data),
    delete: (id: string): Promise<ApiResponse<void>> => deleteElement('link', id),
};

export const collections = {
    getAll: (): Promise<ApiResponse<Collection[]>> => fetchElements<Collection>('collections'),
    getOne: (id: string): Promise<ApiResponse<Collection>> => fetchElement<Collection>('collection', id),
    create: (data: CollectionFormData): Promise<ApiResponse<Collection>> =>
        createElement<Collection>('collection', data),
    update: (id: string, data: Partial<CollectionFormData>): Promise<ApiResponse<Collection>> =>
        updateElement<Collection>('collection', id, data),
    delete: (id: string): Promise<ApiResponse<void>> => deleteElement('collection', id),
};
