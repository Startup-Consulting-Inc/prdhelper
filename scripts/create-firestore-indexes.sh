#!/bin/bash
# Create Firestore indexes required for collectionGroup queries
#
# These indexes are needed after fixing the scan-all-projects anti-pattern:
# 1. collaborators/userId - for finding shared projects via collectionGroup('collaborators')
# 2. documents/id - for finding a document by ID via collectionGroup('documents')
#
# Usage:
#   Option 1 (Firebase CLI): firebase deploy --only firestore:indexes
#   Option 2 (this script):  bash scripts/create-firestore-indexes.sh
#
# Requires: gcloud CLI authenticated with Firestore Admin permissions

set -e

PROJECT_ID="${FIREBASE_PROJECT_ID:-clearly-478614}"
DATABASE_ID="${FIRESTORE_DATABASE_ID:-clearly}"

echo "Creating Firestore indexes for project: $PROJECT_ID (database: $DATABASE_ID)"
echo ""

# Index 1: collaborators collection group - userId field
# Used by: projects.getAll(), projects.getStats()
echo "Creating index: collaborators/userId (collection group)..."
gcloud firestore indexes fields update userId \
  --project="$PROJECT_ID" \
  --database="$DATABASE_ID" \
  --collection-group="collaborators" \
  --field-config="order=ASCENDING,index-type=collection-group" \
  2>&1 || echo "  (Index may already exist or is being created)"

echo ""

# Index 2: documents collection group - id field
# Used by: documents.getById()
echo "Creating index: documents/id (collection group)..."
gcloud firestore indexes fields update id \
  --project="$PROJECT_ID" \
  --database="$DATABASE_ID" \
  --collection-group="documents" \
  --field-config="order=ASCENDING,index-type=collection-group" \
  2>&1 || echo "  (Index may already exist or is being created)"

echo ""
echo "============================================"
echo "Done! Indexes may take a few minutes to build."
echo "Check status: gcloud firestore indexes fields list --project=$PROJECT_ID --database=$DATABASE_ID"
echo "============================================"
