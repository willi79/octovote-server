import { Request, Response, Router } from 'express';

import { UserController } from '../controller/user.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { UserRole } from '../model/user';

export const createUserRouter = (userController: UserController): Router => {
    const router: Router = Router();

    router.use(requireAuth, requireRole([UserRole.Admin]));

    router.get('/', (req: Request, res: Response): Promise<void> => userController.listUsers(req, res));
    router.post('/', (req: Request, res: Response): Promise<void> => userController.createUser(req, res));
    router.patch('/:id', (req: Request, res: Response): Promise<void> => userController.updateUser(req, res));
    router.delete('/:id', (req: Request, res: Response): Promise<void> => userController.deleteUser(req, res));

    return router;
};
