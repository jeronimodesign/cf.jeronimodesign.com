const zoneBaseUrl = 'https://api.cloudflare.com/client/v4/zones',
    domain = 'jeronimodesign.net',
    type = 'A';

async function gatherResponse(response) {
    const { headers } = response;
    const contentType = headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json());
    } else if (contentType.includes('application/text')) {
        return response.text();
    } else if (contentType.includes('text/html')) {
        return response.text();
    } else {
        return response.text();
    }
}

async function getZoneInfo(context) {
    if (!context.env.TOKEN_ZONE_ZONE_JERONIMODESIGN_NET_READ.length) {
        throw 'no valid token given';
    }

    const init = {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_ZONE_JERONIMODESIGN_NET_READ
                }
            }

    let url = new URL(zoneBaseUrl);

    url.searchParams.append('type', type);
    url.searchParams.append('name', domain);
    url.searchParams.append('status', 'active');
    url.searchParams.append('match', 'any');

    const response = await fetch(url.href, init);

    return await gatherResponse(response);
}

export async function onRequest(context) {
    if (!context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT.length) {
        throw 'no valid token given';
    }

    const results = await getZoneInfo(context);
    
    // const url = 'https://api.cloudflare.com/client/v4/zones',
    //     init = {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT
    //         },
    //         body: {
    //             type: 'A',
    //             conntent: context.data.visitorIpAddress,
    //         }
    //     },
    //     response = await fetch(url, init),
    //     results = await gatherResponse(response);

    return new Response(JSON.stringify({
        status: "OK",
        data: JSON.parse(results)
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}