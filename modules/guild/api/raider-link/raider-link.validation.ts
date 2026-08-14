import { z } from "zod";

export const raiderLinkMemberIdSchema =
  z.string().min(1);
