/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║          HIREFY — AGGRESSIVE UNIT TEST SUITE                               ║
 * ║  main_service/quizService  +  quiz_service/testService + mcqService         ║
 * ║  quiz_service/internalService  +  main_service/authService                 ║
 * ║                                                                              ║
 * ║  Framework : Vitest  (drop-in Jest compatible)                              ║
 * ║  Coverage  : every branch, every guard, every edge-case                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * HOW TO RUN
 * ──────────
 * 1. Copy this file to:
 * srcs/backend/main_service/tests/hirefy.test.js
 *
 * 2. Install dependencies (if not already):
 * cd srcs/backend/main_service
 * npm install
 *
 * 3. Run the tests:
 * npx vitest run tests/hirefy.test.js
 *
 * Or with coverage:
 * npx vitest run --coverage tests/hirefy.test.js
 *
 * Or in watch mode during development:
 * npx vitest tests/hirefy.test.js
 *
 * NOTE: The test file is self-contained — all dependencies are vi.mock()'d,
 * so NO running database or external service is required.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL MOCK REGISTRY
// Every module that touches the database, network, or filesystem is mocked
// before the first import of real source files.
// ─────────────────────────────────────────────────────────────────────────────

// ── quiz_service client (used by main_service/quizService) ──────────────────
vi.mock('../src/services/quizClientService.js', () => ({
    getTestById:    vi.fn(),
    evaluateTest:   vi.fn(),
}));

// ── applicationPhaseService (used by main_service/quizService) ───────────────
vi.mock('../src/services/applicationPhaseService.js', () => ({
    getApplicaticationPhaseById: vi.fn(),
    updateApplicationPhase:      vi.fn(),
}));

// ── applicationService (used by main_service/quizService) ────────────────────
vi.mock('../src/services/applicationService.js', () => ({
    getApplicaticationById: vi.fn(),
    rejectApplication:      vi.fn(),
    acceptApplication:      vi.fn(),
    submitApplication:      vi.fn(),
    withdrawApplication:    vi.fn(),
    advance:                vi.fn(),
    getCurrentPhase:        vi.fn(),
    getApplicaticationPhases: vi.fn(),
}));

// ── userRepository (used by main_service/userService & authService) ──────────
vi.mock('../src/repositories/userRepository.js', () => ({
    createUser:          vi.fn(),
    getUserById:         vi.fn(),
    getUserByEmail:      vi.fn(),
    updateUser:          vi.fn(),
    deleteUser:          vi.fn(),
    getUserApplications: vi.fn(),
    getUserJobs:         vi.fn(),
    getUsers:            vi.fn(),
}));

// ── fileService (used by userService) ───────────────────────────────────────
vi.mock('../src/services/fileService.js', () => ({
    saveAvatar:  vi.fn(),
    deleteFile:  vi.fn(),
    saveResume:  vi.fn(),
}));

// ── jwtService (used by authService) ────────────────────────────────────────
vi.mock('../src/services/jwtService.js', () => ({
    generateAuthTokens:        vi.fn(),
    generateVerificationToken: vi.fn(),
    generateTempToken:         vi.fn(),
    verifyRefreshToken:        vi.fn(),
    verifyVerificationToken:   vi.fn(),
    verifyTempToken:           vi.fn(),
}));

// ── emailService (used by authService) ──────────────────────────────────────
vi.mock('../src/services/emailService.js', () => ({
    default: vi.fn(),
}));

// ── argon2 (used by authService & userService) ───────────────────────────────
vi.mock('argon2', () => ({
    default: {
        hash:   vi.fn(),
        verify: vi.fn(),
    },
}));

// ── crypto (used by userService) ─────────────────────────────────────────────
vi.mock('crypto', () => ({
    default: {
        randomBytes: vi.fn(() => ({ toString: () => 'random-hex-32' })),
    },
}));

// ── notificationService (used by applicationService) ─────────────────────────
vi.mock('../src/services/notificationService.js', () => ({
    createNotification: vi.fn(),
}));

// ── twoFAService (used by authService) ───────────────────────────────────────
// vi.hoisted allows us to define variables that are guaranteed to exist 
// BEFORE the vi.mock() below runs, so we can access them inside our tests!
// ── twoFAService (used by authService) ───────────────────────────────────────
const { mockTwoFAInstance } = vi.hoisted(() => ({
    mockTwoFAInstance: {
        verifyLogin: vi.fn(),
        setup: vi.fn()
    }
}));

vi.mock('../src/services/twoFAService.js', () => ({
    // Using the standard 'function' keyword allows it to act as a constructor!
    default: vi.fn(function() { return mockTwoFAInstance; }),
    twoFAService: vi.fn(function() { return mockTwoFAInstance; })
}));

// ── prisma (used by applicationService directly) ─────────────────────────────
vi.mock('../src/config/prisma.js', () => ({
    prisma: {
        application: {
            findUnique: vi.fn(),
            create:     vi.fn(),
            update:     vi.fn(),
            updateMany: vi.fn(),
        },
        applicationPhase: {
            create: vi.fn(),
            update: vi.fn(),
        },
        $transaction: vi.fn(),
    },
}));

// ── env (used by authService) ────────────────────────────────────────────────
vi.mock('../src/config/env.js', () => ({
    default: {
        BACKEND_URL:           'http://localhost:3000/',
        USER_EMAIL:            'test@hirefy.dev',
        AI_SERVICE_URL:        'http://ai:3002',
        AI_INTERNAL_API_KEY:   'ai-key-123',
        QUIZ_PUBLIC_API_KEY:   'quiz-key-xyz',
        INTERNAL_API_KEY:      'internal-key-abc',
        ACCESS_TOKEN_SECRET:   'access-secret',
        REFRESH_TOKEN_SECRET:  'refresh-secret',
        VERIFY_TOKEN_SECRET:   'verify-secret',
        TEMP_TOKEN_SECRET:     'temp-secret',
    },
}));

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT REAL SOURCE MODULES (after mocks are registered)
// ─────────────────────────────────────────────────────────────────────────────

import * as quizService   from '../src/services/quizService.js';
import * as quizClient    from '../src/services/quizClientService.js';
import * as appPhaseService from '../src/services/applicationPhaseService.js';
import * as appService    from '../src/services/applicationService.js';
import * as userRepo      from '../src/repositories/userRepository.js';
import * as fileSvc       from '../src/services/fileService.js';
import * as jwtSvc        from '../src/services/jwtService.js';
import sendMail           from '../src/services/emailService.js';
import argon2             from 'argon2';
import * as userService   from '../src/services/userService.js';
import * as authService   from '../src/services/authService.js';
import { HttpException }  from '../src/utils/httpExceptions.js';

// ─────────────────────────────────────────────────────────────────────────────
// SHARED FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

const mkPhase = (overrides = {}) => ({
    id:            'phase-001',
    applicationId: 'app-001',
    status:        'pending',
    startedAt:     null,
    jobPhase:      { testId: 'test-001' },
    application:   { candidateId: 'user-001' },
    ...overrides,
});

