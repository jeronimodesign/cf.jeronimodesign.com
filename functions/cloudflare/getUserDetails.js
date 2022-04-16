export async function onRequest(context) {
    return new Response(JSON.stringify({
        status: "OK",
        data: {
            userDetails: 'Coming soon...'
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