import express from 'express'
import * as mcqController from '../controllers/mcqController.js'
import validateRequest from '../middleware/ValidateRequest.js'
import {createMcqSchema,updateMcqSchema} from '../validators/mcqValidator.js'
const router =  express.Router();

/**
 * @swagger
 * /mcqs/{id}:
 *   get:
 *     summary: Get an MCQ by ID
 *     tags: [MCQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The MCQ ID
 *     responses:
 *       200:
 *         description: MCQ found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Mcq'
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: MCQ not found
 */

/**
 * @swagger
 * /mcqs:
 *   get:
 *     summary: Get all MCQs
 *     tags: [MCQs]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of records to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records to return
 *     responses:
 *       200:
 *         description: List of MCQs
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
 *                     $ref: '#/components/schemas/Mcq'
 *       401:
 *         description: Missing or invalid API key
 */

/**
 * @swagger
 * /mcqs:
 *   post:
 *     summary: Create a new MCQ
 *     tags: [MCQs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Mcq'
 *           example:
 *             question: "What is a closure in JavaScript?"
 *             choices:
 *               - id: "A"
 *                 text: "A way to close files"
 *                 isCorrect: false
 *               - id: "B"
 *                 text: "A function with access to its outer scope"
 *                 isCorrect: true
 *               - id: "C"
 *                 text: "A loop structure"
 *                 isCorrect: false
 *               - id: "D"
 *                 text: "An error handler"
 *                 isCorrect: false
 *             points: 2
 *             category: "JavaScript"
 *             difficulty: "MEDIUM"
 *             tags: ["closure", "scope"]
 *     responses:
 *       201:
 *         description: MCQ created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid API key
 */

/**
 * @swagger
 * /mcqs/{id}:
 *   put:
 *     summary: Replace an MCQ entirely
 *     tags: [MCQs]
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
 *             $ref: '#/components/schemas/Mcq'
 *     responses:
 *       200:
 *         description: MCQ replaced
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: MCQ not found
 */

/**
 * @swagger
 * /mcqs/{id}:
 *   patch:
 *     summary: Partially update an MCQ
 *     tags: [MCQs]
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
 *             $ref: '#/components/schemas/Mcq'
 *           example:
 *             points: 5
 *             difficulty: "HARD"
 *     responses:
 *       200:
 *         description: MCQ updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: MCQ not found
 */

/**
 * @swagger
 * /mcqs/{id}:
 *   delete:
 *     summary: Delete an MCQ
 *     tags: [MCQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: MCQ deleted
 *       401:
 *         description: Missing or invalid API key
 *       404:
 *         description: MCQ not found
 */

router.get('/:id', mcqController.getMcqById)
    .get('/', mcqController.getManyMcqs)
    .post('/',
        validateRequest(createMcqSchema),
        mcqController.createMcq)
    .patch('/:id',
        validateRequest(updateMcqSchema),
        mcqController.updateMcq)
    .delete('/:id', mcqController.deleteMcq);

export default router;