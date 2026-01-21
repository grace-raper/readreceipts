# GitHub Actions Deployment

This workflow automatically deploys the Read Receipts app to AWS S3 and invalidates CloudFront cache when changes are pushed to the `main` branch.

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository settings (`Settings` → `Secrets and variables` → `Actions`):

### AWS Credentials
- `AWS_ACCESS_KEY_ID` - Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key
- `AWS_REGION` - AWS region (e.g., `us-west-2`) - Optional, defaults to `us-west-2`

### S3 and CloudFront
- `S3_BUCKET` - Name of your S3 bucket (e.g., `readreceipts.xyz`)
- `CLOUDFRONT_DISTRIBUTION_ID` - Your CloudFront distribution ID (e.g., `E1234567890ABC`)

### PostHog Analytics
- `VITE_POSTHOG_API_KEY` - Your PostHog project API key
- `VITE_POSTHOG_HOST` - PostHog host URL (optional, defaults to `https://us.i.posthog.com`)

## How to Set Up

1. **Create an S3 bucket** for static website hosting
2. **Create a CloudFront distribution** pointing to your S3 bucket
3. **Create an IAM user** with the following permissions:
   - `s3:PutObject`
   - `s3:DeleteObject`
   - `s3:ListBucket`
   - `cloudfront:CreateInvalidation`
4. **Add the secrets** to your GitHub repository
5. **Push to main** - the workflow will automatically deploy

## Workflow Triggers

- Push to `main` branch
- Pull request merged to `main`

## Build Output

The Vite build creates a `dist/` folder which is synced to S3 with optimized cache headers:

- **HTML files**: No cache (immediate updates)
- **JS/CSS files**: 1 hour cache with revalidation
- **Images**: 24 hour cache with revalidation
- **Fonts**: 1 year cache (immutable)

## CloudFront Invalidation

The workflow creates two invalidations:
1. Targeted paths for main routes (`/index.html`, `/about`, `/feedback`, etc.)
2. Wildcard invalidation for all files (`/*`)

Changes typically propagate within 1-5 minutes.

## Local Testing

To test the build locally before deploying:

```bash
npm run build
npm run preview
```

This will build the app and serve it locally at `http://localhost:4173`.
