import { isEmpty } from 'lodash';

import { IUserRepository } from '../repository/i-user.repository';
import { UserRepository } from '../repository/user.repository';
import { UserInterface, UserRole } from '../model/user';
import { env } from './environment';

export const seedAdmin = async (): Promise<void> => {
    const userRepository: IUserRepository = new UserRepository();
    const email: string = env.adminEmail;
    const existing: UserInterface | null = await userRepository.findByEmail(email);

    if (!isEmpty(existing)) {
        console.log('Admin already exists');
        return;
    }

    await userRepository.create({
        name: env.adminName,
        email: email,
        password: env.adminPassword,
        role: UserRole.Admin,
    });

    console.log(`Admin created with email: ${email}`);
};
