const prisma = require('../config/prisma');

const create = async (data) => {
    return await prisma.template.create({ data });
};

const findManyByUserId = async (userId) => {
    return await prisma.template.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' }
    });
};

const findByIdAndUserId = async (id, userId) => {
    return await prisma.template.findFirst({
        where: { id, user_id: userId }
    });
};

const update = async (id, data) => {
    return await prisma.template.update({
        where: { id },
        data
    });
};

const remove = async (id) => {
    return await prisma.template.delete({
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
