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

const importData = async (req, res, next) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({ status: 'error', message: 'No backup file provided' });
        }

        const backupJSON = JSON.parse(req.file.buffer.toString());
        
        if (!backupJSON.metadata || !backupJSON.data) {
            return res.status(400).json({ status: 'error', message: 'Invalid backup format' });
        }

        const { data } = backupJSON;

        // Perform Wipe and Replace in a single transaction
        await prisma.$transaction([
            // 1. Wipe Existing Data
            prisma.asset.deleteMany({ where: { user_id: userId } }),
            prisma.snippet.deleteMany({ where: { user_id: userId } }),
            prisma.document.deleteMany({ where: { user_id: userId } }),
            prisma.template.deleteMany({ where: { user_id: userId } }),
            prisma.promptVersion.deleteMany({ where: { prompt: { user_id: userId } } }),
            prisma.prompt.deleteMany({ where: { user_id: userId } }),
            prisma.project.deleteMany({ where: { user_id: userId } }),
            prisma.tag.deleteMany({ where: { user_id: userId } }),
            prisma.category.deleteMany({ where: { user_id: userId } }),

            // 2. Insert Backup Data (Order matters for Foreign Keys)
            ...(data.projects && data.projects.length ? [prisma.project.createMany({ data: data.projects })] : []),
            ...(data.categories && data.categories.length ? [prisma.category.createMany({ data: data.categories })] : []),
            ...(data.tags && data.tags.length ? [prisma.tag.createMany({ data: data.tags })] : []),
            ...(data.prompts && data.prompts.length ? [prisma.prompt.createMany({ data: data.prompts })] : []),
            ...(data.documents && data.documents.length ? [prisma.document.createMany({ data: data.documents })] : []),
            ...(data.snippets && data.snippets.length ? [prisma.snippet.createMany({ data: data.snippets })] : []),
            ...(data.assets && data.assets.length ? [prisma.asset.createMany({ data: data.assets })] : []),
            ...(data.templates && data.templates.length ? [prisma.template.createMany({ data: data.templates })] : [])
        ]);

        return res.status(200).json({
            status: 'success',
            message: 'Data successfully restored from backup'
        });
    } catch (err) {
        if (err instanceof SyntaxError) {
            return res.status(400).json({ status: 'error', message: 'Invalid JSON file' });
        }
        next(err);
    }
};

module.exports = {
    exportData,
    importData
};
