# GitHub Copilot Instructions for Unguard

Welcome to Unguard! This guide provides essential information for GitHub Copilot to help you contribute effectively to this project.

## Project Overview

Unguard is an **intentionally insecure** cloud-native microservices demo application built with multiple languages and technologies. The application demonstrates various security vulnerabilities for educational and testing purposes.

**Key Technologies:**
- Kubernetes-based microservices architecture
- Languages: Java (Spring), Node.js (Express), .NET, PHP, Python (Flask), Go, Next.js
- Databases: MariaDB, Redis, H2
- Tools: Skaffold, Helm, Docker, Jaeger for tracing

## Critical: Commit Message Format

**ALWAYS follow the commitlint-config-gitmoji format for ALL commits:**

```
:gitmoji: type(scope?): subject
body?
footer?
```

### Required Elements

1. **:gitmoji:** (REQUIRED) - Must be a valid gitmoji code
   - Find the correct emoji: `npx gitmoji-cli --search <keyword>`
   - Examples: `:bug:` for bug fixes, `:sparkles:` for new features, `:memo:` for documentation

2. **type** (REQUIRED) - Must be one of:
   - `feat` - Introducing new features
   - `fix` - Fixing a bug
   - `refactor` - Refactoring code (not introducing features or fixes)
   - `docs` - Add documents
   - `test` - Adding unit tests or e2e tests
   - `perf` - Improving performance
   - `revert` - Reverting changes or commits
   - `style` - Updating the UI and style files
   - `build` - Build artifacts
   - `ci` - Working about CI build system
   - `wip` - Work in progress
   - `chore` - Work with configuration or other stuff

3. **scope** (OPTIONAL) - Examples:
   - Microservice names: `like-service`, `membership-service`, `user-auth-service`, `proxy-service`, etc.
   - General scopes: `docs`, `k8s`, `helm`, `skaffold`, etc.

4. **subject** (REQUIRED) - Must follow proper casing:
   - `Sentence case` for normal sentences
   - `Start Case` for names
   - `PascalCase` for file/class names with that casing style
   - Acronyms are allowed: `HTTP`, `SSL`, `DSL`, `JWT`

### Commit Message Examples

✅ **Good Examples:**
```
:sparkles: feat(like-service): Add new endpoint for like count retrieval
:bug: fix(user-auth-service): Fix JWT token validation error
:memo: docs: Update installation instructions in README
:recycle: refactor(profile-service): Simplify SQL query builder logic
:wrench: chore: Update commitlint configuration
```

❌ **Bad Examples:**
```
Added new feature  # Missing gitmoji and type
:sparkles: add feature  # Missing type, wrong subject case
fix: bug fix  # Missing gitmoji
:bug: fix: fixed the bug  # Subject not in proper case
```

### Pre-commit Hook

The repository has a pre-commit hook that validates commit messages. Install dependencies to enable it:
```bash
npm install
```

To bypass validation (not recommended): `git commit -m "message" -n`

## Important Documentation

**Before making changes, review these documents:**

1. **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Full contribution guidelines including:
   - Commit message format details
   - Contributor License Agreement requirements
   - Code review process

2. **[docs/DEV-GUIDE.md](../docs/DEV-GUIDE.md)** - Local development setup:
   - Prerequisites (Docker, Kubectl, Helm, Skaffold, Minikube/Kind)
   - Local Kubernetes cluster setup
   - Building and deploying with Skaffold
   - Troubleshooting common issues

3. **[docs/FAQ.md](../docs/FAQ.md)** - Common issues and solutions:
   - Kustomize errors
   - ImagePullBackOff errors
   - Exposing Unguard on Minikube

4. **[README.md](../README.md)** - Project overview and quickstart

## Development Workflow

### Local Development

1. **Setup:**
   ```bash
   # Start minikube cluster
   minikube start --addons=ingress --profile unguard
   
   # Verify connection
   kubectl get nodes
   ```

2. **Build and Deploy:**
   ```bash
   # First build takes ~20 minutes
   skaffold run
   
   # For auto-rebuild on changes
   skaffold dev
   ```

3. **Access Application:**
   - Add to `/etc/hosts`: `<minikube-ip> unguard.kube`
   - Access at: http://unguard.kube/

4. **Cleanup:**
   ```bash
   skaffold delete
   ```

### Testing Changes

- Each microservice has its own README with specific testing instructions
- Run service-specific tests before submitting PRs
- Ensure changes don't break existing functionality (unless intentionally fixing a vulnerability)

## Architecture Notes

**Microservices Structure:**
- `src/` contains all microservices, each in their own directory
- Each service has its own Dockerfile and dependencies
- Services communicate via REST APIs
- Most services use Kubernetes DNS for service discovery

**Key Services:**
- `frontend/` - Next.js application
- `user-auth-service/` - Node.js Express (JWT authentication)
- `microblog-service/` - Java Spring (main blog functionality)
- `proxy-service/` - Java Spring (SSRF vulnerable)
- `profile-service/` - Java Spring (SQL injection vulnerable)
- `membership-service/` - .NET 7 (SQL injection vulnerable)
- `like-service/` - PHP (SQL injection vulnerable)
- `status-service/` - Go (deployment health)
- `payment-service/` - Python Flask (payment processing)
- `ad-service/` - .NET 5 (ad serving)

## Code Style Guidelines

**General:**
- Follow existing patterns in each service's codebase
- Match the coding style of the language/framework being used
- Use meaningful variable and function names
- Add comments only when necessary to explain complex logic

**Language-Specific:**
- **Java**: Follow Spring Boot conventions
- **Node.js**: Use modern ES6+ syntax
- **Python**: Follow PEP 8
- **.NET**: Follow Microsoft C# conventions
- **Go**: Follow standard Go formatting (use `gofmt`)
- **PHP**: Follow PSR standards where applicable

## Security Considerations

**Important:** This application is **intentionally vulnerable** for demonstration purposes.

When contributing:
- Understand that some vulnerabilities are intentional
- Only fix security issues if explicitly requested
- Document any security-related changes clearly
- Don't remove intentional vulnerabilities without discussion

## Pull Request Process

1. Ensure all commits follow the commitlint format
2. Update relevant documentation if needed
3. Test changes locally using `skaffold dev`
4. Reference related issues in PR description
5. All PRs require review before merging
6. Sign the Contributor License Agreement (CLA) if first-time contributor

## Quick Reference Commands

```bash
# Install commit hook dependencies
npm install

# Search for gitmoji
npx gitmoji-cli --search <keyword>

# Build and run locally
skaffold run

# Development mode with auto-rebuild
skaffold dev

# Delete deployment
skaffold delete

# Check Kubernetes resources
kubectl get pods -n unguard
kubectl logs <pod-name> -n unguard
```

## Getting Help

- Check [docs/FAQ.md](../docs/FAQ.md) for common issues
- Review service-specific READMEs in `src/<service-name>/`
- Check [docs/DEV-GUIDE.md](../docs/DEV-GUIDE.md) for setup help
- Refer to [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines

## Remember

✅ **Always** use proper gitmoji + type + subject format in commits
✅ **Always** check existing documentation before making changes  
✅ **Always** test changes locally before submitting PR
✅ **Always** follow language-specific conventions
✅ **Always** update documentation when changing functionality

❌ **Never** commit without proper gitmoji format
❌ **Never** remove intentional security vulnerabilities without discussion
❌ **Never** skip the CLA requirement
❌ **Never** push breaking changes without proper testing
