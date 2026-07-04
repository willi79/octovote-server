import cors from 'cors';
import express, { Express, Request, Response } from 'express';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { CandidateRepository } from './repository/candidate.repository';
import { UserController } from './controller/user.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';
import { VoteController } from './controller/vote.controller';
import { VoteService } from './service/vote.service';
import { createAuthRouter } from './route/auth.route';
import { createUserRouter } from './route/user.route';
import { createVoteRouter } from './route/vote.route';
import { env } from './config/environment';

export const createApp = (): Express => {
    const app: Express = express();

    // middleware
    app.use(
        cors({
            origin: env.corsOrigin,
        })
    );
    app.use(express.json());

    // repositories
    const userRepository = new UserRepository();
    const candidateRepository = new CandidateRepository();

    // services
    const voteService = new VoteService(candidateRepository, userRepository);
    const userService = new UserService(userRepository);
    const authService = new AuthService(userRepository);

    // controllers
    const voteController = new VoteController(voteService);
    const userController = new UserController(userService);
    const authController = new AuthController(authService);

    // routes
    app.use('/api/vote', createVoteRouter(voteController));
    app.use('/api/user', createUserRouter(userController));
    app.use('/api/auth', createAuthRouter(authController));

    // health check
    app.get('/health', (_req: Request, res: Response) => {
        res.status(200).json({ status: 'ok' });
    });

    // 404 fallback
    app.use((_req: Request, res: Response) => {
        res.status(404).json({ message: 'Not found' });
    });

    return app;
};
