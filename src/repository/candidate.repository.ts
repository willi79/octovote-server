import { Candidate, CandidateInterface } from '../model/candidate';
import { CreateCandidateDto, ICandidateRepository, UpdateCandidateDto } from './i-candidate.repository';
import { StringHelper } from '../helper/string.helper';

export class CandidateRepository implements ICandidateRepository {
    async findById(id: string): Promise<CandidateInterface | null> {
        return Candidate.findById(id);
    }

    async findAll(): Promise<CandidateInterface[]> {
        return Candidate.find().sort({ votes: -1, name: 1 });
    }

    async findByName(name: string): Promise<CandidateInterface | null> {
        return Candidate.findOne({
            name: new RegExp(`^${StringHelper.escapeRegex(name)}$`, 'i'),
        });
    }

    async create(dto: CreateCandidateDto): Promise<CandidateInterface> {
        return Candidate.create(dto);
    }

    async update(id: string, dto: UpdateCandidateDto): Promise<CandidateInterface | null> {
        return Candidate.findByIdAndUpdate(id, dto, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await Candidate.findByIdAndDelete(id);
        return result !== null;
    }

    async incrementOrCreateCandidate(name: string): Promise<CandidateInterface> {
        const trimmed = name.trim();
        return Candidate.findOneAndUpdate(
            { name: new RegExp(`^${StringHelper.escapeRegex(trimmed)}$`, 'i') },
            { $inc: { votes: 1 }, $setOnInsert: { name: trimmed } },
            { new: true, upsert: true }
        ) as Promise<CandidateInterface>;
    }
}
