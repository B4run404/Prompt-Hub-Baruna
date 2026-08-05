const { z } = require('zod');

// Middleware to validate request body against a Zod schema
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            const formattedErrors = err.errors.map(e => ({
                field: e.path.join('.'),
                message: e.message
            }));
            return res.status(400).json({ 
                status: 'error', 
                message: 'Validation failed', 
                errors: formattedErrors 
            });
        }
        next(err);
    }
};

// --- Schemas ---

const authRegisterSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    role: z.string().optional()
});

const authLoginSchema = z.object({
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(1, 'Password tidak boleh kosong')
});

const projectSchema = z.object({
    name: z.string().min(1, 'Nama proyek tidak boleh kosong'),
    description: z.string().optional().nullable(),
    status: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
    framework: z.string().optional().nullable(),
    deadline: z.string().datetime().optional().nullable(),
    is_favorite: z.boolean().optional()
});

const documentSchema = z.object({
    title: z.string().min(1, 'Judul prompt tidak boleh kosong'),
    content: z.string().min(1, 'Konten prompt tidak boleh kosong'),
    ai_provider: z.string().optional().nullable(),
    is_favorite: z.boolean().optional(),
    category_id: z.string().uuid().optional().nullable(),
    project_id: z.string().uuid().optional().nullable(),
    tags: z.array(z.string()).optional() // Since we map tags to DB Tag model eventually, or ignore them
});

const snippetSchema = z.object({
    title: z.string().min(1, 'Judul snippet tidak boleh kosong'),
    code: z.string().min(1, 'Kode tidak boleh kosong'),
    language: z.string().optional(),
    is_favorite: z.boolean().optional()
});

const templateSchema = z.object({
    title: z.string().min(1, 'Judul templat tidak boleh kosong'),
    description: z.string().optional().nullable(),
    content: z.string().min(1, 'Konten templat tidak boleh kosong'),
    category: z.string().optional().nullable(),
    tags: z.array(z.string()).optional()
});

module.exports = {
    validate,
    authRegisterSchema,
    authLoginSchema,
    projectSchema,
    documentSchema,
    snippetSchema,
    templateSchema
};