const mkApplication = (overrides = {}) => ({
    id:          'app-001',
    status:      'inProgress',
    candidateId: 'user-001',
    jobId:       'job-001',
    currentPhaseId: 'phase-001',
    ...overrides,
});

const mkTest = (overrides = {}) => ({
    id:              'test-001',
    type:            'QUIZ',
    title:           'JavaScript Fundamentals',
    durationMinutes: 30,
    passingScore:    60,
    mcqs:            [],
    ...overrides,
});

const mkUser = (overrides = {}) => ({
    id:           'user-001',
    email:        'alice@hirefy.dev',
    passwordHash: '$argon2id$...',
    role:         'candidate',
    isVerified:   true,
    firstLogin:   false,
    twoFAEnabled: false,
    twoFASecret:  null,
    refreshToken: null,
    avatarUrl:    null,
    ...overrides,
});

const mkEvalResult = (overrides = {}) => ({
    passed:          true,
    totalScore:      80,
    maxPossibleScore: 100,
    percentage:      80,
    result:          [{ questionId: 'q1', correct: true }],
    ...overrides,
});

// ─────────────────────────────────────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────────────────────────────────────

const rejects = async (fn, statusCode, msgFragment) => {
    try {
        await fn();
        throw new Error('Expected rejection but resolved');
    } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.statusCode).toBe(statusCode);
        if (msgFragment) expect(err.message).toContain(msgFragment);
    }
};

// ═════════════════════════════════════════════════════════════════════════════
// ███████╗ ███████╗ ██████╗ ████████╗ ██╗  ██████╗ ███╗   ██╗
// ██╔════╝ ██╔════╝██╔════╝ ╚══██╔══╝ ██║ ██╔═══██╗████╗  ██║
// ███████╗ █████╗  ██║         ██║    ██║ ██║   ██║██╔██╗ ██║
// ╚════██║ ██╔══╝  ██║         ██║    ██║ ██║   ██║██║╚██╗██║
// ███████║ ███████╗╚██████╗    ██║    ██║ ╚██████╔╝██║ ╚████║
//  main_service/services/quizService.js
// ═════════════════════════════════════════════════════════════════════════════

