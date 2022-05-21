export async function onRequest(context) {
    return new Response(JSON.stringify({
        status: "OK",
        data: {
            ipAddress: context.data.visitorIpAddress,
            headers: context.request.headers
        }
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-Timestamp':context.data.timestamp,
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}
  