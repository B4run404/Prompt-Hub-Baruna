const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (userId) => {
    const [
        totalProjects,
        totalPrompts,
        favoritePrompts,
        favoriteProjects,
        totalCategories
    ] = await Promise.all([
        prisma.project.count({ where: { user_id: userId } }),
        prisma.prompt.count({ where: { user_id: userId, is_deleted: false } }),
        prisma.prompt.count({ where: { user_id: userId, is_favorite: true, is_deleted: false } }),
        prisma.project.count({ where: { user_id: userId, is_favorite: true } }),
        prisma.category.count({ where: { user_id: userId } }),
    ]);

    return {
        totalProjects,
        totalPrompts,
        favoritePrompts,
        favoriteProjects,
        totalCategories
    };
};

module.exports = { getStats };
