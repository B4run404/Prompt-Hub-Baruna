const prisma = require('../config/db');

class UserRepository {
    /**
     * Mencari user berdasarkan alamat email
     * @param {string} email 
     * @returns {Promise<Object>} user data
     */
    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    /**
     * Membuat user baru di database
     * @param {Object} userData 
     * @returns {Promise<Object>} user data
     */
    async create(userData) {
        return await prisma.user.create({
            data: userData
        });
    }
}

module.exports = new UserRepository();
