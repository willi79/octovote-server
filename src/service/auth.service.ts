import { isEmpty } from 'lodash';

import { AuthResult } from '../interface/auth.interface';
import { CreateUserDto, IUserRepository } from '../repository/i-user.repository';
import { TokenPayload } from '../interface/jwt.interface';
import { UserInterface } from '../model/user';
import { signToken } from '../util/jwt.util';

export interface LoginDto {
    email: string;
    password: string;
}

export class AuthService {
    constructor(private readonly userRepository: IUserRepository) {}

    async register(dto: CreateUserDto): Promise<AuthResult> {
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

        const user: UserInterface = await this.userRepository.create(dto);

        const payload: TokenPayload = {
            id: user._id.toString(),
            role: user.role,
        };

        const token: string = signToken(payload);

        return { token, user };
    }

    async login(dto: LoginDto): Promise<AuthResult> {
        if (isEmpty(dto.email)) {
            throw new Error('Email is required');
        }

        if (isEmpty(dto.password)) {
            throw new Error('Password is required');
        }

        const user: UserInterface | null = await this.userRepository.findByEmail(dto.email);
        if (isEmpty(user)) {
            throw new Error('Invalid email');
        }

        const isPasswordValid = await user!.comparePassword(dto.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const payload: TokenPayload = {
            id: user!._id.toString(),
            role: user!.role,
        };

        const token: string = signToken(payload);

        return { token, user: user! };
    }
}
