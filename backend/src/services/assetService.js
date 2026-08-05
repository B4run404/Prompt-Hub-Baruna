const assetRepo = require('../repositories/assetRepo');
const supabase = require('../config/supabaseClient');
const path = require('path');

const create = async (userId, file, projectId) => {
    let fileUrl = '';
    const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
    
    if (supabase) {
        // Create unique filename to prevent overwrite
        const ext = path.extname(file.originalname);
        const fileName = `${userId}_${Date.now()}${ext}`;
        
        const { data, error } = await supabase
            .storage
            .from(bucketName)
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });
            
        if (error) {
            throw new Error(`Supabase Upload Error: ${error.message}`);
        }
        
        // Get public URL
        const { data: publicUrlData } = supabase
            .storage
            .from(bucketName)
            .getPublicUrl(fileName);
            
        fileUrl = publicUrlData.publicUrl;
    } else {
        // Mock fallback for missing Supabase Config
        fileUrl = `mock://local/assets/${file.originalname}`;
    }

    const assetData = {
        filename: file.originalname,
        file_type: file.mimetype,
        size: file.size,
        url: fileUrl,
        user_id: userId,
        project_id: projectId ? projectId : null
    };

    return await assetRepo.create(assetData);
};

const getAll = async (userId) => {
    return await assetRepo.findManyByUserId(userId);
};

const getById = async (userId, assetId) => {
    const asset = await assetRepo.findByIdAndUserId(assetId, userId);
    if (!asset) throw new Error('NOT_FOUND');
    return asset;
};

const remove = async (userId, assetId) => {
    const existing = await assetRepo.findByIdAndUserId(assetId, userId);
    if (!existing) throw new Error('NOT_FOUND');
    
    // Delete file from Supabase if it's a real uploaded asset
    if (supabase && existing.url && !existing.url.startsWith('mock://')) {
        const bucketName = process.env.SUPABASE_BUCKET_NAME || 'assets';
        const urlParts = existing.url.split('/');
        const fileName = urlParts.pop(); // The last part of the URL is the filename
        
        if (fileName) {
            // Fire and forget (or await it)
            const { error } = await supabase.storage.from(bucketName).remove([fileName]);
            if (error) {
                console.error('Failed to delete file from Supabase:', error.message);
            }
        }
    }
    
    return await assetRepo.remove(assetId);
};

module.exports = { create, getAll, getById, remove };
