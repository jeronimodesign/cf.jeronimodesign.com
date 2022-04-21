import { getDNSRecordId } from './cloudflare.js';
import { getZoneId } from './cloudflare.js';
import { updateDNSRecord } from './cloudflare.js';

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

    const dnsRecordId = await getDNSRecordId(context, zoneId, name, type);

    const data = await updateDNSRecord(context, zoneId, dnsRecordId);

    return new Response(JSON.stringify({
        status: "OK",
        data: data,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}