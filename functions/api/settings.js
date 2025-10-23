export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Lấy dữ liệu cài đặt
  if (request.method === 'GET') {
    const settings = await env.SETTINGS_KV.get('site_settings', 'json') || {};
    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cập nhật cài đặt
  if (request.method === 'POST') {
    const password = url.searchParams.get('password');
    if (password !== env.ADMIN_PASSWORD) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    await env.SETTINGS_KV.put('site_settings', JSON.stringify(body));

    return new Response('OK');
  }

  return new Response('Method not allowed', { status: 405 });
}
