import { getUserDetails } from './cloudflare.js';
import { gatherResponse } from './../util.js';

export async function onRequest(context) {
    const userDetails = getUserDetails(context);

    if (!context.env.TOKEN_USER_DETAILS_READ.length) {
        throw 'no valid token given';
    }
    
    const url = 'https://api.cloudflare.com/client/v4/user',
        init = {
            headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + context.env.TOKEN_USER_DETAILS_READ
            },
        },
        response = await fetch(url, init),
        results = await gatherResponse(response);

    return new Response(JSON.stringify({
        status: "OK",
        data: JSON.parse(results),
        userDetails: userDetails,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}