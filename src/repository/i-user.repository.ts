import { IBaseRepository } from './i-base.repository';
import { UserInterface } from '../model/user';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
}

export interface IUserRepository extends IBaseRepository<UserInterface> {
    markVoted(id: string, candidateId: string): Promise<void>;
    create(dto: CreateUserDto): Promise<UserInterface>;
    update(id: string, dto: UpdateUserDto): Promise<UserInterface | null>;
}
