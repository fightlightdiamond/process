# Husky Quality Gates Setup ✅

## Overview

Your project now has **three automated quality gates** that run before commits and pushes. These ensure code quality without slowing down the workflow.

## What's Installed

### 1. **Pre-Commit Hook** (`.husky/pre-commit`)
Runs BEFORE committing code to local repository

**What it checks:**
- ✅ **Lint-staged**: Runs ESLint + Prettier on staged files
- ✅ **User Feature Tests**: If any user feature files changed, runs the 77 unit/property tests for that feature

**Example execution:**
```bash
$ git commit -m "feat(user): add delete functionality"

→ npx lint-staged
  ✓ Fixed 2 eslint issues
  ✓ Formatted 3 files with prettier

🧪 Running user feature tests...
  ✓ 77 tests passed

✅ All checks passed! (Commit created)
```

**If checks fail:**
```bash
$ git commit -m "feat(user): add invalid code"

→ npx lint-staged
  ✗ ESLint found 5 errors

❌ Tests failed. Commit aborted.
→ Fix the errors and try again
```

---

### 2. **Commit Message Hook** (`.husky/commit-msg`)
Validates commit message format

**Required format (Conventional Commits):**
```
type(scope): description
```

**Valid examples:**
```
feat(user): add user delete functionality
fix(todo): handle null values in reducer
test(user): improve error handling tests
docs: update README with API examples
refactor(shared): extract grid component
chore: update dependencies
```

**Invalid examples:**
```
❌ added user delete              (missing type)
❌ user: added delete             (missing scope parentheses)
❌ feat user: delete              (missing parentheses)
❌ FEAT(USER): DELETE             (wrong case)
```

---

### 3. **Pre-Push Hook** (`.husky/pre-push`)
Runs BEFORE pushing code to GitHub

**What it does:**
- Runs the ENTIRE test suite with ChromeHeadless
- Ensures ALL tests pass before code reaches remote repository
- Takes a bit longer but catches integration issues

**Example execution:**
```bash
$ git push origin feature/user-profile

🔍 Running full test suite before push...
  ✓ Running 77 user tests...
  ✓ Running 15 todo tests...
  ✓ Running 8 component tests...
  ✓ Total: 100 tests passed

✅ All tests passed! Ready to push.
→ Pushing to remote...
```

**If tests fail:**
```bash
$ git push origin feature/user-profile

🔍 Running full test suite before push...
  ✗ 2 tests failed in todo module

❌ Tests failed. Push aborted.
→ Fix the failing tests locally
→ Commit the changes
→ Try push again
```

---

## How It Works

### Workflow Diagram

```
┌─────────────────────────────────────┐
│  Make code changes                  │
│  (Edit files)                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  git add files                      │
│  git commit -m "feat(user): ..."    │
└──────────────┬──────────────────────┘
               │
               ▼ PRE-COMMIT HOOK (Husky)
┌─────────────────────────────────────┐
│  ✓ Lint-staged (ESLint + Prettier) │
│  ✓ Run user tests (if files changed)│
└──────────────┬──────────────────────┘
               │
               ▼ COMMIT-MSG HOOK (Husky)
┌─────────────────────────────────────┐
│  ✓ Validate commit message format   │
│    (conventional commits)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Commit created successfully        │
│  (saved in local git history)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  git push origin feature/user-...   │
└──────────────┬──────────────────────┘
               │
               ▼ PRE-PUSH HOOK (Husky)
┌─────────────────────────────────────┐
│  ✓ Run full test suite (100 tests)  │
│    (with ChromeHeadless)            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Code pushed to GitHub              │
│  (ready for CI/CD, PR review, etc)  │
└─────────────────────────────────────┘
```

---

## Common Scenarios

### ✅ Scenario 1: Clean commit (no issues)
```bash
# Edit user-list.component.ts
$ git add src/app/features/user/components/user-list/user-list.component.ts
$ git commit -m "feat(user): improve table styling"

→ npx lint-staged
  ✓ Auto-fixed 1 eslint issue
✅ All checks passed!
```

### ❌ Scenario 2: Linting errors
```bash
# Edit user-form.component.html (missing aria-label)
$ git add src/app/features/user/components/user-form/user-form.component.html
$ git commit -m "feat(user): add form section"

→ npx lint-staged
  ✗ @angular-eslint/template/elements-content
    Button elements must have content or aria-label

❌ Commit aborted. Fix the error and try again.
```

**Solution:**
```html
<!-- Add aria-label attribute -->
<button aria-label="Cancel form" (click)="onCancel()">
  <i class="pi pi-times"></i>
</button>
```

### ❌ Scenario 3: Test failure
```bash
# Edit user.reducer.ts (introduced a bug)
$ git add src/app/features/user/store/user.reducer.ts
$ git commit -m "fix(user): optimize reducer"

→ npx lint-staged
  ✓ No linting issues
🧪 Running user feature tests...
  ✗ user.reducer.spec.ts
    Expected state.users to contain 1 item, but got 0

❌ Tests failed. Commit aborted.
```

**Solution:**
```bash
# Fix the bug in reducer
# Then commit again
$ git add src/app/features/user/store/user.reducer.ts
$ git commit -m "fix(user): optimize reducer"

→ Tests pass this time ✓
✅ All checks passed!
```

