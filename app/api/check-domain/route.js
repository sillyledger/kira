export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const domain = searchParams.get('domain')

  if (!domain) {
    return Response.json({ error: 'Missing ?domain= parameter' }, { status: 400 })
  }

  const apiKey = process.env.WHOISJSON_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'WHOISJSON_API_KEY is not set' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `https://whoisjson.com/api/v1/whois?domain=${encodeURIComponent(domain)}`,
      {
        headers: { Authorization: `TOKEN=${apiKey}` },
        cache: 'no-store',
      }
    )

    const data = await res.json()

    return Response.json(
      {
        ok: res.ok,
        status: res.status,
        remaining: res.headers.get('Remaining-Requests'),
        data,
      },
      { status: res.ok ? 200 : res.status }
    )
  } catch (err) {
    return Response.json({ error: 'Lookup failed', detail: String(err) }, { status: 500 })
  }
}
