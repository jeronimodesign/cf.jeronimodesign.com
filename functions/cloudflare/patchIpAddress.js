import { getDNSRecord } from './cloudflare.js';
import { getZone } from './cloudflare.js';
import { getType } from './cloudflare.js';
import { updateDNSRecord } from './cloudflare.js';
import { logDNSRecord } from './logger.js';

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

    const type = await getType(searchParams.get('type'));

    const zone = await getZone(context, domain);

    const dnsRecord = await getDNSRecord(context, zone.result.id, name, type);

    const data = await updateDNSRecord(context, zone.result.id, dnsRecord.result.id);

    const logResult = await logDNSRecord(context, data);

    return new Response(JSON.stringify({
        status: "OK",
        data: data,
        log_result: logResult,
    }), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}