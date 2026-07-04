import {IBaseRepository} from './i-base.repository';
import {UserInterface, UserRole} from '../model/user';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
}

export interface IUserRepository extends IBaseRepository<UserInterface> {
    findByEmail(email: string): Promise<UserInterface | null>;
    markVoted(id: string, candidateId: string): Promise<void>;
    create(dto: CreateUserDto): Promise<UserInterface>;
    update(id: string, dto: UpdateUserDto): Promise<UserInterface | null>;
}
