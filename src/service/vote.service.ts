import { isEmpty } from 'lodash';

import { CandidateInterface } from '../model/candidate';
import { ICandidateRepository } from '../repository/i-candidate.repository';
import { IUserRepository } from '../repository/i-user.repository';
import { UserInterface } from '../model/user';
import { VoteResults } from '../interface/vote.interface';

export class VoteService {
    constructor(
        private readonly candidateRepository: ICandidateRepository,
        private readonly userReposiory: IUserRepository
    ) {}

    async getCandidates(): Promise<CandidateInterface[]> {
        return this.candidateRepository.findAll();
    }

    async castVote(userId: string, name: string): Promise<CandidateInterface> {
        if (isEmpty(name) || isEmpty(name.trim())) {
            throw new Error('Candidate name is required');
        }

        const user: UserInterface | null = await this.userReposiory.findById(userId);
        if (isEmpty(user)) {
            throw new Error('User not found');
        }

        if (user.hasVoted) {
            throw new Error('User has already voted');
        }

        const candidate: CandidateInterface = await this.candidateRepository.incrementOrCreateCandidate(name);
        await this.userReposiory.markVoted(userId, candidate._id.toString());
        return candidate;
    }

    async getResults(): Promise<VoteResults> {
        const results: CandidateInterface[] = await this.candidateRepository.findAll();
        const totalVotes: number = results.reduce((sum: number, c: CandidateInterface): number => sum + c.votes, 0);
        return { totalVotes, results };
    }
}