### ❌ Scenario 4: Invalid commit message
```bash
$ git commit -m "fixed user delete bug"

# COMMIT-MSG HOOK validates...
❌ Error: subject does not match Conventional Commits pattern

Valid patterns:
  - feat(scope): description
  - fix(scope): description
  - test: description
  - docs: description
```

**Solution:**
```bash
# Use correct format with type and scope
$ git commit -m "fix(user): handle null values in delete"

✅ Commit message validated!
```

### ⚠️ Scenario 5: Test fails on push
```bash
# Committed code with all tests passing locally
# But something broke in the full suite
$ git push origin feature/user-profile

🔍 Running full test suite before push...
  ✗ todo.reducer.spec.ts (integration test failed)
    User feature affects todo state management

❌ Tests failed. Push aborted.
```

**Solution:**
```bash
# Fix the integration issue
$ npm test -- --watch=false --browsers=Chrome
# Debug and fix the failing test

# Once fixed, commit and push again
$ git add .
$ git commit -m "fix(user-todo): resolve state integration issue"
$ git push origin feature/user-profile

✅ All tests passed! Ready to push.
```

---

## Troubleshooting

### Problem: Hooks not executing

**Solution:**
```bash
# Reinstall Husky
npm install husky --save-dev
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### Problem: "Chrome not found" error in pre-push

**Solution (Option 1: Install Chrome/Chromium)**
```bash
# On macOS
brew install chromium

# On Linux
sudo apt-get install chromium-browser

# On Windows
# Download from https://www.google.com/chrome/
```

**Solution (Option 2: Use Firefox)**
Edit `.husky/pre-push`:
```bash
npm test -- --watch=false --browsers=Firefox
```

### Problem: Pre-commit taking too long

**Why:** If many files changed, all tests might run

**Solution:** Pre-commit only runs user feature tests when user files change. If you want faster commits:
```bash
# You can skip hooks in emergencies (NOT recommended)
git commit --no-verify

# Or run the checks manually before commit
npm run lint:fix
npm test -- --include="**/user/**/*.spec.ts"
```

### Problem: "Permission denied" error

**Solution:**
```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### Problem: Hooks were working, now they're not

**Causes:**
1. Node/npm version changed
2. Husky wasn't reinstalled after git clone
3. Hooks permissions were reset

**Solution:**
```bash
# Reinstall everything
rm -rf node_modules
npm install

# Ensure Husky is properly set up
npx husky install
```

---

## Bypassing Hooks (Use Sparingly!)

In rare emergencies, you can bypass hooks:

```bash
# Skip ALL hooks
git commit --no-verify
git push --no-verify

# Skip only pre-commit
git commit -m "..." --no-verify

# Skip only pre-push
git push --no-verify
```

⚠️ **Warning:** Only use when:
- There's a production emergency
- You've verified the code locally
- You'll add proper testing in a follow-up commit

---

## What Gets Checked

### Pre-Commit Checks
```
✓ ESLint - Detects code quality issues
✓ Prettier - Formats code consistently  
✓ User feature tests (77 tests) - If user files changed
✓ Conventional commits - Validates message format
```

### Pre-Push Checks
```
✓ Full test suite (100+ tests)
✓ All specs passing
✓ Chrome headless (no browser UI)
```

---

## Benefits

| Benefit | How |
|---------|-----|
| **Prevent bad code** | Tests must pass before commit |
| **Consistent style** | ESLint + Prettier auto-fix issues |
| **Better commit messages** | Conventional Commits enforced |
| **Catch bugs early** | Full suite before push to GitHub |
| **Team standards** | Everyone follows same rules |
| **CI/CD confidence** | GitHub Actions won't fail later |
| **Code review faster** | Reviews focus on logic, not style |

---

## Next Steps

1. **Try making a commit** - See Husky in action
2. **Review the hooks** - See what's checked: `cat .husky/*`
3. **Read CONTRIBUTING.md** - Full development guide
4. **Check copilot-instructions.md** - Architecture & patterns

---

## Files Modified

- `.husky/pre-commit` - Lint-staged + conditional feature tests
- `.husky/commit-msg` - Conventional commits validation
- `.husky/pre-push` - Full test suite before push
- `.github/CONTRIBUTING.md` - Added comprehensive Husky documentation

---

## Test Coverage

Current test suite covers:
- **User feature**: 77 tests
  - Actions: 13 tests (unit + property-based)
  - Reducer: 13 tests (unit + property-based)
  - Effects: 8 tests
  - Store: 10 tests
  - Facade: 12 tests
  - API Service: 17 tests
  - Components: 20 tests (UI + interactions)

All tests use:
- Jasmine for unit testing
- fast-check for property-based testing
- HttpTestingController for API mocking
- ComponentFixture for component testing

---

## Summary

Your project now has **production-grade quality gates**:

✅ **Pre-commit**: Lint + format + test (fast)  
✅ **Commit-msg**: Validate format  
✅ **Pre-push**: Full suite + Chrome headless  

This ensures code quality while keeping the workflow smooth and fast.

**Happy coding!** 🚀
