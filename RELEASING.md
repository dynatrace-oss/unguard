# Releasing Unguard

This document describes the release process for Unguard. Releases are managed through GitHub Actions workflows that automatically build and publish Docker images and Helm charts when a release branch is created.

## Prerequisites

To create a release, you need:

- **Maintainer access** to the Unguard repository (required to create release branches)
- **Write access** to push commits and tags
- Familiarity with the [commit message conventions](CONTRIBUTING.md#commit-style)

## Release Process Overview

The Unguard release process involves:

1. Bumping the version in the Helm chart and committing the changes
2. Merging the version bump to the `main` branch
3. Creating and pushing a release branch from `main`
4. Waiting for the CI/CD pipeline to build and publish artifacts
5. Creating a GitHub release and tag

## Step-by-Step Instructions

### 1. Bump the Version

You can use the provided script to automate this process:

```bash
./bump-version.sh 0.13.0
```

The script will update all necessary files and create a commit with the proper format.

Alternatively, you can manually update the version numbers in the following files:

#### `chart/Chart.yaml`

Update both `version` and `appVersion` fields:

```yaml
version: 0.13.0      # New version
appVersion: 0.13.0   # New version
```

#### `chart/values.yaml`

Update all image tags to match the new version:

```yaml
userSimulator:
  cronJob:
    jobTemplate:
      container:
        image:
          tag: "0.13.0"  # New version

maliciousLoadGenerator:
  deployment:
    container:
      image:
        tag: "0.13.0"  # New version

# ... and so on for all services:
# - likeService
# - paymentService
# - profileService
# - membershipService
# - userAuthService
# - adService
# - envoyProxy
# - microblogService
# - statusService
# - proxyService
# - frontend
```

#### `chart/README.md`

Update the example installation command with the new version:

```markdown
helm install unguard oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version 0.13.0
```

#### Commit the Version Bump

Commit these changes following the project's commit conventions:

```bash
git add chart/Chart.yaml chart/values.yaml chart/README.md
git commit -m "🔖 chore: Bump version to 0.13.0"
```

### 2. Create a Release Branch

Create a release branch following the naming convention `release/v{VERSION}`:

```bash
# Create the release branch from the version bump commit
git checkout -b release/v0.13.0

# Push the release branch to GitHub
git push origin release/v0.13.0
```

**Note:** Only maintainers can push release branches. The branch protection rules will prevent non-maintainers from creating these branches.

### 3. CI/CD Pipeline Execution

Once the release branch is pushed, the [GitHub Actions release workflow](`.github/workflows/release.yaml`) will automatically:

1. **Extract the version** from the branch name (`release/v0.13.0` → `0.13.0`)
2. **Build Docker images** for all services using Skaffold
3. **Tag images** with the release version
4. **Push images** to GitHub Container Registry (GHCR) at `ghcr.io/dynatrace-oss/unguard`
5. **Update Helm chart** with the correct image tags
6. **Package the Helm chart** with the release version
7. **Push the Helm chart** to GHCR OCI registry at `ghcr.io/dynatrace-oss/unguard/chart/unguard`

You can monitor the workflow execution in the [Actions tab](https://github.com/dynatrace-oss/unguard/actions) on GitHub.

### 4. Tag the Release

After the CI/CD pipeline completes successfully, tag the version bump commit:

```bash
# Ensure you're on the release branch
git checkout release/v0.13.0

# Create an annotated tag
git tag -a v0.13.0 -m "Release v0.13.0"

# Push the tag to GitHub
git push origin v0.13.0
```

### 5. Create a GitHub Release

1. Navigate to the [Releases page](https://github.com/dynatrace-oss/unguard/releases) on GitHub
2. Click **"Draft a new release"**
3. Select the tag you just created (`v0.13.0`)
4. Set the release title (e.g., `v0.13.0` or `Unguard v0.13.0`)
5. Write release notes describing:
    - **New features** added in this release
    - **Bug fixes** included
    - **Breaking changes** (if any)
    - **Security updates** (if applicable)
    - **Upgrade instructions** (if needed)
6. Click **"Publish release"**

## Release Artifacts

Each release produces the following artifacts:

- **Docker images** for all services, available at:
  ```
  ghcr.io/dynatrace-oss/unguard/<service-name>:<version>
  ```

- **Helm chart**, installable via:
  ```bash
  helm install unguard oci://ghcr.io/dynatrace-oss/unguard/chart/unguard --version <version>
  ```

## Version Numbering

Unguard follows [Semantic Versioning](https://semver.org/) with the format `MAJOR.MINOR.PATCH`:

- **MAJOR**: Incompatible API changes or major architectural changes
- **MINOR**: New features in a backwards-compatible manner
- **PATCH**: Backwards-compatible bug fixes

## See Also

- [Contributing Guide](CONTRIBUTING.md) - For commit message conventions
- [Development Guide](docs/DEV-GUIDE.md) - For local development setup
- [Helm Chart README](chart/README.md) - For chart installation instructions
