addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
  return new Response('... bikingperu.com ...\nAwesome!', {
    headers: { 'content-type': 'text/plain' },
  })
}
