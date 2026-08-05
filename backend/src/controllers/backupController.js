const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const exportData = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Fetch all user data concurrently
        const [
            projects,
            prompts,
            categories,
            tags,
            documents,
            snippets,
            assets,
            templates
        ] = await Promise.all([
            prisma.project.findMany({ where: { user_id: userId } }),
            prisma.prompt.findMany({ where: { user_id: userId } }),
            prisma.category.findMany({ where: { user_id: userId } }),
            prisma.tag.findMany({ where: { user_id: userId } }),
            prisma.document.findMany({ where: { user_id: userId } }),
            prisma.snippet.findMany({ where: { user_id: userId } }),
            prisma.asset.findMany({ where: { user_id: userId } }),
            prisma.template.findMany({ where: { user_id: userId } })
        ]);

        const backupData = {
            metadata: {
                version: '1.0',
                exported_at: new Date().toISOString(),
                user_id: userId
            },
            data: {
                projects,
                prompts,
                categories,
                tags,
                documents,
                snippets,
                assets,
                templates
            }
        };

        // Set headers to trigger a file download
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="prompthub-backup-${new Date().getTime()}.json"`);
        
        return res.status(200).send(JSON.stringify(backupData, null, 2));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    exportData
};
