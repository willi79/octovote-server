import { isEmpty } from 'lodash';

import { CreateUserDto, IUserRepository, UpdateUserDto } from '../repository/i-user.repository';
import { UserInterface } from '../model/user';

export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async listUsers(): Promise<UserInterface[]> {
        return this.userRepository.findAll();
    }

    async createUser(dto: CreateUserDto): Promise<UserInterface> {
        if (isEmpty(dto.name)) {
            throw new Error('Name is required');
        }

        if (isEmpty(dto.email)) {
            throw new Error('Email is required');
        }

        if (isEmpty(dto.password)) {
            throw new Error('Password is required');
        }

        const existing: UserInterface | null = await this.userRepository.findByEmail(dto.email);
        if (!isEmpty(existing)) {
            throw new Error('Email already exists');
        }

        return this.userRepository.create(dto);
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<UserInterface> {
        if (isEmpty(dto)) {
            throw new Error('No fields to update');
        }

        const updated = await this.userRepository.update(id, dto);
        if (!updated) {
            throw new Error('User not found');
        }

        return updated;
    }

    async deleteUser(id: string): Promise<boolean> {
        const deleted = await this.userRepository.delete(id);
        if (!deleted) {
            throw new Error('User not found');
        }

        return deleted;
    }
}
