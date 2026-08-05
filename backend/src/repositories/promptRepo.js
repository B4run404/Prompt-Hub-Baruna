const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => {
    return await prisma.prompt.create({ data });
};

const findManyByUserId = async (userId) => {
    return await prisma.prompt.findMany({
        where: { user_id: userId, is_deleted: false },
        include: { tags: true, category: true },
        orderBy: { updated_at: 'desc' }
    });
};

const findByIdAndUserId = async (id, userId) => {
    return await prisma.prompt.findFirst({
        where: { id, user_id: userId, is_deleted: false },
        include: { tags: true, category: true, versions: { orderBy: { version_number: 'desc' } } }
    });
};

const update = async (id, data) => {
    return await prisma.prompt.update({
        where: { id },
        data
    });
};

const remove = async (id) => {
    // Soft Delete: Hanya menandai is_deleted = true
    return await prisma.prompt.update({
        where: { id },
        data: { is_deleted: true }
    });
};

const countVersions = async (promptId) => {
    return await prisma.promptVersion.count({
        where: { prompt_id: promptId }
    });
};

const createVersion = async (promptId, content, versionNumber) => {
    return await prisma.promptVersion.create({
        data: {
            prompt_id: promptId,
            content,
            version_number: versionNumber
        }
    });
};

module.exports = {
    create,
    findManyByUserId,
    findByIdAndUserId,
    update,
    remove,
    countVersions,
    createVersion
};
