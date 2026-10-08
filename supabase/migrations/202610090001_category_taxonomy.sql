-- Category taxonomy reconciliation.
-- Old -> new mapping for the separate manual data migration:
-- Social -> Social Media
-- Video shoots -> Video Editing
-- Editing -> Video Editing

alter table public.projects
  drop constraint if exists projects_category_check;

alter table public.projects
  add constraint projects_category_check
  check (
    category in (
      'Video Editing',
      'Reels & Short-form',
      'YouTube',
      'Social Media',
      'Corporate',
      'Other'
    )
  );
