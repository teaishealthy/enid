import { z } from 'zod';
import { IsExact, assertType } from './type-utils';
import { SessionCreate, UserCreate } from 'eludris-api-types/v0.4.0-alpha1';

const userNameSchema = z
  .string()
  .min(2, 'Username must be at least 2 characters long')
  .max(32, 'Username must be at most 32 characters long')
  .regex(
    /^[a-z0-9_-]+$/,
    'Username must only consist of lowercase letters, numbers, underscores and dashes',
  )
  .refine(username => {
    return /[a-z]/.test(username);
  }, 'Username must have at least one alphabetical letter');

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long');

export const userLoginSchema = z.object({
  identifier: z.union([z.string().email(), userNameSchema]),
  password: passwordSchema,
});

export const userCreateSchema = z.object({
  username: userNameSchema,
  password: passwordSchema,
  email: z.string().email(),
});

// prettier-ignore - Syntax highlighting breaks when formatting with Prettier
assertType<
  IsExact<
    z.infer<typeof userLoginSchema>,
    Pick<SessionCreate, 'identifier' | 'password'>
  >
>(true);
assertType<IsExact<z.infer<typeof userCreateSchema>, UserCreate>>(true);
