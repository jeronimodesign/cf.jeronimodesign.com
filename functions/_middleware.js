async function errorHandler(context) {
  try {
    context.data.timestamp = Date.now();

    // wait for the next function to finish
    return await context.next();
  } catch (err) {
    // catch and report and errors when running the next function
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
}

async function headerTest(context) {
  const response = await context.next();

  response.headers.set('X-Timestamp', context.data.timestamp);

  return response;

}

export const onRequest = [errorHandler, headerTest];
