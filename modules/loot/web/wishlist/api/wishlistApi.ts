import { apiRequest } from "../../../../../apps/web/src/shared/api/httpClient";
import type {
  LootTierStatus,
  LootTrinketChoice,
  MyWishlist
} from "../types/wishlist.types";

export function getMyWishlist(): Promise<MyWishlist> {
  return apiRequest<MyWishlist>(
    "/loot/wishlist/me"
  );
}

export function setTierStatus(
  tierSlot: string,
  status: LootTierStatus
): Promise<unknown> {
  return apiRequest(
    `/loot/wishlist/me/tier/${tierSlot}`,
    {
      method: "PUT",
      body: JSON.stringify({
        status
      })
    }
  );
}

export function clearTierStatus(
  tierSlot: string
): Promise<void> {
  return apiRequest<void>(
    `/loot/wishlist/me/tier/${tierSlot}`,
    {
      method: "DELETE"
    }
  );
}

export function setTrinketChoice(
  rank: number,
  itemId: number
): Promise<LootTrinketChoice> {
  return apiRequest<LootTrinketChoice>(
    `/loot/wishlist/me/trinket/${rank}`,
    {
      method: "PUT",
      body: JSON.stringify({
        itemId
      })
    }
  );
}

export function clearTrinketChoice(
  rank: number
): Promise<void> {
  return apiRequest<void>(
    `/loot/wishlist/me/trinket/${rank}`,
    {
      method: "DELETE"
    }
  );
}
