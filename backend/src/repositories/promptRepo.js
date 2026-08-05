const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => {
    return await prisma.prompt.create({ data });
};

const findManyByUserId = async (userId) => {
    return await prisma.prompt.findMany({
        where: { user_id: userId },
        orderBy: { updated_at: 'desc' }
    });
};

const findByIdAndUserId = async (id, userId) => {
    return await prisma.prompt.findFirst({
        where: { id, user_id: userId }
    });
};

const update = async (id, data) => {
    return await prisma.prompt.update({
        where: { id },
        data
    });
};

const remove = async (id) => {
    return await prisma.prompt.delete({
        where: { id }
    });
};

module.exports = {
    create,
    findManyByUserId,
    findByIdAndUserId,
    update,
    remove
};
