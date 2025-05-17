import type { APIRoute } from 'astro';
import { getLinksWithAssociations, createLinkWithAssociations } from '@/pages/api/v1/main/addLinksLists';
import type { CreateLinkRequest } from '@/types';

export const GET: APIRoute = async () => {
  const { data, error, status } = await getLinksWithAssociations();
  
  if (error) {
    return new Response(
      JSON.stringify({ error }),
      { status: status || 500 }
    );
  }

  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
  const linkData: CreateLinkRequest = await request.json();
  
  // Imposta i valori di default se non forniti
  const linkDataWithDefaults: CreateLinkRequest = {
    is_public: true,
    ...linkData,
    accessible: linkData.accessible ?? false,
    domain_exists: linkData.domain_exists ?? false,
    html_content_exists: linkData.html_content_exists ?? false,
    secure: linkData.secure ?? false,
    valid_url: linkData.valid_url ?? true,
    AI: linkData.AI ?? false
  };

  const { data, error, status } = await createLinkWithAssociations(linkDataWithDefaults);
  
  if (error) {
    return new Response(
      JSON.stringify({ error }),
      { status: status || 500 }
    );
  }

  return new Response(
    JSON.stringify({ 
      msg: 'Inserimento avvenuto con successo',
      data 
    }), 
    { status: 200 }
  );
};
