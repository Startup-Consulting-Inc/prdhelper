#!/bin/bash

# Deploy to Staging Environment
# Service: clearly-stage
# URL: https://stage.clearlyreqs.com (configure this domain in Cloud Run)

set -e

echo "🚀 Deploying to STAGING environment..."
echo "Service: clearly-stage"
echo "Region: us-west1"
echo ""

# Confirm deployment
read -p "Deploy to staging? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Deployment cancelled."
    exit 1
fi

echo "📦 Starting Cloud Build..."
gcloud builds submit \
  --config=cloudbuild.stage.yaml \
  --project=clearly-478614 \
  .

echo ""
echo "✅ Staging deployment complete!"
echo "🌐 Service URL: https://clearly-stage-[hash]-uw.a.run.app"
echo ""
echo "To view logs:"
echo "  gcloud run services logs read clearly-stage --region=us-west1"
echo ""
echo "To check service status:"
echo "  gcloud run services describe clearly-stage --region=us-west1"
