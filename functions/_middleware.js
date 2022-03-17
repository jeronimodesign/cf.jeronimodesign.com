
const errorHandler = async ({ next }) => {
  try {
    return await next();
  } catch (err) {
    return new Response(`${err.message}\n${err.stack}`, { status: 500 });
  }
};

const headerTest = async ({ next }) => {
  const response = await next();
  response.headers.set('X-Test', 'Header from functions Middleware!');
  return response;
};

export const onRequest = [errorHandler, headerTest];
