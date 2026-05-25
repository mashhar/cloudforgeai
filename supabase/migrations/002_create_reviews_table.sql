-- Create reviews table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  focus_areas text[] default '{}',
  files jsonb not null,
  review_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.reviews enable row level security;

-- Create policies
create policy "Users can view their own reviews"
  on public.reviews
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reviews"
  on public.reviews
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews
  for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_created_at_idx on public.reviews(created_at desc);

-- Create updated_at trigger
create trigger on_reviews_updated
  before update on public.reviews
  for each row
  execute procedure public.handle_updated_at();
