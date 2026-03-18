export async function POST(request: Request) {
  const body = await request.json();
  console.log("[MIDDLEWARE DEBUG]", body); // visibile nei log Vercel/server
  return Response.json({ ok: true });
}
