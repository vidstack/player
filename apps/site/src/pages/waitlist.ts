import { db } from '@vercel/postgres';
import type { APIRoute } from 'astro';

export const prerender = false;

if (import.meta.env.DEV) {
  process.env.POSTGRES_URL = import.meta.env.POSTGRES_URL;
}

export const post: APIRoute = async ({ request }) => {
  const isAPIRequest = request.headers.get('Content-Type') === 'application/json';

  if (isAPIRequest) {
    const body = await request.json(),
      values = [body.email, body.products, body.stream, body.uploads];

    // Simple check if any fields are empty.
    if (values.filter((v) => !!v).length !== values.length) return badResponse();

    try {
      await db.sql`INSERT INTO waitlist (email, products, stream, uploads) VALUES (${body.email}, ${body.products}, ${body.stream}, ${body.uploads});`;
      return new Response(null, { status: 200 });
    } catch (e) {
      // no-op
    }
  }

  return badResponse();
};

function badResponse() {
  return new Response(null, { status: 400 });
}
