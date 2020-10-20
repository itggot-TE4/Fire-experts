# frozen_string_literal: true

require 'sqlite3'

# Handles seeding/generation of db
class Seeder
  # Seeds the database
  def self.seed!
    db = connect
    drop_tables(db)
    puts 'Deleted old tables'
    create_tables(db)
    puts 'Created new tables'
  end

  # Connects to the db
  def self.connect
    SQLite3::Database.new 'db/data.db'
  end

  # Drops tables if they excist
  #
  # db - (database Object)
  def self.drop_tables(db)
    db.execute('DROP TABLE IF EXISTS forks;')
  end

  # Creates tables in the db
  #
  # db - (database Object)
  def self.create_tables(db)
    db.execute 'CREATE TABLE "forks" (
            "full_name"	TEXT NOT NULL UNIQUE,
            "comment"	TEXT,
            "graded"	INTEGER,
            "parent_repo"	TEXT NOT NULL
        );'
  end
end
