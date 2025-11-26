#!/bin/bash

# Set project 
gcloud config set project clearly-478614

# Deploy to staging
gcloud builds submit --config=cloudbuild.stage.yaml