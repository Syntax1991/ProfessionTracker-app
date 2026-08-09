-- Reconcile profession Knowledge columns that were previously
-- applied to the development database without migration history.

ALTER TABLE "ProfessionSpecializationNode"
ADD COLUMN "knowledgeMaxRank" INTEGER;

ALTER TABLE "CharacterProfessionNodeProgress"
ADD COLUMN "knowledgeRank" INTEGER;

ALTER TABLE "CharacterProfessionNodeProgress"
ADD COLUMN "unlockRank" INTEGER;