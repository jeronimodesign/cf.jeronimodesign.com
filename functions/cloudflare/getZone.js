import { getZone } from './cloudflare.js';

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);

    const domain = searchParams.get('domain');
    if (!doamin) {
        throw 'no name parameter given';
    }

    const data = await getZone(context, domain);

    return new Response(JSON.stringify({
        status: "OK",
        data: data,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}