const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.project.create({ data });
const findManyByUserId = async (userId) => prisma.project.findMany({ where: { user_id: userId }, orderBy: { updated_at: 'desc' } });
const findByIdAndUserId = async (id, userId) => prisma.project.findFirst({ 
    where: { id, user_id: userId },
    include: { prompts: { where: { is_deleted: false }, include: { tags: true } } }
});
const update = async (id, data) => prisma.project.update({ where: { id }, data });
const remove = async (id) => prisma.project.delete({ where: { id } });

const addPromptToProject = async (projectId, promptId) => {
    return await prisma.prompt.update({
        where: { id: promptId },
        data: { project_id: projectId }
    });
};

const removePromptFromProject = async (promptId) => {
    return await prisma.prompt.update({
        where: { id: promptId },
        data: { project_id: null }
    });
};

const toggleFavorite = async (id, isFavorite) => prisma.project.update({ where: { id }, data: { is_favorite: isFavorite } });

module.exports = { create, findManyByUserId, findByIdAndUserId, update, remove, addPromptToProject, removePromptFromProject, toggleFavorite };
