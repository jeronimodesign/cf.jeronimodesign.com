export async function onRequest(context) {
    const url = 'https://api.cloudflare.com/client/v4/user',
        token = TOKEN_USER_DETAILS_READ;

    return new Response(JSON.stringify({
        status: "OK",
        data: {
            userDetails: 'Coming soon...',
            token: token.substr(-2, 2)
        }
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-Timestamp':context.data.timestamp,
            'X-ProcessTime': Date.now() - context.data.timestamp,
            'X-ApiKey': context.data.apikey
        }
    });
}