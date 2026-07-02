import { Request, Response, Router } from 'express';

import { UserController } from '../controller/user.controller';

export const createUserRouter = (userController: UserController): Router => {
    const router: Router = Router();

    router.get('/', (req: Request, res: Response): Promise<void> => userController.listUsers(req, res));
    router.post('/', (req: Request, res: Response): Promise<void> => userController.createUser(req, res));
    router.patch('/:id', (req: Request, res: Response): Promise<void> => userController.updateUser(req, res));
    router.delete('/:id', (req: Request, res: Response): Promise<void> => userController.deleteUser(req, res));

    return router;
};
