const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.document.create({ data });
const findManyByUserId = async (userId) => prisma.document.findMany({ where: { user_id: userId }, orderBy: { updated_at: 'desc' } });
const findByIdAndUserId = async (id, userId) => prisma.document.findFirst({ where: { id, user_id: userId } });
const update = async (id, data) => prisma.document.update({ where: { id }, data });
const remove = async (id) => prisma.document.delete({ where: { id } });
const toggleFavorite = async (id, isFavorite) => prisma.document.update({ where: { id }, data: { is_favorite: isFavorite } });

module.exports = { create, findManyByUserId, findByIdAndUserId, update, remove, toggleFavorite };
