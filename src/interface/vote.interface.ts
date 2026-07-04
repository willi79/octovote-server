import { CandidateInterface } from '../model/candidate';

export interface VoteResults {
    totalVotes: number;
    results: CandidateInterface[];
}
