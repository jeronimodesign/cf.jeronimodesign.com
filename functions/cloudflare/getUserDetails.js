// https://developers.cloudflare.com/workers/examples/fetch-json/
async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    } else if (contentType.includes('application/text')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else {
        return response.text();
    }
}
  

export async function onRequest(context) {
    if (!context.env.TOKEN_USER_DETAILS_READ.length) {
        throw 'no valid token given';
    }
    
    const url = 'https://api.cloudflare.com/client/v4/user',
        init = {
            headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + context.env.TOKEN_USER_DETAILS_READ
            },
        },
        response = await fetch(url, init),
        results = await gatherResponse(response);

    return new Response(JSON.stringify({
        status: "OK",
        data: JSON.parse(results)
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}