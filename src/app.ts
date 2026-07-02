import express, { Express, Request, Response } from 'express';
import { UserRepository } from './repository/user.repository';
import { CandidateRepository } from './repository/candidate.repository';
import { VoteService } from './service/vote.service';
import { UserService } from './service/user.service';
import { VoteController } from './controller/vote.controller';
import { UserController } from './controller/user.controller';
import { createVoteRouter } from './route/vote.route';
import { createUserRouter } from './route/user.route';

export const createApp = (): Express => {
    const app: Express = express();

    // middleware
    app.use(express.json());

    // repositories
    const userRepository = new UserRepository();
    const candidateRepository = new CandidateRepository();

    // services
    const voteService = new VoteService(candidateRepository, userRepository);
    const userService = new UserService(userRepository);

    // controllers
    const voteController = new VoteController(voteService);
    const userController = new UserController(userService);

    // routes
    app.use('/api/vote', createVoteRouter(voteController));
    app.use('/api/user', createUserRouter(userController));

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
