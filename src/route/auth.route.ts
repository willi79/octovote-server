import { Request, Response, Router } from 'express';

import { AuthController } from '../controller/auth.controller';

export const createAuthRouter = (authController: AuthController): Router => {
    const router = Router();

    router.post('/register', (req: Request, res: Response): Promise<void> => authController.register(req, res));
    router.post('/login', (req: Request, res: Response): Promise<void> => authController.login(req, res));

    return router;
};
