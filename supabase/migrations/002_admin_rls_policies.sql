-- Admin write policies for authenticated users

-- Categories
create policy "Admin insert categories" on categories for insert to authenticated with check (true);
create policy "Admin update categories" on categories for update to authenticated using (true) with check (true);
create policy "Admin delete categories" on categories for delete to authenticated using (true);

-- Subcategories
create policy "Admin insert subcategories" on subcategories for insert to authenticated with check (true);
create policy "Admin update subcategories" on subcategories for update to authenticated using (true) with check (true);
create policy "Admin delete subcategories" on subcategories for delete to authenticated using (true);

-- Projects
create policy "Admin insert projects" on projects for insert to authenticated with check (true);
create policy "Admin update projects" on projects for update to authenticated using (true) with check (true);
create policy "Admin delete projects" on projects for delete to authenticated using (true);

-- Project images
create policy "Admin insert project_images" on project_images for insert to authenticated with check (true);
create policy "Admin update project_images" on project_images for update to authenticated using (true) with check (true);
create policy "Admin delete project_images" on project_images for delete to authenticated using (true);
