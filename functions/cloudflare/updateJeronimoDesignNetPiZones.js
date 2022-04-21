import { gatherResponse } from '../util.js';
import { getDNSRecordId } from './cloudflare.js';
import { getZoneId } from './cloudflare.js';

async function updateDNSRecord(context, zoneId, dnsRecordId) {
    if (!context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT.length) {
        throw 'no valid token given';
    }

    const data =  {
        'content': context.data.visitorIpAddress,
    };

    const init = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': 'Bearer ' + context.env.TOKEN_ZONE_JERONIMODESIGN_NET_EDIT
            },
            data: JSON.stringify(data),
        };

    const response = await fetch(zoneBaseUrl + '/' + zoneId + '/dns_records/' + dnsRecordId, init);

    const results = JSON.parse(await gatherResponse(response));

    return [init, response, results];

    if (results.success !== true) {
        throw 'cannot patch dns record information'
    }

    return results.result;
}

export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);

    const name = searchParams.get('name');
    if (!name) {
        throw 'no name parameter given';
    }

    const parts = name.split('.');
    let domain = name;
    if (parts.length > 2) {
        domain = domain.replace(/^[^.]+\./g, '');
    }

    const type = searchParams.get('type');
    if (!name) {
        throw 'no type parameter given';
    }

    const zoneId = await getZoneId(context, domain);

    let dnsRecordIds = [],
        data = [];

    const dnsRecordId = await getDNSRecordId(context, zoneId, name, type);

    dnsRecordIds.push(dnsRecordId);

    // data.push(await updateDNSRecord(context, zoneId, dnsRecordId));

    return new Response(JSON.stringify({
        status: "OK",
        zoneId: zoneId,
        dnsRecordIds: dnsRecordIds,
        data: data,
        name: searchParams.get('name'),
        domain: domain,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}