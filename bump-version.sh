#!/bin/bash

# Unguard Version Bumping Script
# This script automates the process of bumping version numbers across all required files
# Completely vibe-coded, use at your own risk.

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# OS-agnostic sed in-place editing
# Usage: sed_inplace 's/pattern/replacement/' file
sed_inplace() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "$1" "$2"
    else
        sed -i "$1" "$2"
    fi
}

# Check if version argument is provided
if [ $# -eq 0 ]; then
    print_error "No version specified"
    echo "Usage: ./bump-version.sh <version>"
    echo "Example: ./bump-version.sh 0.13.0"
    exit 1
fi

NEW_VERSION=$1

# Validate version format (basic semver check)
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format. Expected format: MAJOR.MINOR.PATCH (e.g., 0.13.0)"
    exit 1
fi

print_info "Bumping version to ${NEW_VERSION}"

# Get current version from Chart.yaml
CURRENT_VERSION=$(grep '^version:' chart/Chart.yaml | awk '{print $2}')
print_info "Current version: ${CURRENT_VERSION}"

# Confirm version bump
echo ""
print_warning "This will update the version from ${CURRENT_VERSION} to ${NEW_VERSION} in the following files:"
echo "  - chart/Chart.yaml"
echo "  - chart/values.yaml"
echo "  - chart/README.md"
echo ""
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_info "Version bump cancelled"
    exit 0
fi

# Backup files
print_info "Creating backups..."
cp chart/Chart.yaml chart/Chart.yaml.bak
cp chart/values.yaml chart/values.yaml.bak
cp chart/README.md chart/README.md.bak

# Update chart/Chart.yaml
print_info "Updating chart/Chart.yaml..."
sed_inplace "s/^version: .*/version: ${NEW_VERSION}/" chart/Chart.yaml
sed_inplace "s/^appVersion: .*/appVersion: ${NEW_VERSION}/" chart/Chart.yaml

# Update chart/values.yaml - update all image tags
print_info "Updating chart/values.yaml..."
sed_inplace "s/tag: \".*\"/tag: \"${NEW_VERSION}\"/" chart/values.yaml

# Update chart/README.md
print_info "Updating chart/README.md..."
sed_inplace "s/--version [0-9]\+\.[0-9]\+\.[0-9]\+/--version ${NEW_VERSION}/" chart/README.md

# Verify changes
print_info "Verifying changes..."
echo ""
echo "Chart.yaml version changes:"
diff chart/Chart.yaml.bak chart/Chart.yaml || true
echo ""

# Clean up backups
print_info "Cleaning up backups..."
rm chart/Chart.yaml.bak chart/values.yaml.bak chart/README.md.bak

print_info "✓ Version bumped to ${NEW_VERSION}!"
echo ""
print_info "Next steps:"
echo "  1. Review the changes above"
echo "  2. Commit with: git add chart/Chart.yaml chart/values.yaml chart/README.md"
echo "  3. Commit message: git commit -m '🔖 chore: Bump version to ${NEW_VERSION}'"
echo "  4. Push your changes and create a PR to merge to main"
echo "  5. After merge, create a release branch: git checkout -b release/v${NEW_VERSION}"
echo "  6. Push the release branch: git push origin release/v${NEW_VERSION}"
