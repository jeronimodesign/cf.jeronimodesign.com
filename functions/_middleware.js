import { isValidIPAddress } from "../lib/ipaddress";

async function errorHandler(context) {
  try {
    const ipAddress = context.request.headers.get('CF-Connecting-IP');
    if (await isValidIPAddress(ipAddress)) {
      throw new Error('No valid ip address found');
    }

    context.data.timestamp = Date.now();
    context.data.visitorIpAddress = ipAddress;

    // wait for the next function to finish
    return await context.next();
  } catch (err) {
    // catch and report and errors when running the next function
    if (err.hasOwnProperty('message') && err.hasOwnProperty('stack')) {
      return new Response(`${err.message}\n${err.stack}`, { status: 500 });
    }

    return new Response(JSON.stringify(err), { status: 500 });
  }
}

export const onRequest = [errorHandler];
