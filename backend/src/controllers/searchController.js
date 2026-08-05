const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const globalSearch = async (req, res, next) => {
    try {
        const { q } = req.query;
        const userId = req.user.id;

        if (!q || q.trim() === '') {
            return res.status(200).json({ status: 'success', data: [] });
        }

        const queryStr = q.trim();

        // Perform parallel queries to all 4 tables using case-insensitive search
        // For PostgreSQL, Prisma uses mode: 'insensitive'
        const [prompts, snippets, templates, projects] = await Promise.all([
            prisma.document.findMany({
                where: {
                    user_id: userId,
                    OR: [
                        { title: { contains: queryStr, mode: 'insensitive' } },
                        { content: { contains: queryStr, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.snippet.findMany({
                where: {
                    user_id: userId,
                    OR: [
                        { title: { contains: queryStr, mode: 'insensitive' } },
                        { code: { contains: queryStr, mode: 'insensitive' } },
                        { language: { contains: queryStr, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.template.findMany({
                where: {
                    user_id: userId,
                    OR: [
                        { title: { contains: queryStr, mode: 'insensitive' } },
                        { description: { contains: queryStr, mode: 'insensitive' } },
                        { category: { contains: queryStr, mode: 'insensitive' } }
                    ]
                },
                take: 5
            }),
            prisma.project.findMany({
                where: {
                    user_id: userId,
                    OR: [
                        { name: { contains: queryStr, mode: 'insensitive' } },
                        { description: { contains: queryStr, mode: 'insensitive' } }
                    ]
                },
                take: 5
            })
        ]);

        // Standardize output format
        const results = [
            ...prompts.map(p => ({ type: 'prompt', id: p.id, title: p.title, subtitle: p.content.substring(0, 50) + '...', url: '#prompts' })),
            ...snippets.map(s => ({ type: 'snippet', id: s.id, title: s.title, subtitle: s.language, url: '#snippets' })),
            ...templates.map(t => ({ type: 'template', id: t.id, title: t.title, subtitle: t.category || 'Template', url: '#templates' })),
            ...projects.map(pj => ({ type: 'project', id: pj.id, title: pj.name, subtitle: pj.description || 'Project', url: '#projects' }))
        ];

        res.status(200).json({
            status: 'success',
            data: results
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    globalSearch
};
