const HOST = 'bjjgryfdebica.pl';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // One address for Google: www goes to the bare domain.
    if (url.hostname === `www.${HOST}`) {
      url.hostname = HOST;
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    if (url.hostname === HOST) return response;

    // workers.dev copies (production and test previews) stay out of search results.
    const copy = new Response(response.body, response);
    copy.headers.set('X-Robots-Tag', 'noindex');
    return copy;
  },
};
