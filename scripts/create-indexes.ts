/**
 * Database index management script for MongoDB
 * 
 * Run with:
 *   npx ts-node --project tsconfig.json scripts/create-indexes.ts
 */

import { MongoClient } from 'mongodb';

async function setupIndexes() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB_NAME || 'fdmakan';
  console.log(`Connecting to MongoDB (${dbName})...`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log('Connected successfully. Creating indexes...\n');

    // 1. Properties collection indexes
    const propertiesCol = db.collection('properties');
    await propertiesCol.createIndex({ createdAt: -1 }, { name: 'idx_properties_createdAt' });
    await propertiesCol.createIndex({ city: 1, propertyCategory: 1, price: 1 }, { name: 'idx_properties_search' });
    await propertiesCol.createIndex({ showInTopSelling: 1, createdAt: -1 }, { name: 'idx_properties_topselling' });
    await propertiesCol.createIndex({ showInPremium: 1, createdAt: -1 }, { name: 'idx_properties_premium' });
    await propertiesCol.createIndex({ showInNewlyLaunched: 1, createdAt: -1 }, { name: 'idx_properties_newlylaunched' });
    console.log('✔ Properties indexes created');

    // 2. Blogs collection indexes
    const blogsCol = db.collection('blogs');
    await blogsCol.createIndex({ createdAt: -1 }, { name: 'idx_blogs_createdAt' });
    console.log('✔ Blogs indexes created');

    // 3. Orders / Enquiries collection indexes
    const ordersCol = db.collection('orders');
    await ordersCol.createIndex({ createdAt: -1 }, { name: 'idx_orders_createdAt' });
    await ordersCol.createIndex({ propertyId: 1 }, { name: 'idx_orders_propertyId' });
    console.log('✔ Orders indexes created');

    // 4. Locations & Cities collection indexes
    const locationsCol = db.collection('locations');
    await locationsCol.createIndex({ cityId: 1 }, { name: 'idx_locations_cityId' });
    console.log('✔ Locations indexes created');

    console.log('\nAll database indexes established successfully!');
  } catch (err) {
    console.error('Failed to create indexes:', err);
  } finally {
    await client.close();
  }
}

setupIndexes();
