import request from 'supertest';

import { UserRole } from '../../src/model/user';
import { createApp } from '../../src/app';
import { signToken } from '../../src/util/jwt.util';

const app = createApp();

const adminToken = signToken({ id: 'admin123', role: UserRole.Admin });
const userToken = signToken({ id: 'user123', role: UserRole.User });

describe('GET /api/user', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/api/user');
        expect(res.status).toBe(401);
    });

    it('should return 403 if not admin', async () => {
        const res = await request(app).get('/api/user').set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it('should return all users for admin', async () => {
        const res = await request(app).get('/api/user').set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.users).toBeDefined();
    });
});

describe('POST /api/user', () => {
    it('should create a user successfully', async () => {
        const res = await request(app).post('/api/user').set('Authorization', `Bearer ${adminToken}`).send({
            name: 'Bob',
            email: 'bob@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(201);
        expect(res.body.user.email).toBe('bob@example.com');
    });

    it('should return 400 if email already exists', async () => {
        await request(app).post('/api/user').set('Authorization', `Bearer ${adminToken}`).send({
            name: 'Bob',
            email: 'bob@example.com',
            password: 'password123',
        });

        const res = await request(app).post('/api/user').set('Authorization', `Bearer ${adminToken}`).send({
            name: 'Bob',
            email: 'bob@example.com',
            password: 'password123',
        });

        expect(res.status).toBe(400);
    });
});

describe('PATCH /api/user/:id', () => {
    it('should update a user successfully', async () => {
        const created = await request(app).post('/api/user').set('Authorization', `Bearer ${adminToken}`).send({
            name: 'Charlie',
            email: 'charlie@example.com',
            password: 'password123',
        });

        const userId = created.body.user._id;

        const res = await request(app)
            .patch(`/api/user/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Charlie Updated' });

        expect(res.status).toBe(200);
        expect(res.body.user.name).toBe('Charlie Updated');
    });
});

describe('DELETE /api/user/:id', () => {
    it('should delete a user successfully', async () => {
        const created = await request(app).post('/api/user').set('Authorization', `Bearer ${adminToken}`).send({
            name: 'Dave',
            email: 'dave@example.com',
            password: 'password123',
        });

        const userId = created.body.user._id;

        const res = await request(app).delete(`/api/user/${userId}`).set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('User deleted successfully');
    });
});
