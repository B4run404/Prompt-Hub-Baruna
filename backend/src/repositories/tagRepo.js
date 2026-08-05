const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = (data) => prisma.tag.create({ data });
exports.findAll = (userId) => prisma.tag.findMany({ where: { user_id: userId }, orderBy: { created_at: 'desc' } });
exports.findById = (id, userId) => prisma.tag.findFirst({ where: { id, user_id: userId } });
exports.update = (id, data) => prisma.tag.update({ where: { id }, data });
exports.remove = (id) => prisma.tag.delete({ where: { id } });
