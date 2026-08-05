const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepo');

class AuthService {
    /**
     * Logika bisnis untuk autentikasi user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} Token dan data user
     */
    async login(email, password) {
        if (!email || !password) {
            throw new Error('EMAIL_PASSWORD_REQUIRED');
        }

        // Memanggil Repository alih-alih ORM langsung
        const user = await userRepo.findByEmail(email);
        
        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // Verifikasi Password Hash
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        
        if (!isPasswordValid) {
            throw new Error('INVALID_CREDENTIALS');
        }

        // Generate JWT Token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET_NOT_CONFIGURED');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();
