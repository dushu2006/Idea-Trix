import { describe, expect, it } from 'vitest';

import { createRegistrationId, REGISTRATION_ID_RE } from '../src/lib/registration-id';
import { buildSlipText, formatINR } from '../src/lib/registrations';
import { registrationSchema } from '../src/lib/validation';

const SOLO = {
  teamName: 'Paper Planes',
  leaderName: 'Ananya Rao',
  leaderEmail: 'ananya@example.com',
  memberName: '',
  memberEmail: '',
};

describe('registrationSchema', () => {
  it('accepts a valid solo team', () => {
    expect(registrationSchema.safeParse(SOLO).success).toBe(true);
  });

  it('accepts a valid pair', () => {
    const result = registrationSchema.safeParse({
      ...SOLO,
      memberName: 'Dev Patel',
      memberEmail: 'dev@example.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing team name', () => {
    const result = registrationSchema.safeParse({ ...SOLO, teamName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid leader email', () => {
    const result = registrationSchema.safeParse({ ...SOLO, leaderEmail: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('requires an email when a second member name is given', () => {
    const result = registrationSchema.safeParse({ ...SOLO, memberName: 'Dev Patel' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.memberEmail).toBeDefined();
    }
  });

  it('requires a name when a second member email is given', () => {
    const result = registrationSchema.safeParse({ ...SOLO, memberEmail: 'dev@example.com' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.memberName).toBeDefined();
    }
  });

  it('rejects a second member email identical to the leader’s', () => {
    const result = registrationSchema.safeParse({
      ...SOLO,
      memberName: 'Dev Patel',
      memberEmail: 'ANANYA@example.com',
    });
    expect(result.success).toBe(false);
  });

  it('trims accidental whitespace', () => {
    const result = registrationSchema.safeParse({ ...SOLO, teamName: '  Paper Planes  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.teamName).toBe('Paper Planes');
  });
});

describe('createRegistrationId', () => {
  it('matches the documented format and stays unique', () => {
    const ids = new Set(Array.from({ length: 500 }, () => createRegistrationId()));
    expect(ids.size).toBe(500);
    for (const id of ids) expect(id).toMatch(REGISTRATION_ID_RE);
  });
});

describe('formatINR', () => {
  it('formats the team fee', () => {
    expect(formatINR(100)).toBe('₹100');
  });
});

describe('buildSlipText', () => {
  it('includes the registration ID, team, and honest demo wording', () => {
    const slip = buildSlipText(SOLO, 'IDX-ABC123');
    expect(slip).toContain('IDX-ABC123');
    expect(slip).toContain('Paper Planes');
    expect(slip).toContain('solo team');
    expect(slip).toContain('demo mode');
    expect(slip).toContain('No payment was taken');
  });
});
