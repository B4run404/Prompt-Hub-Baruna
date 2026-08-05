const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (data) => prisma.snippet.create({ data });
const findManyByUserId = async (userId) => prisma.snippet.findMany({ where: { user_id: userId }, orderBy: { updated_at: 'desc' } });
const findByIdAndUserId = async (id, userId) => prisma.snippet.findFirst({ where: { id, user_id: userId } });
const update = async (id, data) => prisma.snippet.update({ where: { id }, data });
const remove = async (id) => prisma.snippet.delete({ where: { id } });
const toggleFavorite = async (id, isFavorite) => prisma.snippet.update({ where: { id }, data: { is_favorite: isFavorite } });

module.exports = { create, findManyByUserId, findByIdAndUserId, update, remove, toggleFavorite };
