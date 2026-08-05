const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.project.create({ data });
const findManyByUserId = async (userId) => prisma.project.findMany({ where: { user_id: userId }, orderBy: { updated_at: 'desc' } });
const findByIdAndUserId = async (id, userId) => prisma.project.findFirst({ where: { id, user_id: userId } });
const update = async (id, data) => prisma.project.update({ where: { id }, data });
const remove = async (id) => prisma.project.delete({ where: { id } });

module.exports = { create, findManyByUserId, findByIdAndUserId, update, remove };
