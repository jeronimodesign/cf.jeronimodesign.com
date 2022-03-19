export async function onRequest(context) {
    return new Response(JSON.stringify({
        status: "OK"
    }), {
        headers: { 'content-type': 'application/json;charset=UTF-8' }
    });
}
