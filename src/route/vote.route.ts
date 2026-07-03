import { Request, Response, Router } from 'express';

import { VoteController } from '../controller/vote.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../model/user';

export const createVoteRouter = (voteController: VoteController) => {
    const router: Router = Router();

    router.get('/candidates', requireAuth, (req: Request, res: Response): Promise<void> =>
        voteController.getCandidates(req, res)
    );
    router.post('/', requireAuth, requireRole([UserRole.User]), (req: Request, res: Response): Promise<void> =>
        voteController.castVote(req, res)
    );
    router.get('/results', requireAuth, requireRole([UserRole.Admin]), (req: Request, res: Response): Promise<void> =>
        voteController.getResults(req, res)
    );

    return router;
};
