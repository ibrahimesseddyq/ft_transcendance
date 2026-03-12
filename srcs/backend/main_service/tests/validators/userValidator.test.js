import { describe, it , expect } from "vitest";
import {createUserSchema, updateUserSchema} from '../../src/validators/userValidator.js';

describe('userValidator schemas', () => {
  it('should export a defined createUserSchema', () => {
    expect(createUserSchema).toBeDefined();
    const type = typeof createUserSchema;
    expect(type === 'object' || type === 'function').toBe(true);
  });
  it('should export a defined updateUserSchema', () => {
    expect(updateUserSchema).toBeDefined();
    const type = typeof updateUserSchema;
    expect(type === 'object' || type === 'function').toBe(true);
  });
});