import { Request, Response } from 'express';

import { AuthResult } from '../interface/auth.interface';
import { AuthService } from '../service/auth.service';

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    async register(req: Request, res: Response): Promise<void> {
        try {
            const result: AuthResult = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const result: AuthResult = await this.authService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: (error as Error).message });
        }
    }
}
