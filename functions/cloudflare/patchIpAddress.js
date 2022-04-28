import { getDNSRecord } from './cloudflare.js';
import { getZone } from './cloudflare.js';
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
    if (!type) {
        throw 'no type parameter given';
    }

    const zone = await getZone(context, domain);

    const dnsRecord = await getDNSRecord(context, zone.result.id, name, type);

    const data = await updateDNSRecord(context, zone.result.id, dnsRecord.result.id);

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