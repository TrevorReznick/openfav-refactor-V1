import { makeRequest } from '@/api/apiBuilder'
import type { ApiResponse, Link, Collection, UserList, ListItem, CreateListData, UpdateListData, LinkFormData, CollectionFormData } from '@/types';

const api_endpoint = 'api/v1/main/doQueries'

export const sendApiRequest = async <T>(fetchFunc: () => Promise<ApiResponse<T>>): Promise<T> => {
    try {
        const response = await fetchFunc();
        if (response.data) {
            return response.data;
        } else {
            throw new Error(response.error || "Errore nella risposta dell'API");
        }
    } catch (error) {
        throw error;
    }
};

/* @@ -- GET methods -- @@ */

export const fetchElements = <T>(type: string, params?: Record<string, any>): Promise<ApiResponse<T[]>> =>
    makeRequest<T[]>(api_endpoint, { type: `get${type.charAt(0).toUpperCase() + type.slice(1)}`, ...params });

export const fetchElement = <T>(type: string, id: string | number): Promise<ApiResponse<T>> =>
    makeRequest<T>(api_endpoint, { type: `get${type.charAt(0).toUpperCase() + type.slice(1)}`, id });

/* @@ -- POST methods -- @@ */

export const createElement = <T>(type: string, data: any): Promise<ApiResponse<T>> =>
    makeRequest<T>(api_endpoint, { type: `create${type.charAt(0).toUpperCase() + type.slice(1)}`, ...data }, 'POST');

/* @@ -- PUT methods -- @@ */

export const updateElement = <T>(type: string, id: string | number, data: any): Promise<ApiResponse<T>> =>
    makeRequest<T>(api_endpoint, { type: `update${type.charAt(0).toUpperCase() + type.slice(1)}`, id, ...data }, 'PUT');

/* @@ -- DELETE methods -- @@ */

export const deleteElement = (type: string, id: string | number): Promise<ApiResponse<void>> =>
    makeRequest<void>(api_endpoint, { type: `delete${type.charAt(0).toUpperCase() + type.slice(1)}`, id }, 'DELETE');

// Helpers tipizzati per operazioni comuni
export const lists = {
    getAll: () => fetchElements<UserList>('lists'),
    getOne: (id: number) => fetchElement<UserList>('lists', id),
    create: (data: CreateListData) => createElement<UserList>('lists', data),
    update: (id: number, data: UpdateListData) => updateElement<UserList>('lists', id, data),
    delete: (id: number) => deleteElement('lists', id)
};

export const links = {
    getAll: () => fetchElements<Link>('links'),
    getOne: (id: string) => fetchElement<Link>('links', id),
    create: (data: LinkFormData) => createElement<Link>('links', data),
    update: (id: string, data: Partial<LinkFormData>) => updateElement<Link>('links', id, data),
    delete: (id: string) => deleteElement('links', id)
};

export const collections = {
    getAll: () => fetchElements<Collection>('collections'),
    getOne: (id: string) => fetchElement<Collection>('collections', id),
    create: (data: CollectionFormData) => createElement<Collection>('collections', data),
    update: (id: string, data: Partial<CollectionFormData>) => updateElement<Collection>('collections', id, data),
    delete: (id: string) => deleteElement('collections', id)
};
