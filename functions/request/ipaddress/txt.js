export async function onRequest(context) {
    return new Response(context.data.visitorIpAddress, {
        headers: { 'content-type': 'text/plain' }
    });
}
  