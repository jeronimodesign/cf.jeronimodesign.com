async function authenticate(context) {
    try {
        // Authentication
        const authHeader = context.request.headers.get('Authorization');

        if (
            (typeof authHeader === 'string') 
            && authHeader.startsWith("Bearer ") 
            && (authHeader.substring(7, authHeader.length) === context.env.API_TOKEN)
        ) {
            // wait for the next function to finish
            return await context.next();
        }

        throw new Error('Unauthorized');  
    } catch (err) {
        // catch and report and errors when running the next function
        return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }
}
  
export const onRequest = [authenticate];