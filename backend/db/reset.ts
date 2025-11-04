import { db } from './index';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

async function resetDatabase() {
  console.log('🗑️  Resetting database...');

  try {
    const dbPath = path.join(process.cwd(), 'local.db');
    
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✅ Old database deleted');
    }

    console.log('🚀 Creating new database schema...');

    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        emailVerified INTEGER NOT NULL DEFAULT 0,
        verificationCode TEXT,
        verificationCodeExpiresAt TEXT,
        phone TEXT,
        dateOfBirth TEXT,
        age INTEGER,
        gender TEXT CHECK(gender IN ('male', 'female')),
        nationality TEXT,
        countryOfBirth TEXT,
        departureCity TEXT,
        avatar TEXT,
        bio TEXT,
        travelStyle TEXT CHECK(travelStyle IN ('cultural', 'adventure', 'relaxation', 'mixed')) DEFAULT 'mixed',
        budgetRange TEXT CHECK(budgetRange IN ('budget', 'moderate', 'luxury')) DEFAULT 'moderate',
        notifications INTEGER NOT NULL DEFAULT 1,
        inspirations INTEGER NOT NULL DEFAULT 1,
        joinedDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        destination TEXT NOT NULL,
        country TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        cover_image TEXT,
        budget_total INTEGER NOT NULL DEFAULT 0,
        budget_spent INTEGER NOT NULL DEFAULT 0,
        budget_currency TEXT NOT NULL DEFAULT 'EUR',
        budget_transport INTEGER NOT NULL DEFAULT 0,
        budget_accommodation INTEGER NOT NULL DEFAULT 0,
        budget_food INTEGER NOT NULL DEFAULT 0,
        budget_activities INTEGER NOT NULL DEFAULT 0,
        budget_other INTEGER NOT NULL DEFAULT 0,
        status TEXT CHECK(status IN ('planning', 'upcoming', 'ongoing', 'completed')) NOT NULL DEFAULT 'planning',
        is_public INTEGER NOT NULL DEFAULT 0,
        travelers INTEGER NOT NULL DEFAULT 1,
        notes TEXT DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS locations (
        id TEXT PRIMARY KEY,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        address TEXT NOT NULL,
        country TEXT NOT NULL,
        city TEXT NOT NULL,
        type TEXT CHECK(type IN ('tourist', 'historical', 'natural', 'other')) NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id TEXT PRIMARY KEY,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        amount INTEGER NOT NULL,
        currency TEXT NOT NULL DEFAULT 'EUR',
        category TEXT CHECK(category IN ('transport', 'accommodation', 'food', 'activities', 'shopping', 'other')) NOT NULL,
        date TEXT NOT NULL,
        notes TEXT,
        receipt TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS checklists (
        id TEXT PRIMARY KEY,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT CHECK(category IN ('documents', 'health', 'packing', 'booking', 'preparation', 'other')) NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        due_date TEXT,
        priority TEXT CHECK(priority IN ('low', 'medium', 'high')) NOT NULL DEFAULT 'medium',
        reminder TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
        uri TEXT NOT NULL,
        type TEXT CHECK(type IN ('photo', 'video')) NOT NULL,
        caption TEXT,
        taken_at TEXT NOT NULL,
        is_drone_photo INTEGER NOT NULL DEFAULT 0,
        is_public INTEGER NOT NULL DEFAULT 0,
        likes INTEGER NOT NULL DEFAULT 0,
        tags TEXT,
        edited_with TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS saved_places (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        location_id TEXT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
        notes TEXT DEFAULT '',
        visited_date TEXT,
        rating INTEGER,
        photos TEXT,
        recommendations TEXT DEFAULT '',
        is_public INTEGER NOT NULL DEFAULT 0,
        shared_with TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS journals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_id TEXT NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        date TEXT NOT NULL,
        mood TEXT CHECK(mood IN ('happy', 'excited', 'peaceful', 'grateful', 'adventurous')),
        is_public INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_id TEXT REFERENCES trips(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        cover_image TEXT,
        songs TEXT,
        is_public INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_id TEXT REFERENCES trips(id) ON DELETE SET NULL,
        location_id TEXT REFERENCES locations(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        likes INTEGER NOT NULL DEFAULT 0,
        shares INTEGER NOT NULL DEFAULT 0,
        hashtags TEXT,
        is_public INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type TEXT CHECK(type IN ('reminder', 'deal', 'social', 'system')) NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        read INTEGER NOT NULL DEFAULT 0,
        action_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT NOT NULL,
        city TEXT NOT NULL,
        region TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT 'France',
        rating INTEGER NOT NULL,
        reviews INTEGER NOT NULL DEFAULT 0,
        price INTEGER NOT NULL,
        duration TEXT NOT NULL,
        image TEXT NOT NULL,
        category TEXT CHECK(category IN ('Culture', 'Aventure', 'Nature', 'Gastronomie', 'Sport', 'Visites', 'Plage')) NOT NULL,
        description TEXT NOT NULL,
        latitude INTEGER NOT NULL,
        longitude INTEGER NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activity_bookings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
        trip_id TEXT REFERENCES trips(id) ON DELETE SET NULL,
        booking_date TEXT NOT NULL,
        number_of_people INTEGER NOT NULL DEFAULT 1,
        total_price INTEGER NOT NULL,
        status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database reset completed successfully!');
    console.log('📊 All tables created with new schema.');
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  }
}

resetDatabase()
  .then(() => {
    console.log('🎉 Database reset complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database reset failed:', error);
    process.exit(1);
  });
