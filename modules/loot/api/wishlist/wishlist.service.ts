import { AppError } from "../../../../apps/api/src/shared/errors/AppError.js";
import { lootCatalog } from "../../shared/catalog/lootCatalog.js";
import { LootWishlistRepository } from "./wishlist.repository.js";
import type { RaiderLinkGuard } from "./wishlist.types.js";

export class LootWishlistService {
  constructor(
    private readonly repository:
      LootWishlistRepository,

    private readonly raiderLink:
      RaiderLinkGuard
  ) {}

  async getMyWishlist(token: string) {
    const member =
      await this.requireLinkedMember(
        token
      );

    const [
      tierPreferences,
      trinketChoices
    ] = await Promise.all([
      this.repository.findTierPreferences(
        member.id
      ),
      this.repository.findTrinketChoices(
        member.id
      )
    ]);

    return {
      memberId: member.id,
      tierPreferences,
      trinketChoices
    };
  }

  async setTierStatus(
    token: string,
    tierSlot: string,
    status: string
  ) {
    const member =
      await this.requireLinkedMember(
        token
      );

    return this.repository.upsertTierPreference(
      member.id,
      tierSlot,
      status
    );
  }

  async clearTierStatus(
    token: string,
    tierSlot: string
  ) {
    const member =
      await this.requireLinkedMember(
        token
      );

    await this.repository.deleteTierPreference(
      member.id,
      tierSlot
    );
  }

  async setTrinketChoice(
    token: string,
    rank: number,
    itemId: number
  ) {
    const member =
      await this.requireLinkedMember(
        token
      );

    this.requireRealTrinket(itemId);

    await this.repository.clearItemFromOtherRanks(
      member.id,
      itemId,
      rank
    );

    return this.repository.upsertTrinketChoice(
      member.id,
      rank,
      itemId
    );
  }

  async clearTrinketChoice(
    token: string,
    rank: number
  ) {
    const member =
      await this.requireLinkedMember(
        token
      );

    await this.repository.deleteTrinketChoice(
      member.id,
      rank
    );
  }

  private requireRealTrinket(
    itemId: number
  ) {
    const isRealTrinket =
      lootCatalog.some((raid) =>
        raid.items.some(
          (item) =>
            item.itemId === itemId &&
            item.slot === "TRINKET"
        )
      );

    if (!isRealTrinket) {
      throw new AppError(
        400,
        "Unbekanntes Trinket."
      );
    }
  }

  private async requireLinkedMember(
    token: string
  ) {
    const member =
      await this.raiderLink.getLinkedMember(
        token
      );

    if (!member) {
      throw new AppError(
        403,
        "Bitte zuerst dein Battle.net-Konto unter „My Raider Login“ mit deinem Gildenmitglied verknüpfen."
      );
    }

    return member;
  }
}
