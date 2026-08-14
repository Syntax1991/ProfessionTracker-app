import {
  useCallback,
  useEffect,
  useState
} from "react";
import {
  clearTierStatus,
  clearTrinketChoice,
  getMyWishlist,
  setTierStatus as setTierStatusRequest,
  setTrinketChoice as setTrinketChoiceRequest
} from "../api/wishlistApi";
import type {
  LootTierStatus,
  MyWishlist
} from "../types/wishlist.types";

export function useMyWishlist() {
  const [wishlist, setWishlist] =
    useState<MyWishlist | null>(
      null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const load = useCallback(
    async () => {
      setError(null);
      setIsLoading(true);

      try {
        setWishlist(
          await getMyWishlist()
        );
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Wishlist could not be loaded."
        );
      }
      finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void load();
  }, [load]);

  const setTierStatus = async (
    tierSlot: string,
    status: LootTierStatus | null
  ) => {
    setError(null);

    try {
      if (status === null) {
        await clearTierStatus(
          tierSlot
        );
      }
      else {
        await setTierStatusRequest(
          tierSlot,
          status
        );
      }

      await load();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Tier preference could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  const setTrinketChoice = async (
    rank: number,
    itemId: number | null
  ) => {
    setError(null);

    try {
      if (itemId === null) {
        await clearTrinketChoice(
          rank
        );
      }
      else {
        await setTrinketChoiceRequest(
          rank,
          itemId
        );
      }

      await load();
    }
    catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : "Trinket choice could not be updated.";

      setError(message);
      throw updateError;
    }
  };

  return {
    wishlist,
    isLoading,
    error,
    setTierStatus,
    setTrinketChoice
  };
}
