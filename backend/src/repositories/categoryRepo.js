const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = (data) => prisma.category.create({ data });
exports.findAll = (userId) => prisma.category.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } });
exports.findById = (id, userId) => prisma.category.findFirst({ where: { id, user_id: userId } });
exports.update = (id, data) => prisma.category.update({ where: { id }, data });
exports.remove = (id) => prisma.category.delete({ where: { id } });
