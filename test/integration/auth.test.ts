import request from 'supertest';

import { createApp } from '../../src/app';

const app = createApp();

describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('alice@example.com');
        expect(res.body.user.role).toBe('user');
        expect(res.body.user.password).toBeUndefined();
    });

    it('should return 400 if email already exists', async () => {
        await request(app).post('/api/auth/register').send({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
        });

        const res = await request(app).post('/api/auth/register').send({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Email already exists');
    });

    it('should return 400 if name is missing', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'alice@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(400);
    });
});

describe('POST /api/auth/login', () => {
    beforeEach(async () => {
        await request(app).post('/api/auth/register').send({
            name: 'Alice',
            email: 'alice@example.com',
            password: 'password123',
        });
    });

    it('should login and return token', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'alice@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should return 400 for wrong password', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'alice@example.com',
            password: 'wrongpassword',
        });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid password');
    });

    it('should return 400 for unknown email', async () => {
        const res = await request(app).post('/api/auth/login').send({
            email: 'nobody@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('Invalid email');
    });
});
