const zoneBaseUrl = 'https://api.cloudflare.com/client/v4/zones';

export async function getZone(context, domain) {
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

    return results;
}

export async function getDNSRecord(context, zoneId, name, type) {
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
    url.searchParams.append('name', name);
    url.searchParams.append('type', type);

    const response = await fetch(url.href, init);

    const results = JSON.parse(await gatherResponse(response));
    if (results.success !== true) {
        throw 'cannot get dns record information'
    }

    if (results.result.length < 1) {
        return null;
    }

    return results;
}


export async function getZoneId(context, domain) {
    const zone = await getZone(context, domain);

    return zone.result[0].id;
}

export async function getDNSRecordId(context, zoneId, name, type) {
    const dnsRecord = await getDNSRecord(context, zoneId, name, type);

    return dnsRecord.result[0].id;
}
