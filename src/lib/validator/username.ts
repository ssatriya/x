import { z } from "zod";

export const UsernameValidator = z
  .string()
  .min(3, { message: "Username must be 3 or more character length." })
  .max(15, { message: "Username can't be more than 15 character length." });
