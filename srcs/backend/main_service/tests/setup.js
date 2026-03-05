import { vi } from "vitest";

vi.mock('../src/config/prisma.js', () => ({
    prisma : {
    user: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    job: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    application: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    applicationPhase: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    jobPhase: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    profile: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    }
}))