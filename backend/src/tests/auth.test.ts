import request from 'supertest';
import express from 'express';
import * as admin from 'firebase-admin';

interface FirebaseAuthError extends Error {
    code?: string;
}

// --- Mock firebase-admin --- 
const mockCreateUser = jest.fn();
const mockSet = jest.fn();
const mockDoc = jest.fn(() => ({ set: mockSet }));
const mockCollection = jest.fn(() => ({ doc: mockDoc }));
const mockServerTimestamp = jest.fn(() => Date.now());

// Mock the function call admin.firestore()
const mockFirestoreInstance = {
    collection: mockCollection,
};

// Attach static properties like FieldValue to the function mock itself
interface FirestoreMock extends jest.Mock {
    FieldValue?: {
        serverTimestamp: () => number;
    };
}

const firestoreMockFn: FirestoreMock = jest.fn(() => mockFirestoreInstance);
firestoreMockFn.FieldValue = {
    serverTimestamp: mockServerTimestamp
};

jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn(),
    },
    // Use the mock function (with properties attached) for firestore
    firestore: firestoreMockFn,
    auth: jest.fn(() => ({
        createUser: mockCreateUser,
    }))
}));
// ------------------------

// Import the app after mocking
import app from '../server';

// Define a type for the user record mock if needed
interface MockUserRecord {
    uid: string;
    email?: string;
    displayName?: string;
}

describe('POST /api/auth/signup', () => {

    // Clear mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Also clear the mock function calls history if needed, e.g.:
        mockCreateUser.mockClear();
        mockSet.mockClear();
        mockDoc.mockClear();
        mockCollection.mockClear();
        mockServerTimestamp.mockClear();
        firestoreMockFn.mockClear();
    });

    const userData = {
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
    };

    it('should create a new user successfully', async () => {
        // Arrange: Configure mock to return a user record
        const mockUser: MockUserRecord = {
            uid: 'test-uid-123',
            email: userData.email,
            displayName: userData.displayName
        };
        mockCreateUser.mockResolvedValue(mockUser);
        mockSet.mockResolvedValue({}); // Firestore set resolves successfully

        // Act: Send request to the signup endpoint
        const response = await request(app)
            .post('/api/auth/signup')
            .send(userData);

        // Assert: Check response and mock calls
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
            uid: mockUser.uid,
            email: mockUser.email,
            displayName: mockUser.displayName
        });

        // Verify Firebase Auth call
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockCreateUser).toHaveBeenCalledWith({
            email: userData.email,
            password: userData.password,
            displayName: userData.displayName
        });

        // Verify Firestore call
        // expect(firestoreMockFn).toHaveBeenCalledTimes(1); // This call happens at module load, before beforeEach clears mocks
        expect(mockCollection).toHaveBeenCalledWith('users');
        expect(mockDoc).toHaveBeenCalledWith(mockUser.uid);
        expect(mockSet).toHaveBeenCalledTimes(1);
        // Check the structure of the data passed to set
        expect(mockServerTimestamp).toHaveBeenCalledTimes(1); // Verify timestamp was called
        expect(mockSet).toHaveBeenCalledWith({
            email: mockUser.email,
            displayName: mockUser.displayName,
            createdAt: expect.any(Number) // Check createdAt used the mocked Date
        });
    });

    it('should return 400 if required fields are missing', async () => {
        const incompleteData = { email: 'incomplete@example.com', password: 'pw' };
        const response = await request(app).post('/api/auth/signup').send(incompleteData);
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatch(/Missing required fields/i);
        expect(mockCreateUser).not.toHaveBeenCalled();
        expect(mockSet).not.toHaveBeenCalled();
    });

    it('should return 409 if email already exists', async () => {
        const emailExistsError: FirebaseAuthError = new Error('Email already exists.');
        emailExistsError.code = 'auth/email-already-exists';
        mockCreateUser.mockRejectedValue(emailExistsError);
        const response = await request(app).post('/api/auth/signup').send(userData);
        expect(response.statusCode).toBe(409);
        expect(response.body.message).toMatch(/Email already in use/i);
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockSet).not.toHaveBeenCalled();
    });

    it('should return 500 for other Firebase errors', async () => {
        const genericError = new Error('Firebase internal error');
        mockCreateUser.mockRejectedValue(genericError);
        const response = await request(app).post('/api/auth/signup').send(userData);
        expect(response.statusCode).toBe(500);
        expect(response.body.message).toMatch(/Internal server error during signup/i);
        expect(mockCreateUser).toHaveBeenCalledTimes(1);
        expect(mockSet).not.toHaveBeenCalled();
    });

}); 