import { Request, Response } from 'express';

import { VoteService } from '../service/vote.service';
import { CandidateInterface } from '../model/candidate';
import { VoteResults } from '../interface/vote.interface';
import { AuthenticatedRequest } from '../interface/auth.interface';

export class VoteController {
    constructor(private readonly voteService: VoteService) {}

    async getCandidates(req: Request, res: Response) {
        try {
            const candidates: CandidateInterface[] = await this.voteService.getCandidates();
            res.status(200).json({ candidates });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async castVote(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const userId: string = req.user!.id;
            const { name } = req.body;
            const candidate: CandidateInterface = await this.voteService.castVote(userId, name);
            res.status(201).json({ candidate });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getResults(req: Request, res: Response): Promise<void> {
        try {
            const results: VoteResults = await this.voteService.getResults();
            res.status(200).json(results);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
