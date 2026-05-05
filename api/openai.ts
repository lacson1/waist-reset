/**
 * Vercel Serverless Function (Node): forwards POST JSON to OpenAI chat completions.
 * Deploy with Vercel (or adapt for Netlify). Browser calls same-origin `/api/openai/v1/...`
 * with `Authorization: Bearer <user_openai_key>` — the key is not stored on the server.
 *
 * @see README.md — OpenAI meal photo proxy
 */
export default async function handler(req: { method?: string; headers?: { authorization?: string }; body?: unknown }, res: { status: (n: number) => { send: (s: string) => void; json?: (o: unknown) => void } }) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  const auth = req.headers?.authorization
  if (!auth || typeof auth !== 'string') {
    res.status(401).send(JSON.stringify({ error: 'Missing Authorization header' }))
    return
  }
  const bodyStr =
    typeof req.body === 'string' ? req.body : req.body != null ? JSON.stringify(req.body) : '{}'
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth,
    },
    body: bodyStr,
  })
  const text = await r.text()
  res.status(r.status).send(text)
}
