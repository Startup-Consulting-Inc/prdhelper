#!/bin/bash
# GCP Setup Script for Clearly Deployment
# This script sets up Google Cloud Platform for deploying the Clearly application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ID="clearly-478614"
SERVICE_NAME="clearly"
REGION="us-west1"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Clearly - GCP Deployment Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI not found${NC}"
    echo "Please install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

echo -e "${GREEN}✓ gcloud CLI found${NC}"

# Set project
echo -e "${YELLOW}Setting project to ${PROJECT_ID}...${NC}"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo -e "${YELLOW}Enabling required GCP APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable secretmanager.googleapis.com
echo -e "${GREEN}✓ APIs enabled${NC}"

# Load environment variables from .env
if [ -f .env ]; then
    echo -e "${YELLOW}Loading secrets from .env file...${NC}"
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi

# Function to create or update secret
create_or_update_secret() {
    local SECRET_NAME=$1
    local SECRET_VALUE=$2

    if gcloud secrets describe $SECRET_NAME &> /dev/null; then
        echo -e "${YELLOW}Updating secret: ${SECRET_NAME}${NC}"
        echo -n "$SECRET_VALUE" | gcloud secrets versions add $SECRET_NAME --data-file=-
    else
        echo -e "${YELLOW}Creating secret: ${SECRET_NAME}${NC}"
        echo -n "$SECRET_VALUE" | gcloud secrets create $SECRET_NAME --data-file=- --replication-policy="automatic"
    fi
}

# Create secrets from .env
echo -e "${YELLOW}Setting up secrets in Secret Manager...${NC}"
create_or_update_secret "DATABASE_URL" "$DATABASE_URL"
create_or_update_secret "JWT_SECRET" "$JWT_SECRET"
create_or_update_secret "OPENROUTER_API_KEY" "$OPENROUTER_API_KEY"
create_or_update_secret "GOOGLE_CLIENT_ID" "$GOOGLE_CLIENT_ID"
create_or_update_secret "GOOGLE_CLIENT_SECRET" "$GOOGLE_CLIENT_SECRET"
echo -e "${GREEN}✓ Secrets configured${NC}"

# Grant Cloud Run access to secrets
echo -e "${YELLOW}Granting Cloud Run access to secrets...${NC}"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")
SERVICE_ACCOUNT="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

for SECRET in DATABASE_URL JWT_SECRET OPENROUTER_API_KEY GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET; do
    gcloud secrets add-iam-policy-binding $SECRET \
        --member="serviceAccount:${SERVICE_ACCOUNT}" \
        --role="roles/secretmanager.secretAccessor" \
        --quiet
done
echo -e "${GREEN}✓ Permissions granted${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Review the secrets in Secret Manager:"
echo "   https://console.cloud.google.com/security/secret-manager?project=$PROJECT_ID"
echo ""
echo "2. Deploy your application:"
echo "   ${GREEN}gcloud builds submit --config=cloudbuild.yaml .${NC}"
echo ""
echo "3. After deployment, get your service URL:"
echo "   ${GREEN}gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'${NC}"
echo ""
echo "4. Update Google OAuth callback URL with your Cloud Run URL"
echo ""
