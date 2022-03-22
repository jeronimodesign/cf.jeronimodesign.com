export async function onRequest(context) {
    return new Response(context.data.visitorIpAddress, {
        headers: {
            'content-type': 'text/plain',
            'X-Timestamp':context.data.timestamp,
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}
  