const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const tables = await p.$queryRawUnsafe(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log('tables:', JSON.stringify(tables.map(t => t.table_name), null, 2));
}

main().finally(() => p.$disconnect());
