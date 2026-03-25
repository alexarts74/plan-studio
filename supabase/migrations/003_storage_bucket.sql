-- Create public storage bucket for media files
insert into storage.buckets (id, name, public)
values ('media', 'media', true);

-- Allow public read access to all files in media bucket
create policy "Public read media"
  on storage.objects for select
  using (bucket_id = 'media');

-- Allow authenticated users to upload files
create policy "Auth upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

-- Allow authenticated users to update files
create policy "Auth update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media');

-- Allow authenticated users to delete files
create policy "Auth delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
