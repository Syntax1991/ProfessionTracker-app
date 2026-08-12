import {
  useEffect,
  useState
} from "react";
import { getProfessionDetail } from "../api/professionDetailApi";
import type { ProfessionDetail } from "../types/professionDetail.types";

type ProfessionDetailState = {
  detail: ProfessionDetail | null;
  isLoading: boolean;
  error: string | null;
};

export function useProfessionDetail(
  professionId: string | undefined
): ProfessionDetailState {
  const [detail, setDetail] =
    useState<ProfessionDetail | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(
      Boolean(professionId)
    );

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    if (!professionId) {
      setDetail(null);
      setError(null);
      setIsLoading(false);

      return;
    }

    const resolvedProfessionId =
      professionId;

    let cancelled = false;

    async function load() {
      setError(null);
      setIsLoading(true);

      try {
        const result =
          await getProfessionDetail(
            resolvedProfessionId
          );

        if (!cancelled) {
          setDetail(
            result
          );
        }
      }
      catch (loadError) {
        if (!cancelled) {
          setDetail(null);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Profession details could not be loaded."
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
    professionId
  ]);

  return {
    detail,
    isLoading,
    error
  };
}