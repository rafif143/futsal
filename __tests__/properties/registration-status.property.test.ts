/**
 * Property-Based Tests for Registration Status Updates
 * Feature: futsal-tournament-management-system
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import fc from 'fast-check';
import { Registration } from '../../data/types';

// ─── Pure function under test ────────────────────────────────────────────────

/**
 * updateRegistrationStatus
 *
 * Pure function that mirrors the admin approve/reject action.
 * Returns a new array with the targeted registration's status updated;
 * all other registrations are left unchanged.
 */
function updateRegistrationStatus(
  registrations: Registration[],
  id: string,
  newStatus: 'approved' | 'rejected'
): Registration[] {
  return registrations.map((reg) =>
    reg.id === id ? { ...reg, status: newStatus } : reg
  );
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

const registrationStatusArb = fc.constantFrom(
  'pending' as const,
  'approved' as const,
  'rejected' as const
);

const paymentStatusArb = fc.constantFrom(
  'pending' as const,
  'confirmed' as const,
  'rejected' as const
);

const registrationArb: fc.Arbitrary<Registration> = fc
  .record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    teamName: fc.string({ minLength: 1, maxLength: 50 }),
    schoolName: fc.string({ minLength: 1, maxLength: 50 }),
    officialName: fc.string({ minLength: 1, maxLength: 50 }),
    contactNumber: fc.string({ minLength: 1, maxLength: 20 }),
    players: fc.array(
      fc.record({
        name: fc.string({ minLength: 1, maxLength: 30 }),
        jerseyNumber: fc.integer({ min: 1, max: 99 }),
      }),
      { minLength: 0, maxLength: 10 }
    ),
    paymentStatus: paymentStatusArb,
    status: registrationStatusArb,
    submittedAt: fc.constant('2025-01-01T00:00:00Z'),
  });

/** Generate a non-empty array of registrations with unique IDs */
const registrationsArb: fc.Arbitrary<Registration[]> = fc
  .array(registrationArb, { minLength: 1, maxLength: 20 })
  .map((regs) =>
    regs.map((reg, idx) => ({ ...reg, id: `reg-${idx + 1}` }))
  );

// ─── Property 5: Registration Status Updates ─────────────────────────────────

// Feature: futsal-tournament-management-system, Property 5: Registration Status Updates

/**
 * **Validates: Requirements 3.3, 3.4**
 *
 * For any registration, approving or rejecting it should update the status to
 * the corresponding value ('approved' or 'rejected').
 */
