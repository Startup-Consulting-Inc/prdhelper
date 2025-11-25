#!/bin/bash

# Set project 
gcloud config set project clearly-478614

# Deploy to production
gcloud builds submit --config=cloudbuild.prod.yaml