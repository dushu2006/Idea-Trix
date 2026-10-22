import { NextResponse } from 'next/server';

import { createRegistrationId } from '@/lib/registration-id';
import { registrationSchema } from '@/lib/validation';

/**
 * Demo registration endpoint.
 *
 * Validates submissions with the same Zod schema as the client form and
 * acknowledges them with a demo registration ID. Accepted entries are held in
 * server memory only (they do not survive a redeploy), and no payment or
 * email is triggered. This is the integration boundary: a production backend
 * (database + payments + email) should replace the in-memory store without
 * changing the request/response contract.
 */

interface StoredRegistration {
  registrationId: string;
  receivedAt: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  memberName: string;
  memberEmail: string;
}

const store: StoredRegistration[] = [];

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'That request wasn’t valid JSON. Please try again.' },
      { status: 400 },
    );
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Please review the highlighted fields and try again.',
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const registrationId = createRegistrationId();
  store.push({
    ...parsed.data,
    registrationId,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, registrationId, demo: true }, { status: 201 });
}
