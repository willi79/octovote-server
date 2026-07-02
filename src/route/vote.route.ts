import { Request, Response, Router } from 'express';

import { VoteController } from '../controller/vote.controller';

export const createVoteRouter = (voteController: VoteController) => {
    const router: Router = Router();

    router.get('/candidates', (req: Request, res: Response): Promise<void> => voteController.getCandidates(req, res));
    router.post('/:userId', (req: Request, res: Response): Promise<void> => voteController.castVote(req, res));
    router.get('/results', (req: Request, res: Response): Promise<void> => voteController.getResults(req, res));

    return router;
};
