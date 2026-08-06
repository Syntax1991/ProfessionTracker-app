import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  getCharacterSpecializations,
  updateCharacterProfessionSpecializations
} from "../api/specializationApi";
import type {
  CharacterSpecializationOverview,
  SpecializationProgressInput
} from "../types/specialization.types";
import {
  flattenSpecializationNodes,
  getProfessionNodeIds
} from "../utils/specializationTree";

type CharacterSpecializationState = {
  overview:
    CharacterSpecializationOverview | null;
  ranks: Record<string, number>;
  isLoading: boolean;
  savingProfessionId: string | null;
  error: string | null;
  setNodeRank: (
    nodeId: string,
    rank: number
  ) => void;
  saveProfession: (
    characterProfessionId: string
  ) => Promise<void>;
};

export function useCharacterSpecializations(
  characterId: string | undefined
): CharacterSpecializationState {
  const [overview, setOverview] =
    useState<CharacterSpecializationOverview | null>(
      null
    );

  const [ranks, setRanks] =
    useState<Record<string, number>>(
      {}
    );

  const [isLoading, setIsLoading] =
    useState(Boolean(characterId));

  const [
    savingProfessionId,
    setSavingProfessionId
  ] = useState<string | null>(
    null
  );

  const [error, setError] =
    useState<string | null>(
      null
    );

  const applyOverview =
    useCallback(
      (
        nextOverview:
          CharacterSpecializationOverview
      ) => {
        const nextRanks:
          Record<string, number> = {};

        for (
          const profession of
          nextOverview.professions
        ) {
          for (
            const tree of
            profession.trees
          ) {
            for (
              const node of
              flattenSpecializationNodes(
                tree.nodes
              )
            ) {
              nextRanks[node.id] =
                node.rank;
            }
          }
        }

        setOverview(
          nextOverview
        );

        setRanks(
          nextRanks
        );
      },
      []
    );

  useEffect(() => {
    if (!characterId) {
      setOverview(null);
      setRanks({});
      setError(null);
      setIsLoading(false);

      return;
    }

    const resolvedCharacterId =
      characterId;

    let cancelled = false;

    async function load() {
      setError(null);
      setIsLoading(true);

      try {
        const nextOverview =
          await getCharacterSpecializations(
            resolvedCharacterId
          );

        if (!cancelled) {
          applyOverview(
            nextOverview
          );
        }
      }
      catch (loadError) {
        if (!cancelled) {
          setOverview(null);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Spezialisierungen konnten nicht geladen werden."
          );
        }
      }
      finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [
    applyOverview,
    characterId
  ]);

  const setNodeRank = (
    nodeId: string,
    rank: number
  ) => {
    const normalizedRank =
      Number.isFinite(rank)
        ? Math.max(
            0,
            Math.trunc(rank)
          )
        : 0;

    setRanks(
      (current) => ({
        ...current,
        [nodeId]:
          normalizedRank
      })
    );
  };

  const saveProfession = async (
    characterProfessionId: string
  ) => {
    if (
      !overview ||
      !characterId
    ) {
      return;
    }

    const resolvedCharacterId =
      characterId;

    const profession =
      overview.professions.find(
        (item) =>
          item.id ===
          characterProfessionId
      );

    if (!profession) {
      return;
    }

    setError(null);

    setSavingProfessionId(
      characterProfessionId
    );

    const professionNodeIds =
      getProfessionNodeIds(
        profession
      );

    const progress:
      SpecializationProgressInput[] =
      professionNodeIds.map(
        (nodeId) => ({
          nodeId,
          rank:
            ranks[nodeId] ?? 0
        })
      );

    try {
      const nextOverview =
        await updateCharacterProfessionSpecializations(
          resolvedCharacterId,
          characterProfessionId,
          progress
        );

      applyOverview(
        nextOverview
      );
    }
    catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Spezialisierungen konnten nicht gespeichert werden."
      );
    }
    finally {
      setSavingProfessionId(
        null
      );
    }
  };

  return {
    overview,
    ranks,
    isLoading,
    savingProfessionId,
    error,
    setNodeRank,
    saveProfession
  };
}