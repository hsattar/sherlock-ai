import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(req: Request) {

    const { OPEN_AI_API_KEY, SHERLOCK_ASSISTANT_ID } = process.env

    const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY })

    const data = await req.json()

    console.log(data)
		

    return NextResponse.json({ threadId: '456' })
}

export async function GET(req: Request) {
    return Response.json({ threadId: '456' })
}