import { getDNSRecord } from './cloudflare.js';
import { getType } from './cloudflare.js';
import { getZone } from './cloudflare.js';

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

    const data = await getDNSRecord(context, zone.result.id, name, type);

    return new Response(JSON.stringify({
        status: "OK",
        faunta_secret: context.env.FAUNTA_SECRET,
        data: data,
    }), {
        headers: { 
            'content-type': 'application/json;charset=UTF-8',
            'X-ProcessTime': Date.now() - context.data.timestamp
        }
    });
}