import { signToken, verifyToken } from '../../../src/util/jwt.util';
import { TokenPayload } from '../../../src/interface/jwt.interface';
import { UserRole } from '../../../src/model/user';

describe('JWT Utility', () => {
    it('should sign a token and verify it back to the original payload', () => {
        const payload: TokenPayload = { id: '64f0000000000000000000aa', role: UserRole.User };
        const token: string = signToken(payload);

        expect(typeof token).toBe('string');

        const decoded: TokenPayload = verifyToken(token);
        expect(decoded.id).toBe(payload.id);
        expect(decoded.role).toBe(payload.role);
    });

    it('should throw when verifying an invalid token', () => {
        expect(() => verifyToken('not-a-real-token')).toThrow();
    });

    it('should include id and role in the decoded payload', () => {
        const payload: TokenPayload = { id: 'abc123', role: UserRole.Admin };
        const token: string = signToken(payload);
        const decoded: TokenPayload = verifyToken(token);

        expect(decoded).toMatchObject(payload);
    });
});
