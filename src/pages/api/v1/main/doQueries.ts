import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Metodi HTTP esportati per Astro
export const GET: APIRoute = async ({ url }) => {
  return await handleRequest('GET', url)
}

export const POST: APIRoute = async ({ request, url }) => {
  return await handleRequest('POST', url, request)
}

export const PUT: APIRoute = async ({ request, url }) => {
  return await handleRequest('PUT', url, request)
}

export const DEL: APIRoute = async ({ url }) => {
  return await handleRequest('DELETE', url)
}

const handleRequest = async (method: string, url: URL, request?: Request) => {
  console.log(`[${method}] Request received:`, url.searchParams.toString())

  const { type, ...params } = Object.fromEntries(url.searchParams)

  try {
    // Validazione ID per operazioni che lo richiedono
    if (['PUT', 'DELETE'].includes(method) && !params.id) {
      throw new Error('ID is required for update/delete operations')
    }

    const response = await handleApiRequest(method, type, params, request)

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error(`[${method}] Error:`, error)
    return new Response(
      JSON.stringify({
        error: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error),
        type,
        params,
        timestamp: new Date().toISOString()
      }),
      {
        status: typeof error === 'object' && error !== null && 'status' in error ? (error as { status?: number }).status || 500 : 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

const handleApiRequest = async (method: string, type: string, params: any, request?: Request) => {
  try {
    const data = request ? await request.json().catch(() => ({})) : {}

    switch (type) {
      /* Lists endpoints */
      case 'getLists':
        if (method !== 'GET') throw new Error('Invalid method for getLists')
        return await getLists()

      case 'getList':
        if (method !== 'GET') throw new Error('Invalid method for getList')
        if (!params.id) throw new Error('List ID is required')
        return await getList(params.id)

      case 'createList':
        if (method !== 'POST') throw new Error('Invalid method for createList')
        return await createList(data)

      case 'updateList':
        if (method !== 'PUT') throw new Error('Invalid method for updateList')
        return await updateList(data, params.id)

      case 'deleteList':
        if (method !== 'DELETE') throw new Error('Invalid method for deleteList')
        return await deleteList(params.id)

      /* Links endpoints */
      case 'getLinks':
        if (method !== 'GET') throw new Error('Invalid method for getLinks')
        return await getLinks()

      case 'getLink':
        if (method !== 'GET') throw new Error('Invalid method for getLink')
        if (!params.id) throw new Error('Link ID is required')
        return await getLink(params.id)

      case 'createLink':
        if (method !== 'POST') throw new Error('Invalid method for createLink')
        return await createLink(data)

      case 'updateLink':
        if (method !== 'PUT') throw new Error('Invalid method for updateLink')
        return await updateLink(data, params.id)

      case 'deleteLink':
        if (method !== 'DELETE') throw new Error('Invalid method for deleteLink')
        return await deleteLink(params.id)

      /* Collections endpoints */
      case 'getCollections':
        if (method !== 'GET') throw new Error('Invalid method for getCollections')
        return await getCollections()

      case 'getCollection':
        if (method !== 'GET') throw new Error('Invalid method for getCollection')
        if (!params.id) throw new Error('Collection ID is required')
        return await getCollection(params.id)

      case 'createCollection':
        if (method !== 'POST') throw new Error('Invalid method for createCollection')
        return await createCollection(data)

      case 'updateCollection':
        if (method !== 'PUT') throw new Error('Invalid method for updateCollection')
        return await updateCollection(data, params.id)

      case 'deleteCollection':
        if (method !== 'DELETE') throw new Error('Invalid method for deleteCollection')
        return await deleteCollection(params.id)

      default:
        throw { status: 404, message: `Unknown endpoint type: ${type}` }
    }
  } catch (error) {
    throw error
  }
}

/* Lists Methods */
async function getLists() {
  const { data, error } = await supabase
    .from('lists_users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return { data }
}

async function getList(id: string) {
  const { data, error } = await supabase
    .from('lists_users')
    .select('*, links(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return { data }
}

async function createList(data: any) {
  const { data: newList, error } = await supabase
    .from('lists_users')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return { data: newList }
}

async function updateList(data: any, id: string) {
  const { data: updatedList, error } = await supabase
    .from('lists_users')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return { data: updatedList }
}

async function deleteList(id: string) {
  const { error } = await supabase
    .from('lists_users')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/* Links Methods */
async function getLinks() {
  const { data, error } = await supabase
    .from('main_table')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw error
  return { data }
}

async function getLink(id: string) {
  const { data, error } = await supabase
    .from('main_table')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return { data }
}

async function createLink(data: any) {
  const { data: newLink, error } = await supabase
    .from('main_table')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return { data: newLink }
}

async function updateLink(data: any, id: string) {
  const { data: updatedLink, error } = await supabase
    .from('main_table')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return { data: updatedLink }
}

async function deleteLink(id: string) {
  const { error } = await supabase
    .from('main_table')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}

/* Collections Methods */
async function getCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return { data }
}

async function getCollection(id: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('*, lists(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return { data }
}

async function createCollection(data: any) {
  const { data: newCollection, error } = await supabase
    .from('collections')
    .insert([data])
    .select()
    .single()

  if (error) throw error
  return { data: newCollection }
}

async function updateCollection(data: any, id: string) {
  const { data: updatedCollection, error } = await supabase
    .from('collections')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return { data: updatedCollection }
}

async function deleteCollection(id: string) {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}
