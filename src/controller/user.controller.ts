import { Request, Response } from 'express';

import { UserInterface } from '../model/user';
import { UserService } from '../service/user.service';

export class UserController {
    constructor(private readonly userService: UserService) {}

    async listUsers(req: Request, res: Response): Promise<void> {
        try {
            const users: UserInterface[] = await this.userService.listUsers();
            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user: UserInterface = await this.userService.createUser(req.body);
            res.status(201).json({ user });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const user: UserInterface = await this.userService.updateUser(req.params.id, req.body);
            res.status(200).json({ user });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            await this.userService.deleteUser(req.params.id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }
}
