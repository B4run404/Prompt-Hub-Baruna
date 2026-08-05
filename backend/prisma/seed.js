const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('Memulai proses seeding...');

    const adminId = 'Baruna404'; // Sesuai permintaan pengguna
    const plainPassword = 'bagusbae123';
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

    // Upsert User (Buat jika belum ada, abaikan jika sudah ada)
    const admin = await prisma.user.upsert({
        where: { email: adminId }, // Kolom email difungsikan sebagai ID
        update: {},
        create: {
            email: adminId,
            password_hash: passwordHash,
            role: 'Admin'
        }
    });

    console.log(`Berhasil melakukan seeding untuk user: ${admin.email}`);
    console.log('Seeding selesai.');
}

main()
    .catch((e) => {
        console.error('Terjadi kesalahan saat seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
