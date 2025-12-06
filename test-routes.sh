#!/bin/bash

# Test script to verify SPA routing works correctly
# This script tests that all routes return 200 status code

echo "🧪 Testing SPA Routes..."
echo "========================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Base URL (defaults to localhost)
BASE_URL="${1:-http://localhost:10000}"

# Routes to test
routes=(
  "/"
  "/signup"
  "/login"
  "/profile"
  "/app"
  "/app/dashboard"
  "/app/transactions"
  "/app/expenses"
  "/app/pay-bills"
  "/app/wallet"
  "/app/budget"
  "/app/notifications"
  "/app/insights"
  "/app/beneficiaries"
  "/app/goals"
  "/app/recurring-expenses"
)

failed=0
passed=0

for route in "${routes[@]}"; do
  url="${BASE_URL}${route}"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  
  if [ "$status" -eq 200 ]; then
    echo -e "${GREEN}✓${NC} $route - ${GREEN}$status${NC}"
    ((passed++))
  else
    echo -e "${RED}✗${NC} $route - ${RED}$status${NC}"
    ((failed++))
  fi
done

echo ""
echo "========================"
echo "Results: $passed passed, $failed failed"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}All routes working correctly! ✅${NC}"
  exit 0
else
  echo -e "${RED}Some routes failed! ❌${NC}"
  exit 1
fi
