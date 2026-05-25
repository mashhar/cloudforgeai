# Database Migrations

This directory contains SQL migration files for the CloudForge AI database.

## Running Migrations

### Option 1: Using Supabase CLI (Recommended)

If you have the Supabase CLI installed:

```bash
# Apply all pending migrations
supabase db push

# Or apply a specific migration
supabase db push --file supabase/migrations/002_create_reviews_table.sql
```

### Option 2: Manual SQL Execution

If you don't have the Supabase CLI, you can run the migrations manually:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to your project
3. Go to the SQL Editor
4. Copy and paste the content of the migration file
5. Click "Run" to execute

### Option 3: Use the Complete Schema

If this is a new database setup, you can run the complete schema instead:

```bash
# Run the complete schema file
supabase db push --file supabase/schema.sql
```

## Migrations

- **001_initial_schema.sql**: (Implicit in schema.sql) - Creates the architectures table
- **002_create_reviews_table.sql**: Creates the reviews table for storing architecture reviews

## Notes

- Migrations are designed to be idempotent when possible
- Always backup your database before running migrations on production
- The `schema.sql` file contains the complete database schema including all migrations
