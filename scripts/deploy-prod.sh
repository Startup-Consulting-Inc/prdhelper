#!/bin/bash

# Deploy to Production Environment
# Service: clearly
# URL: https://www.clearlyreqs.com

set -e

echo "🚀 Deploying to PRODUCTION environment..."
echo "Service: clearly"
echo "Region: us-west1"
echo ""

# Strong confirmation for production
echo "⚠️  WARNING: This will deploy to PRODUCTION!"
read -p "Are you sure you want to deploy to production? (yes/NO) " -r
echo
if [[ ! $REPLY == "yes" ]]
then
    echo "Deployment cancelled. Type 'yes' to confirm production deployment."
    exit 1
fi

echo "📦 Starting Cloud Build..."
gcloud builds submit \
  --config=cloudbuild.prod.yaml \
  --project=clearly-478614 \
  .

echo ""
echo "✅ Production deployment complete!"
echo "🌐 Service URL: https://www.clearlyreqs.com"
echo ""
echo "To view logs:"
echo "  gcloud run services logs read clearly --region=us-west1"
echo ""
echo "To check service status:"
echo "  gcloud run services describe clearly --region=us-west1"
echo ""
echo "To rollback if needed:"
echo "  gcloud run services update-traffic clearly --to-revisions=PREVIOUS_REVISION=100 --region=us-west1"
