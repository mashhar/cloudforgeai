-- Create architectures table
create table public.architectures (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  prompt text not null,
  cloud_provider text not null check (cloud_provider in ('AWS', 'Azure', 'GCP')),
  scale text not null check (scale in ('Startup', 'Enterprise', 'Hyperscale')),
  architecture_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.architectures enable row level security;

-- Create policies
create policy "Users can view their own architectures"
  on public.architectures
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own architectures"
  on public.architectures
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own architectures"
  on public.architectures
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own architectures"
  on public.architectures
  for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index architectures_user_id_idx on public.architectures(user_id);
create index architectures_created_at_idx on public.architectures(created_at desc);

-- Create updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_architectures_updated
  before update on public.architectures
  for each row
  execute procedure public.handle_updated_at();

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

-- Enable Row Level Security for reviews
alter table public.reviews enable row level security;

-- Create policies for reviews
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

-- Create index for faster queries on reviews
create index reviews_user_id_idx on public.reviews(user_id);
create index reviews_created_at_idx on public.reviews(created_at desc);

-- Create updated_at trigger for reviews
create trigger on_reviews_updated
  before update on public.reviews
  for each row
  execute procedure public.handle_updated_at();
