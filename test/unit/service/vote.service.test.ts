import { ICandidateRepository } from '../../../src/repository/i-candidate.repository';
import { IUserRepository } from '../../../src/repository/i-user.repository';
import { VoteService } from '../../../src/service/vote.service';

const mockCandidateRepository: jest.Mocked<ICandidateRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    incrementOrCreateCandidate: jest.fn(),
};

const mockUserRepository: jest.Mocked<IUserRepository> = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    markVoted: jest.fn(),
};

describe('VoteService', () => {
    let voteService: VoteService;

    beforeEach(() => {
        jest.clearAllMocks();
        voteService = new VoteService(mockCandidateRepository, mockUserRepository);
    });

    // -------------------------------------------------------------------
    describe('getCandidates', () => {
        it('should return all candidates', async () => {
            const candidates = [
                { _id: '1', name: 'Alice', votes: 3 },
                { _id: '2', name: 'Bob', votes: 1 },
            ];
            mockCandidateRepository.findAll.mockResolvedValue(candidates as any);

            const result = await voteService.getCandidates();

            expect(mockCandidateRepository.findAll).toHaveBeenCalledTimes(1);
            expect(result).toEqual(candidates);
        });

        it('should return empty array when no candidates exist', async () => {
            mockCandidateRepository.findAll.mockResolvedValue([]);

            const result = await voteService.getCandidates();

            expect(result).toEqual([]);
        });
    });

    // -------------------------------------------------------------------
    describe('castVote', () => {
        const mockUser = { _id: '123', name: 'Jane', hasVoted: false };
        const mockCandidate = { _id: 'c1', name: 'Alice', votes: 4 };

        it('should cast a vote successfully', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser as any);
            mockCandidateRepository.incrementOrCreateCandidate.mockResolvedValue(mockCandidate as any);

            const result = await voteService.castVote('123', 'Alice');

            expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
            expect(mockCandidateRepository.incrementOrCreateCandidate).toHaveBeenCalledWith('Alice');
            expect(mockUserRepository.markVoted).toHaveBeenCalledWith('123', 'c1');
            expect(result).toEqual(mockCandidate);
        });

        it('should throw if user not found', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(voteService.castVote('999', 'Alice')).rejects.toThrow('User not found');
        });

        it('should throw if user has already voted', async () => {
            mockUserRepository.findById.mockResolvedValue({ ...mockUser, hasVoted: true } as any);

            await expect(voteService.castVote('123', 'Alice')).rejects.toThrow('User has already voted');
        });

        it('should throw if candidate name is empty', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser as any);

            await expect(voteService.castVote('123', '   ')).rejects.toThrow('Candidate name is required');
        });
    });

    // -------------------------------------------------------------------
    describe('getResults', () => {
        it('should return total votes and candidate breakdown', async () => {
            const candidates = [
                { _id: 'c1', name: 'Alice', votes: 5 },
                { _id: 'c2', name: 'Bob', votes: 3 },
            ];
            mockCandidateRepository.findAll.mockResolvedValue(candidates as any);

            const result = await voteService.getResults();

            expect(result.totalVotes).toBe(8);
            expect(result.results).toEqual(candidates);
        });

        it('should return zero total when no votes exist', async () => {
            mockCandidateRepository.findAll.mockResolvedValue([]);

            const result = await voteService.getResults();

            expect(result.totalVotes).toBe(0);
            expect(result.results).toEqual([]);
        });
    });
});
