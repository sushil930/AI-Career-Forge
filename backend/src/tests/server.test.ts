import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Temporarily commented out server import and related code for debugging

describe('Simple Test Suite', () => {
    it('should pass a simple test', () => {
        expect(1 + 1).toBe(2);
    });
});

describe('GET / - Basic Server Test', () => {
    let app: express.Express;

    beforeAll(async () => {
        try {
            // Refined Mock for Firebase Admin SDK 
            jest.mock('firebase-admin', () => ({
                initializeApp: jest.fn(),
                credential: {
                    cert: jest.fn(),
                },
                // Return mock objects for chained calls if any occur during import
                firestore: jest.fn(() => ({
                    collection: jest.fn(() => ({ doc: jest.fn(), add: jest.fn() })),
                    FieldValue: { serverTimestamp: jest.fn() }
                })),
                auth: jest.fn(() => ({
                    createUser: jest.fn(),
                    verifyIdToken: jest.fn(),
                }))
            }));

            // Ensure dotenv runs for potential env vars needed by server during import
            // (Although firebase init is mocked, other parts might use process.env)

            const serverModule = await import('../server');
            app = serverModule.default;
        } catch (err) {
            console.error("Failed to import server for testing:", err);
            throw err;
        }
    });

    it('should respond with the welcome message', async () => {
        if (!app) throw new Error("App not initialized for testing");
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('AI Resume Pro Backend is running!');
    });
}); 