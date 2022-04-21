async function errorHandler(context) {
  try {
    context.data.timestamp = Date.now();
    context.data.visitorIpAddress = context.request.headers.get('CF-Connecting-IP');

    // wait for the next function to finish
    return await context.next();
  } catch (err) {
    // catch and report and errors when running the next function
    return new Response(err.message, { status: 500 });
    // return new Response(JSON.stringify(err), { status: 500 });
  }
}

export const onRequest = [errorHandler];
