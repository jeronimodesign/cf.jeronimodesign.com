import { getUserDetails } from './cloudflare.js';

export async function onRequest(context) {
    const userDetails = await getUserDetails(context);

    return new Response(JSON.stringify({
        status: "OK",
        data: userDetails,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}
