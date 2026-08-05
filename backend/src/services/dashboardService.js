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

    const recentPrompts = await prisma.prompt.findMany({
        where: { user_id: userId, is_deleted: false },
        orderBy: { updated_at: 'desc' },
        take: 5,
        select: { id: true, title: true, updated_at: true }
    });
    const recentProjects = await prisma.project.findMany({
        where: { user_id: userId },
        orderBy: { updated_at: 'desc' },
        take: 5,
        select: { id: true, name: true, updated_at: true }
    });

    const recentActivity = [
        ...recentPrompts.map(p => ({ id: p.id, type: 'Prompt', title: p.title, updated_at: p.updated_at })),
        ...recentProjects.map(p => ({ id: p.id, type: 'Project', title: p.name, updated_at: p.updated_at }))
    ].sort((a, b) => b.updated_at - a.updated_at).slice(0, 5);

    return {
        totalProjects,
        totalPrompts,
        favoritePrompts,
        favoriteProjects,
        totalCategories,
        recentActivity
    };
};

module.exports = { getStats };
