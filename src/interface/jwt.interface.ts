import { UserRole } from '../model/user';

export interface TokenPayload {
    id: string;
    role: UserRole;
}
