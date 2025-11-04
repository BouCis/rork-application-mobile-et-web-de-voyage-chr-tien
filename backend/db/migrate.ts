import { db } from './index';
import { sql } from 'drizzle-orm';

async function migrate() {
  console.log('🚀 Starting database migration...');

  try {
    await db.run(sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        email_verified INTEGER NOT NULL DEFAULT 0,
        verification_code TEXT,
        verification_code_expires_at TEXT,
        phone TEXT,
        date_of_birth TEXT,
        age INTEGER,
        gender TEXT CHECK(gender IN ('male', 'female')),
        nationality TEXT,
        country_of_birth TEXT,
        departure_city TEXT,
        avatar TEXT,
        bio TEXT,
        travel_style TEXT CHECK(travel_style IN ('cultural', 'adventure', 'relaxation', 'mixed')) DEFAULT 'mixed',
        budget_range TEXT CHECK(budget_range IN ('budget', 'moderate', 'luxury')) DEFAULT 'moderate',
        notifications INTEGER NOT NULL DEFAULT 1,
        inspirations INTEGER NOT NULL DEFAULT 1,
        joined_date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    `);

    console.log('✅ Migration completed successfully!');
    console.log('📊 All tables created.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

migrate()
  .then(() => {
    console.log('🎉 Database setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  });
