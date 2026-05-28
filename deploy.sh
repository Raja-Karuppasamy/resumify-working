#!/bin/bash
set -e

echo "🔨 Building Docker image..."
docker build --no-cache \
  --build-arg NEXT_PUBLIC_API_URL=https://api.resumifyapi.com \
  --build-arg NEXT_PUBLIC_APP_URL=https://resumifyapi.com \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://msjhrsnyuftyaykxpmux.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zamhyc255dWZ0eWF5a3hwbXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDIxOTUsImV4cCI6MjA3OTkxODE5NX0.OdnQonnI-S_JOrRs52AHxprG2vj1NsgQa_aG6q1_-h0 \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Sp8Pc1huLM0ohjUcxKIaXx4v3bm0CB9YsmKM7q87IMTcRRsb7A7tv5o296lRsOh8LYS1emlRTOc3Dts8bGX0SJe00T3AYYMHq \
  --platform linux/amd64 \
  -t rajajeba/resumify-frontend:latest .

echo "📤 Pushing to Docker Hub..."
docker push rajajeba/resumify-frontend:latest

echo "🚀 Restarting deployment on GKE..."
kubectl rollout restart deployment resumify-frontend

echo "⏳ Waiting for rollout..."
kubectl rollout status deployment resumify-frontend

echo "✅ Done! resumifyapi.com updated."
