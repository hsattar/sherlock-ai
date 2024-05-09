import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(req: Request, res: any) {

    const { OPEN_AI_API_KEY } = process.env

    const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY })

    const body = await req.json()

    const runStatus = await openai.beta.threads.runs.retrieve(body.threadId, body.runId)

    if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(body.threadId)	
        const assistantResponse: any = messages.data[0].content[0]

        return NextResponse.json({ assistantResponse })
    } else {
        return res.status(200)
    }
}