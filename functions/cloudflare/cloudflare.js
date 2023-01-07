import { gatherResponse } from "../util.js";

const zoneBaseUrl = 'https://api.cloudflare.com/client/v4/zones',
    userBaseUrl = 'https://api.cloudflare.com/client/v4/user',
    validTypes = [
        'A',
        'AAAA',
    ];

function cloudflareError(title, errors = []) {
    let msg = `${title}\n`;

    for (let i = 0; i < errors.length; i++) {
        msg += ` - ${errors[i].code}: ${errors[i].message}\n`;
    }

    return new Error(msg);
}

export async function getUserDetails(context) {
    if (!context.env.TOKEN_USER_DETAILS_READ.length) {
        throw 'no valid token given';
    }
    
    const init = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + context.env.TOKEN_USER_DETAILS_READ
            },
        },
        response = await fetch(userBaseUrl, init),
        results = JSON.parse(await gatherResponse(response));

    if (results.success !== true) {
        throw cloudflareError('cannot get user details', results.errors);
    }

    return results;
}

export async function getZone(context, domain) {
    if (!context.env.TOKEN_ZONE_READ.length) {
        throw 'no valid token given';
    }

    const init = {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_READ
                }
            }

    let url = new URL(zoneBaseUrl);

    url.searchParams.append('match', 'all');
    url.searchParams.append('name', domain);
    url.searchParams.append('status', 'active');

    const response = await fetch(url.href, init);

    const results = JSON.parse(await gatherResponse(response));
    if (results.success !== true || results.result.length !== 1) {
        throw cloudflareError('cannot get zone information', results.errors);
    }

    // Only one record
    results.result = results.result[0];

    return results;
}

export async function getDNSRecord(context, zoneId, name, type) {
    if (!context.env.TOKEN_ZONE_READ.length) {
        throw 'no valid token given';
    }

    const init = {
            method: 'GET',
            headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_READ
                }
            }

    let url = new URL(zoneBaseUrl + '/' + zoneId + '/dns_records');

    url.searchParams.append('match', 'all');
    url.searchParams.append('name', name);
    url.searchParams.append('type', type);

    const response = await fetch(url.href, init);

    const results = JSON.parse(await gatherResponse(response));
    if (results.success !== true || results.result.length !== 1) {
        throw cloudflareError('cannot get dns record information', results.errors);
    }

    // Only one record
    results.result = results.result[0];

    return results;
}

export async function updateDNSRecord(context, zoneId, dnsRecordId) {
    if (!context.env.TOKEN_ZONE_WRITE.length) {
        throw 'no valid token given';
    }

    const init = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_WRITE
            },
            body: JSON.stringify({
                content: context.data.visitorIpAddress,
            }),
        };

    const response = await fetch(zoneBaseUrl + '/' + zoneId + '/dns_records/' + dnsRecordId, init);

    const results = JSON.parse(await gatherResponse(response));

    if (results.success !== true) {
        throw cloudflareError('cannot patch dns record information', results.errors);
    }

    return results.result;
}

export async function getType(uType) {
    if (typeof uType !== 'string') {
        throw cloudflareError('type is not a string');
    }

    uType = uType.toUpperCase();

    if (validTypes.indexOf(uType) === -1) {
        throw cloudflareError('not a valid type');
    }

    return uType;
}
