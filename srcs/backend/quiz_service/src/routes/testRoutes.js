import express from 'express'
import * as testController from '../controllers/testController.js'
import validateRequest from '../middleware/ValidateRequest.js';
import {createTestschema, updateTestschema} from '../validators/testValidator.js'

const router = express.Router();

/**
 * @swagger
 * /tests/{id}:
 *   get:
 *     summary: Get a test by ID
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Test found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Test'
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: Test not found
 */

/**
 * @swagger
 * /tests:
 *   get:
 *     summary: Get all tests
 *     tags: [Tests]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of tests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Test'
 *       401:
 *         description: Missing or invalid API key
 */

/**
 * @swagger
 * /tests:
 *   post:
 *     summary: Create a new test
 *     tags: [Tests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *           example:
 *             type: "QUIZ"
 *             title: "JavaScript Fundamentals"
 *             description: "Test your JS knowledge"
 *             durationMinutes: 30
 *             passingScore: 70
 *             difficulty: "MEDIUM"
 *             category: "JavaScript"
 *             mcqIds:
 *               - "uuid-of-mcq-1"
 *               - "uuid-of-mcq-2"
 *     responses:
 *       201:
 *         description: Test created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid API key
 */

/**
 * @swagger
 * /tests/{id}:
 *   patch:
 *     summary: Partially update a test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Test'
 *           example:
 *             title: "Updated Title"
 *             passingScore: 80
 *     responses:
 *       200:
 *         description: Test updated
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: Test not found
 */

/**
 * @swagger
 * /tests/{id}:
 *   delete:
 *     summary: Delete a test
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Test deleted
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: Test not found
 */

router.get('/:id', testController.getTestById)
    .get('/', testController.getTests)
    .post('/', validateRequest(createTestschema),
        testController.createTest)
    .patch('/:id', validateRequest(updateTestschema),
        testController.updateTest)
    .delete('/:id', testController.deleteTest)

export default router;