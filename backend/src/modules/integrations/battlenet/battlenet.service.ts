import { env } from "../../../config/env.js";

export class BattleNetService {
  getStatus() {
    return {
      configured: Boolean(
        env.BATTLENET_CLIENT_ID &&
        env.BATTLENET_CLIENT_SECRET
      ),
      region:
        env.BATTLENET_REGION,
      redirectUri:
        env.BATTLENET_REDIRECT_URI
    };
  }
}