import { gatherResponse } from "../util.js";

export async function logDNSRecord(context, data) {
    if (!context.env.API_TOKEN_LOGGER.length) {
        throw 'no valid logger token given';
    }
    if (!context.env.LOGGER_ENDPOINT.length) {
        throw 'no valid logger endpoint given';
    }

    const init = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': 'Bearer ' + context.env.API_TOKEN_LOGGER
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(context.env.LOGGER_ENDPOINT, init);

    return response.status;

    const results = JSON.parse(await gatherResponse(response));

    // if (results.success !== true) {
    //     throw new Error('cannot log dns record information');
    // }

    return results;
}