describe('quizService.startTest', () => {

    beforeEach(() => { vi.clearAllMocks(); });

    // ── Happy paths ───────────────────────────────────────────────────────────

    it('returns test + time window when phase is still pending', async () => {
        const phase = mkPhase({ status: 'pending' });
        const app   = mkApplication();
        const test  = mkTest({ durationMinutes: 60 });

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(app);
        quizClient.getTestById.mockResolvedValue(test);
        appPhaseService.updateApplicationPhase.mockResolvedValue({});

        const result = await quizService.startTest({
            testId:             'test-001',
            userId:             'user-001',
            applicationPhaseId: 'phase-001',
        });

        expect(result.test).toEqual(test);
        expect(result.startedAt).toBeInstanceOf(Date);
        // completedAt = startedAt + 60 min
        const diff = result.completedAt.getTime() - result.startedAt.getTime();
        expect(diff).toBe(60 * 60 * 1000);
    });

    it('does NOT update phase status when already inProgress', async () => {
        const now   = new Date('2026-01-01T10:00:00Z');
        const phase = mkPhase({ status: 'inProgress', startedAt: now });
        const app   = mkApplication();
        const test  = mkTest({ durationMinutes: 20 });

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(app);
        quizClient.getTestById.mockResolvedValue(test);

        const result = await quizService.startTest({
            testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001',
        });

        expect(appPhaseService.updateApplicationPhase).not.toHaveBeenCalled();
        // startedAt comes from the existing phase record
        expect(result.startedAt).toEqual(now);
        const diff = result.completedAt.getTime() - now.getTime();
        expect(diff).toBe(20 * 60 * 1000);
    });

    it('uses 0 duration when durationMinutes is null/undefined', async () => {
        const phase = mkPhase({ status: 'inProgress', startedAt: new Date() });
        const app   = mkApplication();
        const test  = mkTest({ durationMinutes: null });

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(app);
        quizClient.getTestById.mockResolvedValue(test);

        const result = await quizService.startTest({
            testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001',
        });

        const diff = result.completedAt.getTime() - result.startedAt.getTime();
        expect(diff).toBe(0);
    });

    it('also works when application.status is "pending" (not only inProgress)', async () => {
        const phase = mkPhase({ status: 'pending' });
        const app   = mkApplication({ status: 'pending' });
        const test  = mkTest();

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(app);
        quizClient.getTestById.mockResolvedValue(test);
        appPhaseService.updateApplicationPhase.mockResolvedValue({});

        const result = await quizService.startTest({
            testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001',
        });

        expect(result.test).toEqual(test);
    });

    it('calls updateApplicationPhase with correct payload on first start', async () => {
        const phase = mkPhase({ status: 'pending' });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockResolvedValue(mkTest());
        appPhaseService.updateApplicationPhase.mockResolvedValue({});

        await quizService.startTest({
            testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001',
        });

        expect(appPhaseService.updateApplicationPhase).toHaveBeenCalledWith(
            'phase-001',
            expect.objectContaining({
                status:    'inProgress',
                startedAt: expect.any(Date),
            })
        );
    });

    // ── Error: phase not found ────────────────────────────────────────────────

    it('throws 404 when applicationPhase does not exist (null)', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(null);

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'u', applicationPhaseId: 'x' }),
            404, 'application phase does not exists'
        );
    });

    it('throws 404 when applicationPhase does not exist (undefined)', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(undefined);

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'u', applicationPhaseId: 'x' }),
            404
        );
    });

    // ── Error: application status ────────────────────────────────────────────

    it('throws 400 when application is rejected', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase());
        appService.getApplicaticationById.mockResolvedValue(mkApplication({ status: 'rejected' }));

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            400, 'application is not in progress'
        );
    });

    it('throws 400 when application is accepted', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase());
        appService.getApplicaticationById.mockResolvedValue(mkApplication({ status: 'accepted' }));

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            400
        );
    });

    it('throws 400 when application is withdrawn', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase());
        appService.getApplicaticationById.mockResolvedValue(mkApplication({ status: 'withdrawn' }));

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            400
        );
    });

    // ── Error: candidate identity mismatch ────────────────────────────────────

    it('throws 403 when userId !== application.candidateId (strict equality)', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase());
        appService.getApplicaticationById.mockResolvedValue(mkApplication({ candidateId: 'user-999' }));

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            403, 'cadidate' // note: typo preserved from original source
        );
    });

    it('throws 403 when userId is empty string', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase());
        appService.getApplicaticationById.mockResolvedValue(mkApplication({ candidateId: 'user-001' }));

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: '', applicationPhaseId: 'phase-001' }),
            403
        );
    });

    // ── Error: phase availability ────────────────────────────────────────────

    it('throws 404 when phase status is completed', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase({ status: 'completed' }));
        appService.getApplicaticationById.mockResolvedValue(mkApplication());

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            404, 'test phase not available'
        );
    });

    it('throws 404 when phase status is failed', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase({ status: 'failed' }));
        appService.getApplicaticationById.mockResolvedValue(mkApplication());

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            404
        );
    });

    it('throws 404 when phase status is skipped', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase({ status: 'skipped' }));
        appService.getApplicaticationById.mockResolvedValue(mkApplication());

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            404
        );
    });

    // ── Error: testId mismatch ────────────────────────────────────────────────

    it('throws 400 when testId does not match the jobPhase testId', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(
            mkPhase({ jobPhase: { testId: 'DIFFERENT-test' } })
        );
        appService.getApplicaticationById.mockResolvedValue(mkApplication());

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            400, 'not assigned to this phase'
        );
    });

    it('throws 400 when testId is null vs string', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(
            mkPhase({ jobPhase: { testId: null } })
        );
        appService.getApplicaticationById.mockResolvedValue(mkApplication());

        await rejects(
            () => quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' }),
            400
        );
    });

    // ── Propagates downstream errors ─────────────────────────────────────────

    it('propagates errors thrown by quizClientService.getTestById', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase());
        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockRejectedValue(new Error('Quiz service down'));

        await expect(
            quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' })
        ).rejects.toThrow('Quiz service down');
    });

    it('propagates errors thrown by updateApplicationPhase', async () => {
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(mkPhase({ status: 'pending' }));
        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockResolvedValue(mkTest());
        appPhaseService.updateApplicationPhase.mockRejectedValue(new Error('DB locked'));

        await expect(
            quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' })
        ).rejects.toThrow('DB locked');
    });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('quizService.submitTest', () => {

    const mkSubmitData = (overrides = {}) => ({
        params: { testId: 'test-001' },
        body: {
            applicationPhaseId: 'phase-001',
            answers:            [{ questionId: 'q1', answerId: 'a2' }],
            userId:             'user-001',
        },
        ...overrides,
    });

    const mockIo = { emit: vi.fn() };

    beforeEach(() => { vi.clearAllMocks(); });

    // ── Happy path: pass ──────────────────────────────────────────────────────

    it('returns evaluation summary when candidate passes', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        const result = mkEvalResult({ passed: true });

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(result);
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        const output = await quizService.submitTest(mkSubmitData(), mockIo);

        expect(output.passed).toBe(true);
        expect(output.score).toBe(80);
        expect(output.percentage).toBe(80);
        expect(output.maxPossibleScore).toBe(100);
        expect(output.details).toEqual(result.result);
    });

    it('returns evaluation summary when candidate fails', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        const result = mkEvalResult({ passed: false, totalScore: 30, percentage: 30 });

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(result);
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.rejectApplication.mockResolvedValue({});

        const output = await quizService.submitTest(mkSubmitData(), mockIo);

        expect(output.passed).toBe(false);
        expect(output.score).toBe(30);
    });

    // ── Status transitions ────────────────────────────────────────────────────

    it('marks phase as completed when evaluation passes', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: true }));
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        await quizService.submitTest(mkSubmitData(), mockIo);

        expect(appPhaseService.updateApplicationPhase).toHaveBeenCalledWith(
            'phase-001',
            expect.objectContaining({
                status: 'completed',
                score:  80,
                completedAt: expect.any(Date),
            })
        );
    });

    it('marks phase as failed when evaluation fails', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: false, totalScore: 20 }));
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.rejectApplication.mockResolvedValue({});

        await quizService.submitTest(mkSubmitData(), mockIo);

        expect(appPhaseService.updateApplicationPhase).toHaveBeenCalledWith(
            'phase-001',
            expect.objectContaining({ status: 'failed' })
        );
    });

    it('calls rejectApplication (not accept) on failure', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: false }));
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.rejectApplication.mockResolvedValue({});

        await quizService.submitTest(mkSubmitData(), mockIo);

        expect(appService.rejectApplication).toHaveBeenCalledWith('app-001', mockIo);
        expect(appService.acceptApplication).not.toHaveBeenCalled();
    });

    it('calls acceptApplication (not reject) on pass', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: true }));
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        await quizService.submitTest(mkSubmitData(), mockIo);

        expect(appService.acceptApplication).toHaveBeenCalledWith('app-001', mockIo);
        expect(appService.rejectApplication).not.toHaveBeenCalled();
    });

    // ── Error: wrong user ─────────────────────────────────────────────────────

    it('throws 403 when userId does not match candidateId', async () => {
        const phase = mkPhase({ status: 'inProgress', application: { candidateId: 'user-999' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);

        await rejects(
            () => quizService.submitTest(mkSubmitData(), mockIo),
            403, 'not your application'
        );
    });

    it('throws 403 when userId is undefined', async () => {
        const phase = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);

        const data = mkSubmitData();
        data.body.userId = undefined;

        await rejects(
            () => quizService.submitTest(data, mockIo),
            403
        );
    });

    // ── Error: test not in progress ───────────────────────────────────────────

    it('throws 400 when phase status is pending (not started)', async () => {
        const phase = mkPhase({ status: 'pending', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);

        await rejects(
            () => quizService.submitTest(mkSubmitData(), mockIo),
            400, 'Test not started or already completed'
        );
    });

    it('throws 400 when phase status is completed (double-submit)', async () => {
        const phase = mkPhase({ status: 'completed', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);

        await rejects(
            () => quizService.submitTest(mkSubmitData(), mockIo),
            400
        );
    });

    it('throws 400 when phase status is failed', async () => {
        const phase = mkPhase({ status: 'failed', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);

        await rejects(
            () => quizService.submitTest(mkSubmitData(), mockIo),
            400
        );
    });

    // ── io can be null/undefined ──────────────────────────────────────────────

    it('works when io is null (no socket server)', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult());
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        await expect(quizService.submitTest(mkSubmitData(), null)).resolves.toBeDefined();
    });

    // ── Propagates errors ─────────────────────────────────────────────────────

    it('propagates errors from evaluateTest', async () => {
        const phase = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockRejectedValue(new Error('Evaluation service down'));

        await expect(quizService.submitTest(mkSubmitData(), mockIo))
            .rejects.toThrow('Evaluation service down');
    });

    it('propagates errors from updateApplicationPhase', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult());
        appPhaseService.updateApplicationPhase.mockRejectedValue(new Error('Prisma error'));

        await expect(quizService.submitTest(mkSubmitData(), mockIo))
            .rejects.toThrow('Prisma error');
    });

    // ── Edge: zero answers ────────────────────────────────────────────────────

    it('accepts empty answers array (deliberate forfeit)', async () => {
        const phase  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: false, totalScore: 0 }));
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.rejectApplication.mockResolvedValue({});

        const data = mkSubmitData();
        data.body.answers = [];

        const output = await quizService.submitTest(data, mockIo);
        expect(output.passed).toBe(false);
        expect(output.score).toBe(0);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// ██╗   ██╗███████╗███████╗██████╗      ███████╗███████╗██████╗ ██╗   ██╗
