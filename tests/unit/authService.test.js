const authService = require('../../src/services/authService');
const User = require('../../src/models/User');

// testSetup.js handles DB connect/clear/close via global hooks

describe('AuthService — register', () => {
    const validUser = {
        name: 'Gaurav Sinha',
        email: 'gaurav@test.com',
        password: 'Password123'
    };

    it('registers a new user and returns tokens', async () => {
        const result = await authService.register(validUser);

        expect(result.user.email).toBe(validUser.email);
        expect(result.user.name).toBe(validUser.name);
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
        // password must NEVER be returned
        expect(result.user.password).toBeUndefined();
    });

    it('throws 409 when email is already registered', async () => {
        await authService.register(validUser);   // first registration

        await expect(authService.register(validUser))
            .rejects
            .toMatchObject({ statusCode: 409, message: 'Email already registered' });
    });

    it('hashes the password before storing', async () => {
        await authService.register(validUser);
        const stored = await User.findOne({ email: validUser.email }).select('+password');
        expect(stored.password).not.toBe(validUser.password);  // not plain text
        expect(stored.password).toMatch(/^\$2b\$/);            // bcrypt prefix
    });
});

describe('AuthService — login', () => {
    beforeEach(async () => {
        await authService.register({
            name: 'Gaurav Sinha',
            email: 'gaurav@test.com',
            password: 'Password123'
        });
    });

    it('returns tokens on valid credentials', async () => {
        const result = await authService.login({
            email: 'gaurav@test.com',
            password: 'Password123'
        });
        expect(result.accessToken).toBeDefined();
        expect(result.refreshToken).toBeDefined();
    });

    it('throws 401 on wrong password', async () => {
        await expect(authService.login({
            email: 'gaurav@test.com',
            password: 'WrongPassword'
        })).rejects.toMatchObject({ statusCode: 401 });
    });

    it('throws 401 on non-existent email', async () => {
        await expect(authService.login({
            email: 'nobody@test.com',
            password: 'Password123'
        })).rejects.toMatchObject({ statusCode: 401 });
    });

    it('returns the same error message for wrong email and wrong password', async () => {
        const wrongEmail = await authService.login({
            email: 'nobody@test.com', password: 'Password123'
        }).catch(e => e);

        const wrongPass = await authService.login({
            email: 'gaurav@test.com', password: 'WrongPass'
        }).catch(e => e);

        // Same message — prevents email enumeration attack
        expect(wrongEmail.message).toBe(wrongPass.message);
    });
});

describe('AuthService — refresh token rotation', () => {
    let refreshToken;

    beforeEach(async () => {
        const result = await authService.register({
            name: 'Gaurav', email: 'gaurav@test.com', password: 'Password123'
        });
        refreshToken = result.refreshToken;
    });

    it('issues new token pair on valid refresh token', async () => {
        const tokens = await authService.refresh(refreshToken);
        expect(tokens.accessToken).toBeDefined();
        expect(tokens.refreshToken).toBeDefined();
        expect(tokens.refreshToken).not.toBe(refreshToken);  // rotated
    });

    it('throws 401 when refresh token is reused', async () => {
        await authService.refresh(refreshToken);   // first use — rotates token
        // second use of same token — reuse attack
        await expect(authService.refresh(refreshToken))
            .rejects.toMatchObject({ statusCode: 401 });
    });

    it('throws 401 when no token provided', async () => {
        await expect(authService.refresh(undefined))
            .rejects.toMatchObject({ statusCode: 401 });
    });
});
