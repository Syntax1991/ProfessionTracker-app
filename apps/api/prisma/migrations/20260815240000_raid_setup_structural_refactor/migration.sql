-- 1. RaidSetup: replace the raidEventId-only unique index with a
--    composite (raidEventId, key) unique index; add the key column.
--    This is what makes RaidEvent -> RaidSetup[] possible while
--    Phase 1 still deterministically resolves exactly one ("main")
--    default Setup per event via upsert.
DROP INDEX "RaidSetup_raidEventId_key";
ALTER TABLE "RaidSetup" ADD COLUMN "key" TEXT NOT NULL DEFAULT 'main';
CREATE UNIQUE INDEX "RaidSetup_raidEventId_key_key" ON "RaidSetup"("raidEventId", "key");

-- 2. Rename RaidCooldownSetupMember -> RaidSetupMember (table is
--    still empty, never consumed by application code yet).
ALTER TABLE "RaidCooldownSetupMember" RENAME TO "RaidSetupMember";

-- 3. Bootstrap RaidWeek/RaidPlan/RaidSetup for every RaidEvent that
--    currently has RaidBossRosterEntry rows, so those rows can be
--    backfilled with a real setupId below. Weeks are deduplicated by
--    their real computed reset-week start (RaidWeek.startsAt is
--    unique) so multiple events landing in the same real reset week
--    share one RaidWeek/RaidPlan, exactly as the application's own
--    getOrCreateSetupForEvent will do for all future data.
CREATE TEMP TABLE "_migration_event_weeks" AS
SELECT
  re."id" AS "eventId",
  printf(
    '%sT00:00:00.000+00:00',
    date(re."scheduledAt", '-' || ((CAST(strftime('%w', re."scheduledAt") AS INTEGER) - 3 + 7) % 7) || ' days')
  ) AS "weekStart",
  printf(
    '%sT23:59:59.999+00:00',
    date(re."scheduledAt", '-' || ((CAST(strftime('%w', re."scheduledAt") AS INTEGER) - 3 + 7) % 7) || ' days', '+6 days')
  ) AS "weekEnd"
FROM "RaidEvent" re
WHERE re."id" IN (
  SELECT DISTINCT rb."raidEventId"
  FROM "RaidBoss" rb
  INNER JOIN "RaidBossRosterEntry" rbre ON rbre."bossId" = rb."id"
);

INSERT INTO "RaidWeek" ("id", "startsAt", "endsAt", "createdAt")
SELECT
  'migweek_' || lower(hex(randomblob(12))),
  "weekStart",
  "weekEnd",
  strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now')
FROM (SELECT DISTINCT "weekStart", "weekEnd" FROM "_migration_event_weeks");

INSERT INTO "RaidPlan" ("id", "raidWeekId", "name", "status", "createdAt", "updatedAt")
SELECT
  'migplan_' || lower(hex(randomblob(12))),
  "id",
  'Main Progress',
  'DRAFT',
  strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now'),
  strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now')
FROM "RaidWeek"
WHERE "id" LIKE 'migweek_%';

INSERT INTO "RaidSetup" ("id", "raidPlanId", "raidEventId", "key", "name", "createdAt", "updatedAt")
SELECT
  'migsetup_' || lower(hex(randomblob(12))),
  p."id",
  ew."eventId",
  'main',
  'Main Setup',
  strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now'),
  strftime('%Y-%m-%dT%H:%M:%f+00:00', 'now')
FROM "_migration_event_weeks" ew
INNER JOIN "RaidWeek" w ON w."startsAt" = ew."weekStart"
INNER JOIN "RaidPlan" p ON p."raidWeekId" = w."id" AND p."id" LIKE 'migplan_%';

DROP TABLE "_migration_event_weeks";

-- 4. Rebuild RaidBossRosterEntry with a NOT NULL setupId (SQLite
--    can't add a NOT NULL FK column with backfilled values via a
--    plain ALTER TABLE), backfilled from the "main" RaidSetup just
--    created for each row's event. Zero data loss.
CREATE TABLE "new_RaidBossRosterEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bossId" TEXT NOT NULL,
    "setupId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RaidBossRosterEntry_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "RaidBoss" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RaidBossRosterEntry_setupId_fkey" FOREIGN KEY ("setupId") REFERENCES "RaidSetup" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO "new_RaidBossRosterEntry" ("id", "bossId", "setupId", "memberId", "status", "createdAt", "updatedAt")
SELECT
  rbre."id",
  rbre."bossId",
  rs."id",
  rbre."memberId",
  rbre."status",
  rbre."createdAt",
  rbre."updatedAt"
FROM "RaidBossRosterEntry" rbre
INNER JOIN "RaidBoss" rb ON rb."id" = rbre."bossId"
INNER JOIN "RaidSetup" rs ON rs."raidEventId" = rb."raidEventId" AND rs."key" = 'main';

DROP TABLE "RaidBossRosterEntry";
ALTER TABLE "new_RaidBossRosterEntry" RENAME TO "RaidBossRosterEntry";

CREATE INDEX "RaidBossRosterEntry_memberId_idx" ON "RaidBossRosterEntry"("memberId");
CREATE INDEX "RaidBossRosterEntry_setupId_idx" ON "RaidBossRosterEntry"("setupId");
CREATE UNIQUE INDEX "RaidBossRosterEntry_bossId_setupId_memberId_key" ON "RaidBossRosterEntry"("bossId", "setupId", "memberId");
