require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const outputDir = process.argv[2] || path.join(__dirname, '../backups/manual');
const mongoUri  = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

const COLLECTIONS = ['parts', 'reviews', 'users'];

const run = async () => {
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  fs.mkdirSync(outputDir, { recursive: true });

  for (const name of COLLECTIONS) {
    const collection = mongoose.connection.collection(name);
    const docs = await collection.find({}).toArray();
    const filePath = path.join(outputDir, `${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(docs, null, 2));
    console.log(`   📄 ${name.padEnd(10)} → ${docs.length} documents → ${name}.json`);
  }

  const meta = { createdAt: new Date().toISOString(), collections: COLLECTIONS };
  fs.writeFileSync(path.join(outputDir, 'meta.json'), JSON.stringify(meta, null, 2));

  await mongoose.disconnect();
  console.log('\n✅ Backup complete:', outputDir);
};

run().catch((err) => {
  console.error('❌ Backup failed:', err.message);
  process.exit(1);
});
