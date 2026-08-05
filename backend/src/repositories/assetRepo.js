const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.asset.create({ data });
const findManyByUserId = async (userId) => prisma.asset.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } });
const findByIdAndUserId = async (id, userId) => prisma.asset.findFirst({ where: { id, user_id: userId } });
const remove = async (id) => prisma.asset.delete({ where: { id } });

module.exports = { create, findManyByUserId, findByIdAndUserId, remove };
