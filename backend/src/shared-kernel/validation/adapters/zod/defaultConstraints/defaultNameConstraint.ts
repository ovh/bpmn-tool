import { z } from 'zod';

export const defaultNameConstraint = z
  .string()
  .regex(
    new RegExp(/^(?!_|\.|-)(?!(\w|\.|-)*[_.-]{2})(\w|\.|-)*(?<!(\.|-|_))$/),
  );

export const defaultDisplayNameConstraint = z
  .string()
  .regex(new RegExp(/^[A-Za-z0-9éèàùâêûîô,:%\-_*.|+=\/&@$#<>\s'()\[\]]+$/));
