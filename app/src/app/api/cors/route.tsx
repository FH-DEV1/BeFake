import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
    const endpoint = req.nextUrl.searchParams.get('endpoint');
    if (!endpoint || typeof endpoint !== 'string') {
        return NextResponse.json({
            error: 'Endpoint parameter is required',
            success: false,
        }, { status: 400 });
    }
    const regexPattern = 'bereal\\.network';
    const regex = new RegExp(regexPattern);
    if (!regex.test(endpoint.toString())) {
        return NextResponse.json({
            error: 'Invalid URL',
            success: false,
        }, { status: 400 });
    }
    try {
        const filterProperties = (raw: { [x: string]: any; }, unallowed: string | string[]) => Object.keys(raw)
            .filter((key) => !unallowed.includes(key))
            .reduce((obj, key) => {
                obj[key] = raw[key];
                return obj;
            }, {} as { [x: string]: any; });
        const queryParams = Object.fromEntries(req.nextUrl.searchParams);
        const endpointReq = await axios({
            url: endpoint,
            responseType: 'arraybuffer',
            method: 'get',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            },
            params: filterProperties(queryParams, ['endpoint']),
        });
        const endpointRes = await endpointReq.data;
        return new Response(endpointRes, {
            status: 200,
            headers: { 'Content-Type': 'image/webp' },
        });
    } catch (err) {
        return NextResponse.json(
            {
                error: 'Unknown error',
                success: false,
            },
            { status: 500 }
        );
    }
}