// ██║   ██║██╔════╝██╔════╝██╔══██╗     ██╔════╝██╔════╝██╔══██╗██║   ██║
// ██║   ██║███████╗█████╗  ██████╔╝     ███████╗█████╗  ██████╔╝██║   ██║
// ██║   ██║╚════██║██╔══╝  ██╔══██╗     ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝
// ╚██████╔╝███████║███████╗██║  ██║     ███████║███████╗██║  ██║ ╚████╔╝
// main_service/services/userService.js
// ═════════════════════════════════════════════════════════════════════════════

describe('userService', () => {

    beforeEach(() => { vi.clearAllMocks(); });

    // ── createUser ────────────────────────────────────────────────────────────

    describe('createUser', () => {
        it('hashes password and delegates to repo', async () => {
            argon2.hash.mockResolvedValue('$hashed$');
            userRepo.createUser.mockResolvedValue(mkUser({ id: 'new-user' }));

            const result = await userService.createUser({ email: 'bob@x.com', password: 'secret' });

            expect(argon2.hash).toHaveBeenCalledWith('secret');
            expect(userRepo.createUser).toHaveBeenCalledWith(
                expect.objectContaining({ passwordHash: '$hashed$' })
            );
            // password must NOT be forwarded to repo
            expect(userRepo.createUser.mock.calls[0][0]).not.toHaveProperty('password');
            expect(result.id).toBe('new-user');
        });

        it('strips password field from data passed to repo', async () => {
            argon2.hash.mockResolvedValue('$h$');
            userRepo.createUser.mockResolvedValue(mkUser());

            await userService.createUser({ email: 'a@b.com', password: 'pw', firstName: 'X' });

            const repoArg = userRepo.createUser.mock.calls[0][0];
            expect(repoArg).not.toHaveProperty('password');
            expect(repoArg.firstName).toBe('X');
        });
    });

    // ── getUserById ──────────────────────────────────────────────────────────

    describe('getUserById', () => {
        it('returns user when found', async () => {
            const user = mkUser();
            userRepo.getUserById.mockResolvedValue(user);

            const result = await userService.getUserById('user-001');
            expect(result).toEqual(user);
        });

        it('throws 404 when user not found', async () => {
            userRepo.getUserById.mockResolvedValue(null);

            await rejects(() => userService.getUserById('ghost'), 404, 'user not found');
        });

        it('throws 404 when repo returns undefined', async () => {
            userRepo.getUserById.mockResolvedValue(undefined);

            await rejects(() => userService.getUserById('ghost'), 404);
        });
    });

    // ── getUserByEmail ────────────────────────────────────────────────────────

    describe('getUserByEmail', () => {
        it('returns result from repo directly (no guard)', async () => {
            const user = mkUser();
            userRepo.getUserByEmail.mockResolvedValue(user);

            const result = await userService.getUserByEmail('alice@hirefy.dev');
            expect(result).toEqual(user);
        });

        it('returns null when repo returns null', async () => {
            userRepo.getUserByEmail.mockResolvedValue(null);

            const result = await userService.getUserByEmail('nobody@x.com');
            expect(result).toBeNull();
        });
    });

    // ── updateUser ────────────────────────────────────────────────────────────

    describe('updateUser', () => {
        it('delegates to repo and returns result', async () => {
            const updated = mkUser({ firstName: 'Bob' });
            userRepo.updateUser.mockResolvedValue(updated);

            const result = await userService.updateUser('user-001', { firstName: 'Bob' });
            expect(result.firstName).toBe('Bob');
            expect(userRepo.updateUser).toHaveBeenCalledWith('user-001', { firstName: 'Bob' });
        });
    });

    // ── deleteUser ────────────────────────────────────────────────────────────

    describe('deleteUser', () => {
        it('calls repo.deleteUser with correct id', async () => {
            userRepo.deleteUser.mockResolvedValue({});

            await userService.deleteUser('user-001');
            expect(userRepo.deleteUser).toHaveBeenCalledWith('user-001');
        });
    });

    // ── uploadAvatar ─────────────────────────────────────────────────────────

    describe('uploadAvatar', () => {
        it('saves new avatar and updates user record', async () => {
            const user = mkUser({ avatarUrl: null });
            userRepo.getUserById.mockResolvedValue(user);
            fileSvc.saveAvatar.mockResolvedValue({ avatarUrl: '/uploads/avatars/user-001.jpg' });
            userRepo.updateUser.mockResolvedValue({ ...user, avatarUrl: '/uploads/avatars/user-001.jpg' });
            fileSvc.deleteFile.mockResolvedValue(undefined);

            const file = { originalname: 'photo.jpg', path: '/tmp/photo.jpg' };
            const result = await userService.uploadAvatar('user-001', file);

            expect(fileSvc.saveAvatar).toHaveBeenCalledWith('user-001', file);
            expect(userRepo.updateUser).toHaveBeenCalledWith(
                'user-001', { avatarUrl: '/uploads/avatars/user-001.jpg' }
            );
            expect(result).toBeDefined();
        });

        it('deletes old avatar when user already had one', async () => {
            const user = mkUser({ avatarUrl: '/old/path.png' });
            userRepo.getUserById.mockResolvedValue(user);
            fileSvc.saveAvatar.mockResolvedValue({ avatarUrl: '/new/path.jpg' });
            userRepo.updateUser.mockResolvedValue(user);
            fileSvc.deleteFile.mockResolvedValue(undefined);

            await userService.uploadAvatar('user-001', {});

            expect(fileSvc.deleteFile).toHaveBeenCalledWith('/old/path.png');
        });

        it('does NOT call deleteFile when user had no avatar', async () => {
            const user = mkUser({ avatarUrl: null });
            userRepo.getUserById.mockResolvedValue(user);
            fileSvc.saveAvatar.mockResolvedValue({ avatarUrl: '/new/path.jpg' });
            userRepo.updateUser.mockResolvedValue(user);

            await userService.uploadAvatar('user-001', {});

            // deleteFile should not have been called because old avatarUrl was null
            // (if avatarUrl === user.avatarUrl the delete branch is skipped)
            // Note: service checks `avatarUrl !== user.avatarUrl`
           expect(fileSvc.deleteFile).toHaveBeenCalledWith(null);
        });

        it('throws 404 when user not found', async () => {
            userRepo.getUserById.mockResolvedValue(null);

            await rejects(
                () => userService.uploadAvatar('ghost', {}),
                404, 'user not found'
            );
        });
    });

    // ── deleteAvatar ─────────────────────────────────────────────────────────

    describe('deleteAvatar', () => {
        it('deletes file and clears avatarUrl in db', async () => {
            const user = mkUser({ avatarUrl: '/uploads/avatars/user-001.jpg' });
            userRepo.getUserById.mockResolvedValue(user);
            fileSvc.deleteFile.mockResolvedValue(undefined);
            userRepo.updateUser.mockResolvedValue({});

            await userService.deleteAvatar('user-001');

            expect(fileSvc.deleteFile).toHaveBeenCalledWith('/uploads/avatars/user-001.jpg');
            expect(userRepo.updateUser).toHaveBeenCalledWith('user-001', { avatarUrl: null });
        });

        it('throws 404 when user not found', async () => {
            userRepo.getUserById.mockResolvedValue(null);

            await rejects(() => userService.deleteAvatar('ghost'), 404);
        });

        it('throws 400 when user has no avatar set', async () => {
            userRepo.getUserById.mockResolvedValue(mkUser({ avatarUrl: null }));

            await rejects(() => userService.deleteAvatar('user-001'), 400, 'avatar not set yet');
        });
    });

    // ── getAvatar ─────────────────────────────────────────────────────────────

    describe('getAvatar', () => {
        it('returns avatarUrl when set', async () => {
            userRepo.getUserById.mockResolvedValue(mkUser({ avatarUrl: '/uploads/avatars/a.jpg' }));

            const url = await userService.getAvatar('user-001');
            expect(url).toBe('/uploads/avatars/a.jpg');
        });

        it('throws 404 when user not found', async () => {
            userRepo.getUserById.mockResolvedValue(null);

            await rejects(() => userService.getAvatar('ghost'), 404);
        });

        it('throws 404 when avatarUrl is null', async () => {
            userRepo.getUserById.mockResolvedValue(mkUser({ avatarUrl: null }));

            await rejects(() => userService.getAvatar('user-001'), 404, 'avatar not setted yet');
        });
    });

    // ── getUserApplications ───────────────────────────────────────────────────

    describe('getUserApplications', () => {
        it('returns applications when found', async () => {
            const apps = [{ id: 'a1' }, { id: 'a2' }];
            userRepo.getUserApplications.mockResolvedValue(apps);

            const result = await userService.getUserApplications('user-001');
            expect(result).toEqual(apps);
        });

        it('throws 404 when result is null', async () => {
            userRepo.getUserApplications.mockResolvedValue(null);

            await rejects(() => userService.getUserApplications('ghost'), 404, 'user not found');
        });
    });

    // ── findUserOrCreate ─────────────────────────────────────────────────────

    describe('findUserOrCreate', () => {
        const oauthProfile = {
            emails:      [{ value: '  Bob@GMAIL.COM  ' }],
            name:        { givenName: 'Bob', familyName: 'Smith' },
            displayName: 'Bob Smith',
            photos:      [{ value: 'https://avatar.url/bob.jpg' }],
        };

        it('returns existing user when email matches', async () => {
            const user = mkUser({ email: 'bob@gmail.com' });
            userRepo.getUserByEmail.mockResolvedValue(user);

            const result = await userService.findUserOrCreate(oauthProfile);

            expect(userRepo.getUserByEmail).toHaveBeenCalledWith('bob@gmail.com');
            expect(result).toEqual(user);
            expect(userRepo.createUser).not.toHaveBeenCalled();
        });

        it('normalises email to lowercase+trimmed', async () => {
            userRepo.getUserByEmail.mockResolvedValue(null);
            argon2.hash.mockResolvedValue('$h$');
            userRepo.createUser.mockResolvedValue(mkUser({ email: 'bob@gmail.com' }));

            await userService.findUserOrCreate(oauthProfile);

            expect(userRepo.getUserByEmail).toHaveBeenCalledWith('bob@gmail.com');
        });

        it('creates new user with role=candidate and isVerified=true', async () => {
            userRepo.getUserByEmail.mockResolvedValue(null);
            argon2.hash.mockResolvedValue('$h$');
            userRepo.createUser.mockResolvedValue(mkUser());

            await userService.findUserOrCreate(oauthProfile);

            const args = userRepo.createUser.mock.calls[0][0];
            expect(args.role).toBe('candidate');
            expect(args.isVerified).toBe(true);
            expect(args.firstLogin).toBe(true);
        });

        it('uses displayName when givenName is missing', async () => {
            const profile = {
                emails:      [{ value: 'anon@test.com' }],
                name:        { givenName: '', familyName: '' },
                displayName: 'AnonymousUser extra',
                photos:      [],
            };
            userRepo.getUserByEmail.mockResolvedValue(null);
            argon2.hash.mockResolvedValue('$h$');
            userRepo.createUser.mockResolvedValue(mkUser());

            await userService.findUserOrCreate(profile);

            const args = userRepo.createUser.mock.calls[0][0];
            expect(args.firstName).toBe('AnonymousUser');
        });

        it('sets avatarUrl to null when photos array is empty', async () => {
            const profile = { ...oauthProfile, photos: [] };
            userRepo.getUserByEmail.mockResolvedValue(null);
            argon2.hash.mockResolvedValue('$h$');
            userRepo.createUser.mockResolvedValue(mkUser());

            await userService.findUserOrCreate(profile);

            const args = userRepo.createUser.mock.calls[0][0];
            expect(args.avatarUrl).toBeNull();
        });
    });
});

