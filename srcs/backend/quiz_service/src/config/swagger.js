import { Component } from 'react';
import swaggerJSDoc from 'swagger-jsdoc';

const options =  {
    definition : {
        openapi : '3.0.0',
        info : {
            title : 'Quiz Service Api',
            version : '1.0.0',
            description : 'Public API for managing MCQs and Tests. Authenticate with an API key via the `x-api-key` header.',
        },
        servers : [{
            url : '/api',
            description : 'API base path'
        }],
        components : {

            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                    description: 'Public API Key'
                }
            },
            schemas : {
                // ── Choice (used inside MCQ) ───────────────
                Choice: {
                    type: 'object',
                    required: ['id', 'text', 'isCorrect'],
                    properties: {
                        id:        { type: 'string', enum: ['A', 'B', 'C', 'D'] },
                        text:      { type: 'string', minLength: 1 },
                        isCorrect: { type: 'boolean' },
                    },
                 },
                // ── MCQ ────────────────────────────────────
                Mcq: {
                    type: 'object',
                    required: ['question', 'choices', 'category', 'difficulty'],
                    properties: {
                        id:          { type: 'string', format: 'uuid', readOnly: true },
                        question:    { type: 'string', minLength: 1 },
                        choices: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Choice' },
                            minItems: 4,
                            maxItems: 4,
                        },
                        points:      { type: 'integer', default: 1, minimum: 1 },
                        explanation: { type: 'string', nullable: true },
                        category:    { type: 'string', maxLength: 100 },
                        difficulty:  { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
                        tags:        { type: 'array', items: { type: 'string' }, nullable: true },
                        isPublished: { type: 'boolean', default: false },
                        createdAt:   { type: 'string', format: 'date-time', readOnly: true },
                        updatedAt:   { type: 'string', format: 'date-time', readOnly: true },
                    },
                },
                // ── Test (QUIZ type) ───────────────────────
                Test: {
                    type: 'object',
                    required: ['type', 'title', 'durationMinutes', 'difficulty'],
                    properties: {
                        id:              { type: 'string', format: 'uuid', readOnly: true },
                        type:            { type: 'string', enum: ['QUIZ', 'CODE'] },
                        title:           { type: 'string', minLength: 3, maxLength: 255 },
                        description:     { type: 'string', nullable: true },
                        durationMinutes: { type: 'integer', minimum: 1 },
                        passingScore:    { type: 'integer', minimum: 50, maximum: 100, default: 60 },
                        category:        { type: 'string', nullable: true },
                        difficulty:      { type: 'string', enum: ['EASY', 'MEDIUM', 'HARD'] },
                        tags:            { type: 'array', items: { type: 'string' }, nullable: true },
                        isPublished:     { type: 'boolean', default: false },
                        mcqIds:          { type: 'array', items: { type: 'string', format: 'uuid' }, description: 'Required when type is QUIZ' },
                        codeId:          { type: 'string', format: 'uuid', description: 'Required when type is CODE' },
                        createdAt:       { type: 'string', format: 'date-time', readOnly: true },
                        updatedAt:       { type: 'string', format: 'date-time', readOnly: true },
                    },
                },
                // ── Generic error ──────────────────────────
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        errors:  { type: 'array', items: { type: 'string' } },
                    },
                },
        },
    },
    security: [{ ApiKeyAuth: [] }],
},
apis: ['./src/routes/*.js'],
}
export const swaggerSpec = swaggerJSDoc(options);