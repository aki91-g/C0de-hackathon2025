import {NextResponse, NextRequest} from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ isbn: string }> }
) {
    const { isbn } = await params;
    console.log("Fetching book info for ISBN:", isbn);

    try {
        const response = await fetch(`${BACKEND_URL}/external/bookinfo/${isbn}`);

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch book info' }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}