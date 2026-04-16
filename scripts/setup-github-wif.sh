#!/bin/bash

# One-time setup: Workload Identity Federation for GitHub Actions
#
# This script configures GCP to trust GitHub Actions OIDC tokens,
# allowing the deploy-prod GitHub Actions workflow to authenticate
# without a service account key.
#
# Run this once from a terminal with gcloud authenticated as a project owner.
# Project: clearly-478614
# Repo:    Startup-Consulting-Inc/prdhelper

set -e

PROJECT_ID="clearly-478614"
PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
POOL_NAME="github-actions"
PROVIDER_NAME="github-provider"
SA_EMAIL="1019651592490-compute@developer.gserviceaccount.com"
REPO="Startup-Consulting-Inc/prdhelper"

echo "Setting up Workload Identity Federation for GitHub Actions..."
echo "Project:  $PROJECT_ID"
echo "Number:   $PROJECT_NUMBER"
echo "Repo:     $REPO"
echo ""

# 1. Enable required APIs
echo "Enabling IAM Credentials API..."
gcloud services enable iamcredentials.googleapis.com --project="$PROJECT_ID"

# 2. Create Workload Identity Pool
echo "Creating Workload Identity Pool: $POOL_NAME..."
gcloud iam workload-identity-pools create "$POOL_NAME" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  2>/dev/null || echo "  Pool already exists, skipping."

# 3. Create OIDC Provider for GitHub
echo "Creating OIDC Provider: $PROVIDER_NAME..."
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_NAME" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  2>/dev/null || echo "  Provider already exists, skipping."

# 4. Grant the service account permission to be impersonated by GitHub Actions
echo "Granting workloadIdentityUser role to $SA_EMAIL..."
gcloud iam service-accounts add-iam-policy-binding "$SA_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/$REPO"

# 5. Ensure the service account can trigger Cloud Build
echo "Granting Cloud Build editor role..."
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_EMAIL" \
  --role="roles/cloudbuild.builds.editor" \
  --condition=None

echo ""
echo "Setup complete!"
echo ""
echo "Workload Identity Provider:"
echo "  projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/providers/$PROVIDER_NAME"
echo ""
echo "Service Account:"
echo "  $SA_EMAIL"
echo ""
echo "These values are already configured in .github/workflows/deploy-prod.yml"
