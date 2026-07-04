import { IBaseRepository } from './i-base.repository';
import { CandidateInterface } from '../model/candidate';

export interface CreateCandidateDto {
    name: string;
}

export interface UpdateCandidateDto {
    name?: string;
    votes?: number;
}

export interface ICandidateRepository extends IBaseRepository<CandidateInterface> {
    incrementOrCreateCandidate(name?: string): Promise<CandidateInterface>;
    create(dto: CreateCandidateDto): Promise<CandidateInterface>;
    update(id: string, dto: UpdateCandidateDto): Promise<CandidateInterface | null>;
}
