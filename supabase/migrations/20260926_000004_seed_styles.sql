insert into public.styles (slug, name, prompt_description)
values
  ('japandi', 'Japandi', 'Calm Japandi restraint with natural wood, tactile linen and quiet asymmetry.'),
  ('scandinavian', 'Scandinavian', 'Light Scandinavian warmth with practical forms, pale wood and lived-in softness.'),
  ('industrial', 'Industrial Loft', 'Refined industrial character with honest materials, warm metal and structured contrast.'),
  ('modern', 'Modern', 'Warm modern clarity with clean lines, considered contrast and soft architectural details.'),
  ('classic', 'Classic', 'Timeless classic proportion with crafted details, balanced symmetry and subtle texture.'),
  ('minimalist', 'Minimalist', 'Quiet minimalist composition with fewer objects, generous negative space and precise details.')
on conflict (slug) do update set
  name = excluded.name,
  prompt_description = excluded.prompt_description,
  enabled = true;
