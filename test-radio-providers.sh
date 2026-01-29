#!/bin/bash

# Test script for Radio Multi-Provider implementation

echo "======================================"
echo "Radio Multi-Provider Test Suite"
echo "======================================"
echo ""

BASE_URL="http://localhost:3000/api/v1"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check provider status
echo -e "${BLUE}Test 1: Get Provider Status${NC}"
echo "GET ${BASE_URL}/radio/providers"
echo ""
curl -s "${BASE_URL}/radio/providers" | jq '.'
echo ""
echo ""

# Test 2: Search all providers
echo -e "${BLUE}Test 2: Search All Providers (Jazz)${NC}"
echo "GET ${BASE_URL}/radio/search?query=jazz&limit=5"
echo ""
curl -s "${BASE_URL}/radio/search?query=jazz&limit=5" | jq '.data[] | {name, country, sourceProviders}'
echo ""
echo ""

# Test 3: Search specific provider
echo -e "${BLUE}Test 3: Search Radio Browser Only${NC}"
echo "GET ${BASE_URL}/radio/search?query=news&limit=5&providers=radio_browser"
echo ""
curl -s "${BASE_URL}/radio/search?query=news&limit=5&providers=radio_browser" | jq '.data[] | {name, country, source: .sourceProviders}'
echo ""
echo ""

# Test 4: Search by country
echo -e "${BLUE}Test 4: Search by Country (USA)${NC}"
echo "GET ${BASE_URL}/radio/search?country=USA&limit=5"
echo ""
curl -s "${BASE_URL}/radio/search?country=USA&limit=5" | jq '.data[] | {name, country, language}'
echo ""
echo ""

# Test 5: Search by language
echo -e "${BLUE}Test 5: Search by Language (English)${NC}"
echo "GET ${BASE_URL}/radio/search?language=english&limit=5"
echo ""
curl -s "${BASE_URL}/radio/search?language=english&limit=5" | jq '.data[] | {name, language, tags}'
echo ""
echo ""

# Test 6: Check deduplication
echo -e "${BLUE}Test 6: Check Deduplication${NC}"
echo "GET ${BASE_URL}/radio/search?query=bbc&limit=10"
echo "Should merge results from multiple providers..."
echo ""
curl -s "${BASE_URL}/radio/search?query=bbc&limit=10" | jq '.data[] | {name, sourceProviders, streamUrl}'
echo ""
echo ""

echo -e "${GREEN}======================================"
echo "Tests Complete!"
echo "=====================================${NC}"
echo ""
echo "Notes:"
echo "- 'sourceProviders' field shows which providers contributed to each result"
echo "- Stations with multiple providers have merged metadata"
echo "- Results are sorted by provider priority and popularity"
