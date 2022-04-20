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

async function getZoneId(context) {
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

    url.searchParams.append('match', 'all');
    url.searchParams.append('name', domain);
    url.searchParams.append('status', 'active');

    const response = await fetch(url.href, init);

    const results = JSON.parse(await gatherResponse(response));
    if (results.success !== true || results.result.length < 1) {
        throw 'cannot get zone information'
    }

    return results.result[0].id;
}

async function getDNSRecordId(context, zoneId, name) {
    if (!context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT.length) {
        throw 'no valid token given';
    }

    const init = {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT
                }
            }

    let url = new URL(zoneBaseUrl + '/' + zoneId + '/dns_records');

    url.searchParams.append('match', 'all');
    url.searchParams.append('name', name + '.' + domain);
    url.searchParams.append('type', type);

    const response = await fetch(url.href, init);

    const results = JSON.parse(await gatherResponse(response));
    if (results.success !== true) {
        throw 'cannot get dns record information'
    }

    return results;

    // return results.dnsRecordIds.result[0].id; 
}

export async function onRequest(context) {
    if (!context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT.length) {
        throw 'no valid token given';
    }

    const records = [
        'pi',
        'pi3',
        'bitwarden',
    ];

    const zoneId = await getZoneId(context);

    let dnsRecordIds = [],
        data = [];

    for (let i = 0; i < records.length; i++) {
        dnsRecordIds.push(await getDNSRecordId(context, zoneId, records[i]));
    }


    
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
        zoneId: zoneId,
        dnsRecordIds: dnsRecordIds,
        data: data,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}