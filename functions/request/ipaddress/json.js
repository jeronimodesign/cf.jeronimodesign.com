export async function onRequest(context) {
    let data = {
        ipAddress: context.data.visitorIpAddress,
    };

    for (let key of context.request.headers.keys()) {
        data[key] = context.request.headers.get(key);
    }

    return new Response(JSON.stringify({
        status: "OK",
        data: data
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-Timestamp':context.data.timestamp,
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}
  