#!/bin/bash

# WindBorne Systems Application Submission Script
echo "🚀 Submitting application to WindBorne Systems..."

# Check if application data exists
if [ ! -f "application-data.json" ]; then
    echo "❌ Error: application-data.json not found"
    echo "Please update application-data.json with your information first"
    exit 1
fi

# Submit the application
echo "📤 Sending application..."
response=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Content-Type: application/json" \
  -d @application-data.json \
  https://windbornesystems.com/career_applications.json)

# Extract response body and status code
http_code=$(echo "$response" | tail -n1)
response_body=$(echo "$response" | head -n -1)

echo "📊 Response Status: $http_code"
echo "📄 Response Body: $response_body"

if [ "$http_code" = "200" ]; then
    echo "✅ Application submitted successfully!"
    echo "🎉 You should hear back from WindBorne Systems within a few days"
else
    echo "❌ Application submission failed"
    echo "Please check your application data and try again"
fi
