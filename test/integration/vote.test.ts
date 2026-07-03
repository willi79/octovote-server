import request from 'supertest';

import { createApp } from '../../src/app';
import { signToken } from '../../src/util/jwt.util';
import { UserRole } from '../../src/model/user';

const app = createApp();

const userToken = signToken({ id: 'user123', role: UserRole.User });
const adminToken = signToken({ id: 'admin123', role: UserRole.Admin });

describe('GET /api/vote/candidates', () => {
    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get('/api/vote/candidates');
        expect(res.status).toBe(401);
    });

    it('should return candidates list', async () => {
        const res = await request(app).get('/api/vote/candidates').set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(200);
        expect(res.body.candidates).toEqual([]);
    });
});

describe('POST /api/vote', () => {
    let userId: string;
    let token: string;

    beforeEach(async () => {
        const res = await request(app).post('/api/auth/register').send({
            name: 'Voter',
            email: 'voter@example.com',
            password: 'password123',
        });

        userId = res.body.user._id;
        token = res.body.token;
    });

    it('should cast a vote successfully', async () => {
        const res = await request(app)
            .post('/api/vote')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Alice' });

        expect(res.status).toBe(201);
        expect(res.body.candidate.name).toBe('Alice');
        expect(res.body.candidate.votes).toBe(1);
    });

    it('should return 500 if user votes twice', async () => {
        await request(app).post('/api/vote').set('Authorization', `Bearer ${token}`).send({ name: 'Alice' });

        const res = await request(app)
            .post('/api/vote')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Alice' });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('User has already voted');
    });

    it('should return 401 if not authenticated', async () => {
        const res = await request(app).post('/api/vote').send({ name: 'Alice' });

        expect(res.status).toBe(401);
    });

    it('should return 403 if admin tries to vote', async () => {
        const res = await request(app)
            .post('/api/vote')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Alice' });

        expect(res.status).toBe(403);
    });
});

describe('GET /api/vote/results', () => {
    it('should return 403 if user tries to get results', async () => {
        const res = await request(app).get('/api/vote/results').set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });

    it('should return results for admin', async () => {
        const res = await request(app).get('/api/vote/results').set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.totalVotes).toBe(0);
        expect(res.body.results).toEqual([]);
    });
});