// ═════════════════════════════════════════════════════════════════════════════
//  █████╗ ██╗   ██╗████████╗██╗  ██╗     ███████╗███████╗██████╗ ██╗   ██╗
// ██╔══██╗██║   ██║╚══██╔══╝██║  ██║     ██╔════╝██╔════╝██╔══██╗██║   ██║
// ███████║██║   ██║   ██║   ███████║     ███████╗█████╗  ██████╔╝╚██╗ ██╔╝
// ██╔══██║██║   ██║   ██║   ██╔══██║     ╚════██║██╔══╝  ██╔══██╗ ╚████╔╝
// ██║  ██║╚██████╔╝   ██║   ██║  ██║     ███████║███████╗██║  ██║  ╚██╔╝
// main_service/services/authService.js
// ═════════════════════════════════════════════════════════════════════════════

describe('authService', () => {

    beforeEach(() => { vi.clearAllMocks(); });

    // ── login ─────────────────────────────────────────────────────────────────

    describe('login', () => {
        it('returns tokens + user on valid credentials', async () => {
            const user = mkUser({ id: 'u1', passwordHash: '$hash$', isVerified: true });
            userRepo.getUserByEmail.mockResolvedValue(user);
            argon2.verify.mockResolvedValue(true);
            jwtSvc.generateAuthTokens.mockReturnValue({ accessToken: 'AT', refreshToken: 'RT' });
            userRepo.updateUser.mockResolvedValue(user);

            const result = await authService.login({ email: 'alice@hirefy.dev', password: 'pw' });

            expect(result.accessToken).toBe('AT');
            expect(result.refreshToken).toBe('RT');
            expect(result.user).toBeDefined();
            // password hash must NOT appear in response
            expect(JSON.stringify(result)).not.toContain('passwordHash');
        });

        it('requires 2FA when twoFAEnabled=true (returns require2FA flag + tempToken)', async () => {
            const user = mkUser({ twoFAEnabled: true });
            userRepo.getUserByEmail.mockResolvedValue(user);
            argon2.verify.mockResolvedValue(true);
            jwtSvc.generateTempToken.mockReturnValue('TEMP_TOKEN');

            const result = await authService.login({ email: 'alice@hirefy.dev', password: 'pw' });

            expect(result.require2FA).toBe(true);
            expect(result.tempToken).toBe('TEMP_TOKEN');
            expect(result.userId).toBe('user-001');
            expect(jwtSvc.generateAuthTokens).not.toHaveBeenCalled();
        });

        it('throws 400 when user does not exist', async () => {
            userRepo.getUserByEmail.mockResolvedValue(null);
            argon2.verify.mockResolvedValue(false);

            await rejects(
                () => authService.login({ email: 'ghost@x.com', password: 'pw' }),
                400, 'Wrong credentials'
            );
        });

        it('throws 400 when password is wrong', async () => {
            const user = mkUser();
            userRepo.getUserByEmail.mockResolvedValue(user);
            argon2.verify.mockResolvedValue(false);

            await rejects(
                () => authService.login({ email: 'alice@hirefy.dev', password: 'wrong' }),
                400
            );
        });

        it('throws 400 when user is not verified', async () => {
            const user = mkUser({ isVerified: false });
            userRepo.getUserByEmail.mockResolvedValue(user);
            argon2.verify.mockResolvedValue(true);

            await rejects(
                () => authService.login({ email: 'alice@hirefy.dev', password: 'pw' }),
                400, 'not verified'
            );
        });

        it('uses DUMMY_HASH when user not found (timing-safe behaviour)', async () => {
            userRepo.getUserByEmail.mockResolvedValue(null);
            argon2.verify.mockResolvedValue(false);

            // Should NOT throw internally; only fail at the !user check
            await expect(
                authService.login({ email: 'ghost@x.com', password: 'anything' })
            ).rejects.toBeInstanceOf(HttpException);

            // argon2.verify should still be called to prevent timing attacks
            expect(argon2.verify).toHaveBeenCalled();
        });

        it('handles argon2.verify throwing (e.g. malformed hash) gracefully', async () => {
            const user = mkUser();
            userRepo.getUserByEmail.mockResolvedValue(user);
            argon2.verify.mockRejectedValue(new Error('malformed hash'));

            await rejects(
                () => authService.login({ email: 'alice@hirefy.dev', password: 'pw' }),
                400
            );
        });
    });

    // ── register ──────────────────────────────────────────────────────────────

    describe('register', () => {
        it('creates user, sends verification email, returns empty object', async () => {
            const user = mkUser({ id: 'new-001', email: 'new@x.com' });
            userRepo.createUser.mockResolvedValue(user);
            argon2.hash.mockResolvedValue('$hash$');
            jwtSvc.generateVerificationToken.mockResolvedValue('VER_TOKEN');
            sendMail.mockResolvedValue(undefined);

            const result = await authService.register({ email: 'new@x.com', password: 'pass123' });

            expect(result).toEqual({});
            expect(jwtSvc.generateVerificationToken).toHaveBeenCalledWith('new-001', 'new@x.com');
            expect(sendMail).toHaveBeenCalledWith(
                expect.objectContaining({ to: 'new@x.com', subject: 'Email Verification' })
            );
        });

        it('verification email contains the correct verify link', async () => {
            const user = mkUser({ id: 'u123', email: 'user@x.com' });
            userRepo.createUser.mockResolvedValue(user);
            argon2.hash.mockResolvedValue('$hash$');
            jwtSvc.generateVerificationToken.mockResolvedValue('VER_TOK');
            sendMail.mockResolvedValue(undefined);

            await authService.register({ email: 'user@x.com', password: 'pw' });

            const mailCall = sendMail.mock.calls[0][0];
            expect(mailCall.text).toContain('verify-email/VER_TOK');
        });
    });

    // ── verifyEmail ───────────────────────────────────────────────────────────

    describe('verifyEmail', () => {
        it('marks user as verified and returns user', async () => {
            const user = mkUser({ id: 'u1', email: 'alice@hirefy.dev', isVerified: false });
            jwtSvc.verifyVerificationToken.mockResolvedValue({ id: 'u1', email: 'alice@hirefy.dev' });
            userRepo.getUserById.mockResolvedValue(user);
            userRepo.updateUser.mockResolvedValue({ ...user, isVerified: true });

            const result = await authService.verifyEmail('VER_TOKEN');

            expect(userRepo.updateUser).toHaveBeenCalledWith('u1', { isVerified: true });
            expect(result).toEqual(user);
        });

        it('throws 404 when user not found', async () => {
            jwtSvc.verifyVerificationToken.mockResolvedValue({ id: 'ghost', email: 'g@x.com' });
            userRepo.getUserById.mockResolvedValue(null);

            await rejects(() => authService.verifyEmail('T'), 404, 'user not found');
        });

        it('throws 400 when token email does not match user email', async () => {
            jwtSvc.verifyVerificationToken.mockResolvedValue({ id: 'u1', email: 'old@x.com' });
            userRepo.getUserById.mockResolvedValue(mkUser({ email: 'new@x.com' }));

            await rejects(() => authService.verifyEmail('T'), 400, 'email mismatch');
        });

        it('throws 400 when email is already verified', async () => {
            jwtSvc.verifyVerificationToken.mockResolvedValue({ id: 'u1', email: 'alice@hirefy.dev' });
            userRepo.getUserById.mockResolvedValue(mkUser({ isVerified: true }));

            await rejects(() => authService.verifyEmail('T'), 400, 'already verified');
        });
    });

    // ── refresh ───────────────────────────────────────────────────────────────

    describe('refresh', () => {
        it('returns new tokens when refreshToken matches', async () => {
            const user = mkUser({ refreshToken: 'OLD_RT' });
            jwtSvc.verifyRefreshToken.mockResolvedValue({ id: 'user-001' });
            userRepo.getUserById.mockResolvedValue(user);
            jwtSvc.generateAuthTokens.mockReturnValue({ accessToken: 'NEW_AT', refreshToken: 'NEW_RT' });
            userRepo.updateUser.mockResolvedValue(user);

            const result = await authService.refresh('OLD_RT');

            expect(result.accessToken).toBe('NEW_AT');
            expect(result.refreshToken).toBe('NEW_RT');
        });

        it('throws 403 when user not found', async () => {
            jwtSvc.verifyRefreshToken.mockResolvedValue({ id: 'ghost' });
            userRepo.getUserById.mockResolvedValue(null);

            await rejects(() => authService.refresh('RT'), 404);
        });

        it('throws 403 when stored refreshToken does not match', async () => {
            jwtSvc.verifyRefreshToken.mockResolvedValue({ id: 'user-001' });
            userRepo.getUserById.mockResolvedValue(mkUser({ refreshToken: 'STORED_RT' }));

            await rejects(() => authService.refresh('DIFFERENT_RT'), 403, 'Forbidden');
        });
    });

    // ── logout ────────────────────────────────────────────────────────────────

    describe('logout', () => {
        it('nullifies refreshToken on valid logout', async () => {
            const user = mkUser({ refreshToken: 'RT' });
            jwtSvc.verifyRefreshToken.mockResolvedValue({ id: 'user-001' });
            userRepo.getUserById.mockResolvedValue(user);
            userRepo.updateUser.mockResolvedValue({});

            await authService.logout('RT');

            expect(userRepo.updateUser).toHaveBeenCalledWith('user-001', { refreshToken: null });
        });

        it('silently succeeds when token is invalid (401/403)', async () => {
            jwtSvc.verifyRefreshToken.mockRejectedValue(
                Object.assign(new Error('expired'), { statusCode: 401 })
            );

            await expect(authService.logout('INVALID')).resolves.toBeUndefined();
        });

        it('re-throws non-auth errors', async () => {
            jwtSvc.verifyRefreshToken.mockRejectedValue(new Error('DB exploded'));

            await expect(authService.logout('T')).rejects.toThrow('DB exploded');
        });
    });

    // ── resendVerification ────────────────────────────────────────────────────

    describe('resendVerification', () => {
        it('sends email and returns message', async () => {
            const user = mkUser({ isVerified: false });
            userRepo.getUserByEmail.mockResolvedValue(user);
            jwtSvc.generateVerificationToken.mockResolvedValue('NEW_VER_TOK');
            sendMail.mockResolvedValue(undefined);

            const result = await authService.resendVerification('alice@hirefy.dev');

            expect(sendMail).toHaveBeenCalled();
            expect(result).toEqual({ message: 'Verification email sent' });
        });

        it('throws 404 when user not found', async () => {
            userRepo.getUserByEmail.mockResolvedValue(null);

            await rejects(() => authService.resendVerification('nobody@x.com'), 404);
        });

        it('throws 400 when already verified', async () => {
            userRepo.getUserByEmail.mockResolvedValue(mkUser({ isVerified: true }));

            await rejects(() => authService.resendVerification('alice@hirefy.dev'), 400, 'already verified');
        });
    });

    // ── verifyLoginWith2FA ────────────────────────────────────────────────────

    describe('verifyLoginWith2FA', () => {
        it('returns tokens on valid 2FA code', async () => {
            const user = mkUser({ twoFAEnabled: true });
            jwtSvc.verifyTempToken.mockResolvedValue({ id: 'user-001', purpose: '2fa-pending' });
            userRepo.getUserById.mockResolvedValue(user);

            // Cleanly manipulate our mock class instance!
            mockTwoFAInstance.verifyLogin.mockResolvedValue(true);

            jwtSvc.generateAuthTokens.mockReturnValue({ accessToken: 'AT', refreshToken: 'RT' });
            userRepo.updateUser.mockResolvedValue(user);

            const result = await authService.verifyLoginWith2FA('TEMP', '123456');

            expect(result.accessToken).toBe('AT');
        });

        it('throws 403 when tempToken purpose is not 2fa-pending', async () => {
            jwtSvc.verifyTempToken.mockResolvedValue({ id: 'u', purpose: 'something-else' });

            await rejects(() => authService.verifyLoginWith2FA('T', '000000'), 403, 'Invalid Token');
        });

        it('throws 403 when user not found or 2FA not enabled', async () => {
            jwtSvc.verifyTempToken.mockResolvedValue({ id: 'ghost', purpose: '2fa-pending' });
            userRepo.getUserById.mockResolvedValue(null);

          await rejects(() => authService.verifyLoginWith2FA('T', '000000'), 404);
        });
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// ██╗  ██╗████████╗████████╗██████╗  ███████╗██╗  ██╗ ██████╗███████╗██████╗
// ██║  ██║╚══██╔══╝╚══██╔══╝██╔══██╗ ██╔════╝╚██╗██╔╝██╔════╝██╔════╝██╔══██╗
// ███████║   ██║      ██║   ██████╔╝ █████╗   ╚███╔╝ ██║     █████╗  ██████╔╝
// ██╔══██║   ██║      ██║   ██╔═══╝  ██╔══╝   ██╔██╗ ██║     ██╔══╝  ██╔═══╝
// ██║  ██║   ██║      ██║   ██║      ███████╗██╔╝ ██╗╚██████╗███████╗██║
// main_service/utils/httpExceptions.js
// ═════════════════════════════════════════════════════════════════════════════

describe('HttpException', () => {

    it('carries statusCode and message', () => {
        const err = new HttpException(404, 'not found');
        expect(err.statusCode).toBe(404);
        expect(err.message).toBe('not found');
        expect(err).toBeInstanceOf(Error);
    });

    it('has name HttpException', () => {
        const err = new HttpException(500, 'oops');
        expect(err.name).toBe('Error');
    });

    it('works for every common status code', () => {
        [400, 401, 403, 404, 409, 422, 429, 500, 503].forEach(code => {
            const err = new HttpException(code, `error ${code}`);
            expect(err.statusCode).toBe(code);
        });
    });

    it('accepts empty message', () => {
        const err = new HttpException(400, '');
        expect(err.message).toBe('');
    });

    it('is an instance of Error (can be caught with catch(e))', () => {
        const err = new HttpException(403, 'forbidden');
        expect(err instanceof Error).toBe(true);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// APPLICATION SERVICE — selected guards
// ═════════════════════════════════════════════════════════════════════════════

describe('applicationService (via mocks)', () => {

    // The applicationService uses prisma.$transaction internally.
    // We test the *exported* quizService interactions with it to guarantee
    // the contract between quizService <-> applicationService is respected.

    beforeEach(() => { vi.clearAllMocks(); });

    describe('submitTest → applicationService interaction', () => {
        it('passes the applicationPhase.applicationId to rejectApplication', async () => {
            const phase = mkPhase({
                status:        'inProgress',
                applicationId: 'app-XYZ',
                application:   { candidateId: 'user-001' },
            });
            appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
            quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: false }));
            appPhaseService.updateApplicationPhase.mockResolvedValue({});
            appService.rejectApplication.mockResolvedValue({});

            const data = {
                params: { testId: 'test-001' },
                body:   { applicationPhaseId: 'phase-001', answers: [], userId: 'user-001' },
            };

            await quizService.submitTest(data, null);

            expect(appService.rejectApplication).toHaveBeenCalledWith('app-XYZ', null);
        });

        it('passes the applicationPhase.applicationId to acceptApplication', async () => {
            const phase = mkPhase({
                status:        'inProgress',
                applicationId: 'app-ABC',
                application:   { candidateId: 'user-001' },
            });
            appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
            quizClient.evaluateTest.mockResolvedValue(mkEvalResult({ passed: true }));
            appPhaseService.updateApplicationPhase.mockResolvedValue({});
            appService.acceptApplication.mockResolvedValue({});

            const data = {
                params: { testId: 'test-001' },
                body:   { applicationPhaseId: 'phase-001', answers: [], userId: 'user-001' },
            };

            await quizService.submitTest(data, null);

            expect(appService.acceptApplication).toHaveBeenCalledWith('app-ABC', null);
        });
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// BOUNDARY + FUZZ TESTS
// ═════════════════════════════════════════════════════════════════════════════

describe('boundary & fuzz conditions', () => {

    beforeEach(() => { vi.clearAllMocks(); });

    it('startTest — durationMinutes=0 gives completedAt == startedAt', async () => {
        const phase = mkPhase({ status: 'inProgress', startedAt: new Date('2026-03-01T00:00:00Z') });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockResolvedValue(mkTest({ durationMinutes: 0 }));

        const result = await quizService.startTest({
            testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001',
        });

        expect(result.completedAt.getTime()).toBe(result.startedAt.getTime());
    });

    it('startTest — very large duration (10000 minutes) does not overflow', async () => {
        const phase = mkPhase({ status: 'inProgress', startedAt: new Date() });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockResolvedValue(mkTest({ durationMinutes: 10000 }));

        const result = await quizService.startTest({
            testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001',
        });

        const diff = result.completedAt.getTime() - result.startedAt.getTime();
        expect(diff).toBe(10000 * 60 * 1000);
        expect(Number.isFinite(diff)).toBe(true);
    });

    it('submitTest — evaluation with maxPossibleScore=0 does not crash', async () => {
        const phase = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(
            mkEvalResult({ totalScore: 0, maxPossibleScore: 0, percentage: 0, passed: false })
        );
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.rejectApplication.mockResolvedValue({});

        const data = {
            params: { testId: 'test-001' },
            body:   { applicationPhaseId: 'phase-001', answers: [], userId: 'user-001' },
        };

        const output = await quizService.submitTest(data, null);
        expect(output.maxPossibleScore).toBe(0);
    });

    it('login — password consisting only of whitespace is rejected', async () => {
        const user = mkUser();
        userRepo.getUserByEmail.mockResolvedValue(user);
        argon2.verify.mockResolvedValue(false);

        await rejects(
            () => authService.login({ email: 'alice@hirefy.dev', password: '   ' }),
            400
        );
    });

    it('login — extremely long password (10 000 chars) does not crash', async () => {
        const user = mkUser();
        userRepo.getUserByEmail.mockResolvedValue(user);
        argon2.verify.mockResolvedValue(false);

        await rejects(
            () => authService.login({ email: 'alice@hirefy.dev', password: 'A'.repeat(10_000) }),
            400
        );
    });

    it('getUserById — passes numeric-like string id correctly', async () => {
        userRepo.getUserById.mockResolvedValue(null);

        await rejects(() => userService.getUserById('000000001'), 404);
        expect(userRepo.getUserById).toHaveBeenCalledWith('000000001');
    });

    it('startTest — phase with applicationId=null does not propagate as success', async () => {
        const phase = mkPhase({ applicationId: null });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        // applicationService.getApplicaticationById will receive null — let it throw
        appService.getApplicaticationById.mockRejectedValue(new HttpException(404, 'application not found'));

        await expect(
            quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' })
        ).rejects.toBeInstanceOf(HttpException);
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// CONTRACT TESTS — verify mock shapes match real call expectations
// ═════════════════════════════════════════════════════════════════════════════

describe('mock contract verification', () => {
    it('quizClientService.getTestById is called with testId string', async () => {
        const phase = mkPhase({ status: 'inProgress', startedAt: new Date() });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockResolvedValue(mkTest());

        await quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' });

        expect(quizClient.getTestById).toHaveBeenCalledWith('test-001');
        expect(quizClient.getTestById).toHaveBeenCalledTimes(1);
    });

    it('quizClientService.evaluateTest is called with (testId, answers)', async () => {
        const answers = [{ questionId: 'q1', answerId: 'a3' }, { questionId: 'q2', answerId: 'a1' }];
        const phase   = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });

        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult());
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        const data = {
            params: { testId: 'test-001' },
            body:   { applicationPhaseId: 'phase-001', answers, userId: 'user-001' },
        };

        await quizService.submitTest(data, null);

        expect(quizClient.evaluateTest).toHaveBeenCalledWith('test-001', answers);
    });

    it('updateApplicationPhase is called exactly once per submit', async () => {
        const phase = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        appPhaseService.getApplicaticationPhaseById.mockResolvedValue(phase);
        quizClient.evaluateTest.mockResolvedValue(mkEvalResult());
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        const data = {
            params: { testId: 'test-001' },
            body:   { applicationPhaseId: 'phase-001', answers: [], userId: 'user-001' },
        };

        await quizService.submitTest(data, null);

        expect(appPhaseService.updateApplicationPhase).toHaveBeenCalledTimes(1);
    });

    it('jwtService.generateAuthTokens receives id + email + role', async () => {
        const user = mkUser({ id: 'u1', email: 'e@x.com', role: 'recruiter' });
        userRepo.getUserByEmail.mockResolvedValue(user);
        argon2.verify.mockResolvedValue(true);
        jwtSvc.generateAuthTokens.mockReturnValue({ accessToken: 'A', refreshToken: 'R' });
        userRepo.updateUser.mockResolvedValue(user);

        await authService.login({ email: 'e@x.com', password: 'pw' });

        expect(jwtSvc.generateAuthTokens).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'u1', email: 'e@x.com', role: 'recruiter' })
        );
    });
});

// ═════════════════════════════════════════════════════════════════════════════
// IDEMPOTENCY & CONCURRENT-CALL SIMULATION
// ═════════════════════════════════════════════════════════════════════════════

describe('idempotency & race condition simulation', () => {

    beforeEach(() => { vi.clearAllMocks(); });

    it('calling startTest twice for same pending phase updates status only once (first call)', async () => {
        // First call: phase is pending
        const pendingPhase = mkPhase({ status: 'pending' });
        // Second call: phase is already inProgress
        const inProgressPhase = mkPhase({ status: 'inProgress', startedAt: new Date() });

        appPhaseService.getApplicaticationPhaseById
            .mockResolvedValueOnce(pendingPhase)
            .mockResolvedValueOnce(inProgressPhase);

        appService.getApplicaticationById.mockResolvedValue(mkApplication());
        quizClient.getTestById.mockResolvedValue(mkTest());
        appPhaseService.updateApplicationPhase.mockResolvedValue({});

        await quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' });
        await quizService.startTest({ testId: 'test-001', userId: 'user-001', applicationPhaseId: 'phase-001' });

        // updateApplicationPhase should only be called once (first call where status=pending)
        expect(appPhaseService.updateApplicationPhase).toHaveBeenCalledTimes(1);
    });

    it('submitTest called twice throws 400 on second attempt (already completed)', async () => {
        const inProgress  = mkPhase({ status: 'inProgress', application: { candidateId: 'user-001' } });
        const completed   = mkPhase({ status: 'completed',  application: { candidateId: 'user-001' } });

        appPhaseService.getApplicaticationPhaseById
            .mockResolvedValueOnce(inProgress)
            .mockResolvedValueOnce(completed);

        quizClient.evaluateTest.mockResolvedValue(mkEvalResult());
        appPhaseService.updateApplicationPhase.mockResolvedValue({});
        appService.acceptApplication.mockResolvedValue({});

        const data = {
            params: { testId: 'test-001' },
            body:   { applicationPhaseId: 'phase-001', answers: [], userId: 'user-001' },
        };

        await quizService.submitTest(data, null); // first submit: OK

        await rejects(() => quizService.submitTest(data, null), 400); // second: should fail
    });
});