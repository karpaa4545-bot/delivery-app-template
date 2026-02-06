import { NextResponse } from 'next/server';
import { getData, saveData } from '@/lib/db';

export async function GET() {
    const data = await getData();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const result = await saveData(body);

    if (result.success) {
        return NextResponse.json({ message: result.message });
    } else {
        return NextResponse.json({ message: result.message }, { status: 500 });
    }
}
