import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(req: Request) {

    const { OPEN_AI_API_KEY, SHERLOCK_ASSISTANT_ID } = process.env

    const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY })

    const body = await req.json()

    let threadId = ''

    if (!body?.threadID) {
        const thread = await openai.beta.threads.create()
        threadId = thread.id
    }

    if (body?.threadId) {
        threadId = body.threadId	
    }

    const message = await openai.beta.threads.messages.create(threadId, body.message)

    const run = await openai.beta.threads.runs.create(threadId, { assistant_id: SHERLOCK_ASSISTANT_ID! })

    return NextResponse.json({ threadId, runId: run.id })
}