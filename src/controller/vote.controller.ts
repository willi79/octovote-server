import { Request, Response } from 'express';

import { VoteService } from '../service/vote.service';
import { CandidateInterface } from '../model/candidate';
import { VoteResults } from '../interface/vote.interface';

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

    async castVote(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            const userId: string = req.params.userId;
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
