import { z } from "zod";

export const addonSavedVariablesSchema =
  z.string().min(
    1,
    "SavedVariables dürfen nicht leer sein."
  );