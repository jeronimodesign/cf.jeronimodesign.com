async function getApiKey(context) {
    try {
        // todo
  
        // wait for the next function to finish
        return await context.next();
    } catch (err) {
        // catch and report and errors when running the next function
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}
  
export const onRequest = [getApiKey];