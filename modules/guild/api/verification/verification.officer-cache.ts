/**
 * Short-lived, in-process cache for a live Battle.net officer-rank
 * check (see GuildVerificationService.requireCurrentOfficer). Only
 * ever stores a CONFIRMED positive result — a failed/negative check
 * is never cached, so there is no failure mode where a stale entry
 * blocks someone who was just promoted, and no risk of a cache bug
 * ever reading as "authorized by default." Session/link validation is
 * never cached here; it always runs fresh before this cache is
 * consulted.
 */
export class OfficerAuthorizationCache {
  private readonly ttlMs: number;
  private readonly now: () => number;
  private readonly verifiedUntil = new Map<
    string,
    number
  >();

  constructor(options?: {
    ttlMs?: number;
    now?: () => number;
  }) {
    this.ttlMs =
      options?.ttlMs ?? 5 * 60 * 1000;

    this.now =
      options?.now ?? Date.now;
  }

  isVerified(memberId: string): boolean {
    const expiresAt =
      this.verifiedUntil.get(memberId);

    return (
      expiresAt !== undefined &&
      expiresAt > this.now()
    );
  }

  markVerified(memberId: string): void {
    this.verifiedUntil.set(
      memberId,
      this.now() + this.ttlMs
    );
  }
}
