/**
 * restore.js — Restores collections from a JSON backup folder.
 *
 * ⚠️  WARNING: This DROPS and replaces each collection. Use with caution.
 *
 * Usage:
 *   node scripts/restore.js <backupDir> [mongoUri]
 *
 * Example:
 *   node scripts/restore.js ./backups/backup_2024-01-15_10-30-00
 */
require('dotenv').config({ path: `${__dirname}/../.env` });

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const backupDir = process.argv[2];
const mongoUri  = process.argv[3] || process.env.MONGO_URI;

if (!backupDir) {
  console.error('❌ Usage: node scripts/restore.js <backupDir> [mongoUri]');
  console.error('   Example: node scripts/restore.js ./backups/backup_2024-01-15_10-30-00');
  process.exit(1);
}

if (!fs.existsSync(backupDir)) {
  console.error(`❌ Backup directory not found: ${backupDir}`);
  process.exit(1);
}

if (!mongoUri) {
  console.error('❌ No MONGO_URI provided');
  process.exit(1);
}

// Read meta to know which collections to restore
const metaPath = path.join(backupDir, 'meta.json');
const COLLECTIONS = fs.existsSync(metaPath)
  ? JSON.parse(fs.readFileSync(metaPath)).collections
  : ['parts', 'reviews', 'users'];

const confirm = (question) =>
  new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim().toLowerCase()); });
  });

const run = async () => {
  console.log('\n⚠️  RESTORE WARNING');
  console.log('   This will DROP and replace these collections:');
  COLLECTIONS.forEach((c) => console.log(`   - ${c}`));
  console.log(`   From: ${backupDir}\n`);

  const answer = await confirm('Type "yes" to continue, anything else to cancel: ');
  if (answer !== 'yes') {
    console.log('❌ Restore cancelled.');
    process.exit(0);
  }

  await mongoose.connect(mongoUri);
  console.log('\n✅ Connected to MongoDB');

  for (const name of COLLECTIONS) {
    const filePath = path.join(backupDir, `${name}.json`);

    if (!fs.existsSync(filePath)) {
      console.warn(`   ⚠️  ${name}.json not found — skipping`);
      continue;
    }

    const docs = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const collection = mongoose.connection.collection(name);

    // Drop existing and re-insert
    await collection.deleteMany({});

    if (docs.length > 0) {
      await collection.insertMany(docs);
    }

    console.log(`   ✅ ${name.padEnd(10)} → restored ${docs.length} documents`);
  }

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected');
  console.log('✅ Restore complete\n');
};

run().catch((err) => {
  console.error('❌ Restore failed:', err.message);
  process.exit(1);
});
