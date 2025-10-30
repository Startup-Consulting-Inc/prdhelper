#!/bin/bash

# Deployment script for Google Cloud Run
# This script builds a Docker image using Google Cloud Build, pushes it to
# Artifact Registry, and deploys it to a Cloud Run service.

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# Your Google Cloud Project ID
PROJECT_ID="myresume-457817"

# The name of your Cloud Run service
SERVICE_NAME="clearly"

# The Google Cloud region for your service and repository
REGION="us-west1"

# The name for your Artifact Registry repository
REPO_NAME="clearly-repo"

# The final Docker image name
IMAGE_NAME="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"

# --- Script Steps ---

echo "--- Starting Deployment to Google Cloud Run ---"
echo "Project: ${PROJECT_ID}, Service: ${SERVICE_NAME}, Region: ${REGION}"

# 1. Set the current Google Cloud project
echo ""
echo "Step 1: Setting Google Cloud project..."
gcloud config set project ${PROJECT_ID}

# 2. Enable necessary Google Cloud services
echo ""
echo "Step 2: Enabling required Google Cloud services..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com

# 3. Create Artifact Registry repository if it doesn't exist
echo ""
echo "Step 3: Checking for Artifact Registry repository..."
if ! gcloud artifacts repositories describe ${REPO_NAME} --location=${REGION} &> /dev/null; then
  echo "Repository not found. Creating '${REPO_NAME}'..."
  gcloud artifacts repositories create ${REPO_NAME} \
    --repository-format=docker \
    --location=${REGION} \
    --description="Docker repository for the ${SERVICE_NAME} application"
else
  echo "Repository '${REPO_NAME}' already exists."
fi

# 4. Build the Docker image using Cloud Build and push to Artifact Registry
echo ""
echo "Step 4: Building Docker image with Cloud Build..."
gcloud builds submit --tag ${IMAGE_NAME}

# 5. Deploy the image to Cloud Run
echo ""
echo "Step 5: Deploying image to Cloud Run..."
# IMPORTANT: This script does not manage secrets like your DATABASE_URL or JWT_SECRET.
# You must configure these secrets in your Cloud Run service using the Google Cloud console
# or by linking them from Secret Manager.
gcloud run deploy ${SERVICE_NAME} \
  --image=${IMAGE_NAME} \
  --platform=managed \
  --region=${REGION} \
  --allow-unauthenticated \
  --port=3000

echo ""
echo "--- Deployment Complete ---"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --platform=managed --region=${REGION} --format='value(status.url)')
echo "Service '${SERVICE_NAME}' is available at: ${SERVICE_URL}"
echo "NOTE: Remember to update your CLIENT_URL environment variable in the Cloud Run service to this URL to ensure CORS works correctly."
