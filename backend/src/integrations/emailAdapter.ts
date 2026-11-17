import { z } from 'zod';

const API_KEY = process.env.RESEND_API_KEY as string;
const FROM = process.env.EMAIL_FROM as string;

const ResendResponseSchema = z.object({ id: z.string() });

export type Email = {
  to: string
  subject: string
  html: string
  text: string
  idempotencyKey: string
}

export const sendEmail = async ({ to, subject, html, text, idempotencyKey }: Email): Promise<string> => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ from: FROM, to, subject, html, text }),
    signal: AbortSignal.timeout(5_000),
  });

  const answer: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (answer as { message?: string } | null)?.message ?? 'no message'
    throw new Error(`Resend answered ${response.status}: ${message}`)
  }

  return ResendResponseSchema.parse(answer).id;
};