describe('Property 5: Registration Status Updates', () => {

  test('approving a registration sets its status to "approved"', () => {
    fc.assert(
      fc.property(
        registrationsArb,
        fc.integer({ min: 0, max: 19 }),
        (registrations, rawIdx) => {
          const idx = rawIdx % registrations.length;
          const targetId = registrations[idx].id;

          const updated = updateRegistrationStatus(registrations, targetId, 'approved');
          const target = updated.find((r) => r.id === targetId);

          return target !== undefined && target.status === 'approved';
        }
      ),
      { numRuns: 25 }
    );
  });

  test('rejecting a registration sets its status to "rejected"', () => {
    fc.assert(
      fc.property(
        registrationsArb,
        fc.integer({ min: 0, max: 19 }),
        (registrations, rawIdx) => {
          const idx = rawIdx % registrations.length;
          const targetId = registrations[idx].id;

          const updated = updateRegistrationStatus(registrations, targetId, 'rejected');
          const target = updated.find((r) => r.id === targetId);

          return target !== undefined && target.status === 'rejected';
        }
      ),
      { numRuns: 25 }
    );
  });

  test('only the targeted registration status changes', () => {
    fc.assert(
      fc.property(
        registrationsArb,
        fc.integer({ min: 0, max: 19 }),
        fc.constantFrom('approved' as const, 'rejected' as const),
        (registrations, rawIdx, newStatus) => {
          const idx = rawIdx % registrations.length;
          const targetId = registrations[idx].id;

          const updated = updateRegistrationStatus(registrations, targetId, newStatus);

          // The targeted registration must have the new status
          const target = updated.find((r) => r.id === targetId);
          if (!target || target.status !== newStatus) return false;

          // All other registrations must be unchanged
          return updated.every((updatedReg) => {
            if (updatedReg.id === targetId) return true;
            const original = registrations.find((r) => r.id === updatedReg.id);
            return original !== undefined && updatedReg.status === original.status;
          });
        }
      ),
      { numRuns: 25 }
    );
  });

  test('other registrations remain unchanged after a status update', () => {
    fc.assert(
      fc.property(
        registrationsArb,
        fc.integer({ min: 0, max: 19 }),
        fc.constantFrom('approved' as const, 'rejected' as const),
        (registrations, rawIdx, newStatus) => {
          const idx = rawIdx % registrations.length;
          const targetId = registrations[idx].id;

          const updated = updateRegistrationStatus(registrations, targetId, newStatus);

          // Every non-targeted registration must be deeply equal to its original
          const nonTargetOriginals = registrations.filter((r) => r.id !== targetId);
          const nonTargetUpdated = updated.filter((r) => r.id !== targetId);

          if (nonTargetOriginals.length !== nonTargetUpdated.length) return false;

          return nonTargetOriginals.every((orig) => {
            const upd = nonTargetUpdated.find((r) => r.id === orig.id);
            return (
              upd !== undefined &&
              upd.status === orig.status &&
              upd.teamName === orig.teamName &&
              upd.paymentStatus === orig.paymentStatus
            );
          });
        }
      ),
      { numRuns: 25 }
    );
  });

  test('total number of registrations is preserved after a status update', () => {
    fc.assert(
      fc.property(
        registrationsArb,
        fc.integer({ min: 0, max: 19 }),
        fc.constantFrom('approved' as const, 'rejected' as const),
        (registrations, rawIdx, newStatus) => {
          const idx = rawIdx % registrations.length;
          const targetId = registrations[idx].id;

          const updated = updateRegistrationStatus(registrations, targetId, newStatus);

          return updated.length === registrations.length;
        }
      ),
      { numRuns: 25 }
    );
  });

  test('status update is idempotent: applying the same status twice yields the same result', () => {
    fc.assert(
      fc.property(
        registrationsArb,
        fc.integer({ min: 0, max: 19 }),
        fc.constantFrom('approved' as const, 'rejected' as const),
        (registrations, rawIdx, newStatus) => {
          const idx = rawIdx % registrations.length;
          const targetId = registrations[idx].id;

          const once = updateRegistrationStatus(registrations, targetId, newStatus);
          const twice = updateRegistrationStatus(once, targetId, newStatus);

          // Statuses should be identical after applying the same update twice
          return once.every((reg, i) => reg.status === twice[i].status);
        }
      ),
      { numRuns: 25 }
    );
  });

  // ── Concrete examples ──────────────────────────────────────────────────────

  test('concrete: approving a pending registration marks it approved', () => {
    const registrations: Registration[] = [
      {
        id: 'reg-1',
        teamName: 'Garuda FC',
        schoolName: 'SMP Negeri 1',
        officialName: 'Ahmad',
        contactNumber: '+62812345678',
        players: [],
        paymentStatus: 'pending',
        status: 'pending',
        submittedAt: '2025-01-01T00:00:00Z',
      },
      {
        id: 'reg-2',
        teamName: 'Elang Muda',
        schoolName: 'SMP Negeri 2',
        officialName: 'Budi',
        contactNumber: '+62813456789',
        players: [],
        paymentStatus: 'confirmed',
        status: 'pending',
        submittedAt: '2025-01-02T00:00:00Z',
      },
    ];

    const updated = updateRegistrationStatus(registrations, 'reg-1', 'approved');

    assert.strictEqual(updated[0].status, 'approved');
    assert.strictEqual(updated[1].status, 'pending'); // unchanged
  });

  test('concrete: rejecting a pending registration marks it rejected', () => {
    const registrations: Registration[] = [
      {
        id: 'reg-1',
        teamName: 'Garuda FC',
        schoolName: 'SMP Negeri 1',
        officialName: 'Ahmad',
        contactNumber: '+62812345678',
        players: [],
        paymentStatus: 'pending',
        status: 'pending',
        submittedAt: '2025-01-01T00:00:00Z',
      },
    ];

    const updated = updateRegistrationStatus(registrations, 'reg-1', 'rejected');

    assert.strictEqual(updated[0].status, 'rejected');
  });

  test('concrete: updating a non-existent id leaves all registrations unchanged', () => {
    const registrations: Registration[] = [
      {
        id: 'reg-1',
        teamName: 'Garuda FC',
        schoolName: 'SMP Negeri 1',
        officialName: 'Ahmad',
        contactNumber: '+62812345678',
        players: [],
        paymentStatus: 'pending',
        status: 'pending',
        submittedAt: '2025-01-01T00:00:00Z',
      },
    ];

    const updated = updateRegistrationStatus(registrations, 'non-existent', 'approved');

    assert.strictEqual(updated[0].status, 'pending'); // unchanged
  });
});
