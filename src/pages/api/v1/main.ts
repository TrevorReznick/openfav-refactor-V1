import type { APIRoute } from 'astro'
import { handleRequest } from './main/doQueries'

export const get: APIRoute = async ({ url }) => {
  return await handleRequest('GET', url)
}

export const post: APIRoute = async ({ request, url }) => {
  return await handleRequest('POST', url, request)
}

export const put: APIRoute = async ({ request, url }) => {
  return await handleRequest('PUT', url, request)
}

export const del: APIRoute = async ({ url }) => {  
  return await handleRequest('DELETE', url)
}
