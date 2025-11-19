#!/bin/bash
# Fix Secret Manager permissions for Cloud Build
# Project: clearly-478614

PROJECT_ID="clearly-478614"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
BUILD_SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
COMPUTE_SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "🔐 Granting Secret Manager access to service accounts:"
echo "   1. Cloud Build: $BUILD_SERVICE_ACCOUNT"
echo "   2. Cloud Run (Compute): $COMPUTE_SERVICE_ACCOUNT"
echo ""

# List of secrets that need access
SECRETS=(
  "DATABASE_URL"
  "DIRECT_URL"
  "JWT_SECRET"
  "OPENROUTER_API_KEY"
  "GOOGLE_CLIENT_ID"
  "GOOGLE_CLIENT_SECRET"
  "GOOGLE_CALLBACK_URL"
  "GMAIL_USER"
  "GMAIL_APP_PASSWORD"
)

# Grant access to each secret for both service accounts
for SECRET_NAME in "${SECRETS[@]}"; do
  echo "📝 Granting access to: $SECRET_NAME"
  
  # Grant to Cloud Build
  gcloud secrets add-iam-policy-binding $SECRET_NAME \
    --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor" \
    --project=$PROJECT_ID \
    --quiet

  # Grant to Cloud Run (Compute Engine default)
  gcloud secrets add-iam-policy-binding $SECRET_NAME \
    --member="serviceAccount:$COMPUTE_SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor" \
    --project=$PROJECT_ID \
    --quiet
done

echo ""
echo "✅ Permissions granted successfully!"
echo ""
echo "You can now run: gcloud beta builds submit"
