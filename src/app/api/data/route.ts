import { NextResponse } from 'next/server';
import { getData, saveData } from '@/lib/db';

export async function GET() {
    const data = await getData();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const success = await saveData(body);

    if (success) {
        return NextResponse.json({ message: 'Success' });
    } else {
        return NextResponse.json({ message: 'Error' }, { status: 500 });
    }
}
