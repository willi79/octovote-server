import { ICandidateRepository } from './i-candidate.repository';
import { CreateUserDto, IUserRepository, UpdateUserDto } from './i-user.repository';
import { User, UserInterface } from '../model/user';
import { StringHelper } from '../helper/string.helper';

export class UserRepository implements IUserRepository {
    async findById(id: string): Promise<UserInterface | null> {
        return User.findById(id);
    }

    async findAll(): Promise<UserInterface[]> {
        return User.find();
    }

    async findByName(name: string): Promise<UserInterface | null> {
        return User.findOne({
            name: new RegExp(`^${StringHelper.escapeRegex(name)}$`, 'i'),
        });
    }

    async create(dto: CreateUserDto): Promise<UserInterface> {
        return User.create(dto);
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserInterface | null> {
        return User.findByIdAndUpdate(id, dto, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    }

    async markVoted(id: string, candidateId: string): Promise<void> {
        await User.findByIdAndUpdate(id, {
            hasVoted: true,
            votedFor: candidateId,
        });
    }
}
