import { z } from "zod";

export const OnboardingValidator = z.object({
  birthdate: z.string(),
  bio: z
    .string()
    .max(160, { message: "Bio can't be more than 160 characters length." })
    .optional(),
  username: z
    .string()
    .min(3, { message: "Username must be 3 or more character length." })
    .max(15, { message: "Username can't be more than 15 character length." }),
});
export type OnboardingPayload = z.infer<typeof OnboardingValidator>;
