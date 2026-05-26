const { z } = require('zod');

const registerSchema = z.object({
    name: z.string().min(2).max(50).trim(),
    email: z.string().email().toLowerCase(),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)/,
        'Password must contain uppercase, lowercase and a number'
    ),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

module.exports = { registerSchema, loginSchema };
