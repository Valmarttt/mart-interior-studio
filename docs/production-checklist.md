# Production checklist

## Vercel environment variables

Set these variables for Preview and Production as needed:

```text
AI_PROVIDER=mock
ENABLE_REAL_GENERATION=false
GENERATION_LIMIT_PER_DAY=10
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=gpt-image-2.5-sunburst
OPENAI_IMAGE_SIZE=1536x1024
OPENAI_IMAGE_QUALITY=medium
OPENAI_REQUEST_TIMEOUT_MS=120000
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Keep `OPENAI_API_KEY` server-side. Do not add it to `NEXT_PUBLIC_*` variables or commit it to Git.

## Supabase setup

1. Create a Supabase project.
2. Run migrations in `supabase/migrations` in filename order.
3. Confirm the private `project-images` bucket exists and is not public.
4. Add the Vercel origin to Supabase Auth redirect URLs:
   - `https://mart-interior-studio.vercel.app/auth/callback`
   - `https://mart-interior-studio.vercel.app/en/reset-password`
   - `https://mart-interior-studio.vercel.app/ru/reset-password`
5. Verify email confirmation links return through `/auth/callback`.

## Enabling real generation

1. Confirm the OpenAI organization can use GPT Image models.
2. Add `OPENAI_API_KEY` only in Vercel server environment variables.
3. Set `AI_PROVIDER=openai` and `ENABLE_REAL_GENERATION=true`.
4. Keep `GENERATION_LIMIT_PER_DAY` at a conservative value until usage is observed.
5. Check `/api/health` and confirm `realGenerationReady: true` without exposing any secret.

## Smoke test

1. Create an account and confirm the email.
2. Sign in and open `/en/studio` or `/ru/studio`.
3. Use the built-in example first; Demo mode must remain clearly labelled.
4. Save the project and confirm it appears in Projects.
5. Open the project detail page and verify the original image is private.
6. With real generation enabled, upload a suitable room image and verify the result is labelled Live AI.
7. Download the saved result through the protected download route.
8. Repeat the same save request and confirm idempotency prevents duplicate generation history.

## Rollback

If real generation is not ready, set `AI_PROVIDER=mock` and `ENABLE_REAL_GENERATION=false`. The demo flow remains available without paid API calls.
