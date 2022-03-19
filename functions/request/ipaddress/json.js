export async function onRequest(context) {
    return new Response(JSON.stringify({
        status: "OK",
        data: {
            ipAddress: context.data.visitorIpAddress
        }
    }), {
        headers: { 'content-type': 'application/json;charset=UTF-8' }
    });
}
  