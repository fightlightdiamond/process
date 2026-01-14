# Contributing Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Setup Development Environment

1. **Clone repository**
   ```bash
   git clone https://github.com/fightlightdiamond/process.git
   cd ngssr
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   App will be available at `http://localhost:4200`

4. **Start JSON Server** (in another terminal)
   ```bash
   npm run api
   ```
   Mock API will be available at `http://localhost:3000`

5. **Run tests** (optional, in another terminal)
   ```bash
   npm test
   ```

## Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/user-profile
# or
git checkout -b fix/user-delete-bug
```

### 2. Make Changes Following Code Guidelines

See `.github/copilot-instructions.md` for:
- Architecture patterns
- Code style
- Component structure
- Testing requirements

### 3. Run Linting & Formatting
```bash
# Auto-fix linting issues
npm run lint:fix

# Auto-format code
npm run format
```

### 4. Write/Update Tests
- Unit tests for components
- Service tests with HttpTestingController
- Reducer tests with property-based testing
- Aim for 80%+ coverage

```bash
npm test -- --watch=false
```

### 5. Commit Changes
```bash
git add .
git commit -m "feat(user): add user profile component"
```

**Commit messages must follow Conventional Commits**:
- `feat:` - New feature
- `fix:` - Bug fix
- `test:` - Test improvements
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Dependencies, configs

**Format**: `type(scope): description`

Examples:
```
feat(user): add user delete functionality
fix(todo): handle null values in reducer
test(user): improve error handling tests
docs: update README with API examples
refactor(shared): extract grid component
```

### 6. Push & Create Pull Request
```bash
git push origin feature/user-profile
```

Then create PR on GitHub with:
- Clear title: `feat(user): add user profile`
- Description of changes
- Screenshots/videos if UI changes
- Reference issues: `Fixes #123`

## Code Style Guide

### TypeScript
- Use `strict` mode (tsconfig.json)
- Explicit types everywhere (no `any`)
- Prefer `const` over `let`
- Use arrow functions in callbacks
- PascalCase for classes/interfaces
- camelCase for functions/properties
- UPPER_SNAKE_CASE for constants

### Angular Components
```typescript
@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [CommonModule, PrimeNG modules],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.css'
})
export class FeatureListComponent {
  @Input() items: Feature[] = [];
  @Output() readonly itemSelect = new EventEmitter<Feature>();
  
  constructor(private service: FeatureService) {}
}
```

**Key rules:**
- `readonly` for @Output
- OnPush change detection required
- Separate files for template/style
- Explicit imports in `imports: []`
- No inline styles/templates (except small cases)

### Reactive Forms
```typescript
form = this.fb.group({
  name: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]]
});

onSubmit() {
  if (this.form.valid) {
    this.submit.emit(this.form.value);
  }
}
```

### CSS/Styling
- Use PrimeNG components when possible
- Custom CSS for specific needs
- BEM naming: `.component__element--modifier`
- Avoid inline styles
- Use CSS variables for theming

```css
.user-list {
  padding: 1rem;
}

.user-list__header {
  background-color: #f8f9fa;
  font-weight: 600;
}

.user-list__item--active {
  background-color: #e3f2fd;
}
```

### Comments
- English for code comments
- Tiếng Việt for error messages & UI labels
- Explain WHY, not WHAT
- Keep comments updated with code

```typescript
// ✅ Good: explains business logic
// User can only delete their own items or items they created
if (this.canDelete(item)) {
  this.delete(item);
}

// ❌ Bad: obvious from code
// Delete the item
this.delete(item);
```

## Testing

### Unit Tests
```bash
npm test -- --include="**/user/**/*.spec.ts" --watch=false
```

### Test Coverage
```bash
npm test -- --watch=false --code-coverage
```

### Writing Tests
- Test public APIs, not implementation
- Mock external dependencies
- Test happy path + error cases
- Use descriptive test names

```typescript
describe('UserListComponent', () => {
  it('should display users in table', () => {
    // Arrange
    component.users = [{ id: '1', name: 'John', email: 'john@ex.com' }];
    
    // Act
    fixture.detectChanges();
    
    // Assert
    expect(fixture.nativeElement.querySelectorAll('tr').length).toBe(1);
  });

  it('should emit deleteUser when delete confirmed', () => {
    // Arrange
    spyOn(component.deleteUser, 'emit');
    const user = { id: '1', name: 'John', email: 'john@ex.com' };
    
    // Act
    component.deleteUser.emit(user);
    
    // Assert
    expect(component.deleteUser.emit).toHaveBeenCalledWith(user);
  });
});
```

## Creating New Features

### Quick Start
```bash
# Generate complete feature structure
npm run g:feature -- --name=product

# Then customize as needed
```

### Manual Structure
```
src/app/features/product/
├── components/
│   ├── product-container/
│   │   ├── product-container.component.ts
│   │   ├── product-container.component.html
│   │   ├── product-container.component.css
│   │   └── product-container.component.spec.ts
│   ├── product-list/
│   ├── product-form/
│   └── index.ts
├── models/
│   ├── product.model.ts
│   └── index.ts
├── services/
│   ├── product-api.service.ts
│   ├── product-api.service.spec.ts
│   └── index.ts
├── store/
│   ├── product.actions.ts
│   ├── product.reducer.ts
│   ├── product.effects.ts
│   ├── product.store.ts
│   ├── product.facade.ts
│   └── index.ts
├── product.routes.ts
├── index.ts
└── README.md
```

## Git Best Practices

### Branch Naming
- Feature: `feature/user-profile`
- Bug fix: `fix/login-validation`
- Hotfix: `hotfix/critical-bug`
- Chore: `chore/update-dependencies`

### Commit Messages
```
# Good
feat(user): add user profile page
  
  - Create user profile component
  - Add profile form validation
  - Add unit tests

# Bad
update user stuff
fixed bug
WIP
```

### Before Pushing
```bash
# Ensure code is properly formatted
npm run lint:fix
npm run format

# Run tests
npm test -- --watch=false

# Check code coverage
npm test -- --watch=false --code-coverage
```

### Pull Request Process
1. Create feature branch
2. Make changes following guidelines
3. Write tests (80%+ coverage)
4. Run `npm run lint:fix && npm run format`
5. Push to GitHub
6. Create PR with description
7. Wait for CI to pass
8. Address review comments
9. Merge when approved

## Common Issues & Solutions

### Port Already in Use
```bash
# Kill process using port 4200
lsof -ti:4200 | xargs kill -9

# Or use different port
ng serve --port 4201
```

### npm Install Issues
```bash
# Clear cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```bash
# Clear karma cache
rm -rf node_modules/.cache

# Run single test file
npm test -- --include="**/user/**/*.spec.ts"

# Run with debugging
npm test -- --browsers=Chrome --watch=true
```

### JSON Server Not Running
```bash
# Check if port 3000 is in use
lsof -ti:3000 | xargs kill -9

# Start JSON Server
npm run api
```

## IDE Setup

### VS Code (Recommended)
1. Install extensions:
   - Angular Language Service
   - Prettier - Code formatter
   - ESLint
   - Thunder Client (API testing)

2. Settings (.vscode/settings.json):
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true,
     "[typescript]": {
       "editor.codeActionsOnSave": {
         "source.fixAll.eslint": true
       }
     }
   }
   ```

### WebStorm
- Enable ESLint in Settings > Languages & Frameworks > TypeScript > ESLint
- Enable Prettier in Settings > Languages & Frameworks > TypeScript > Prettier

## Debugging

### Browser DevTools
1. Open `http://localhost:4200`
2. F12 to open DevTools
3. Set breakpoints in Sources tab
4. Use Redux DevTools extension for state debugging

### Command Line
```bash
# Run tests with debugging
node --inspect-brk ./node_modules/.bin/ng test

# Then open chrome://inspect in Chrome
```

## Performance Tips

- Use OnPush change detection
- Use trackBy in *ngFor
- Use async pipe instead of subscribe
- Lazy load feature routes
- Use virtual scrolling for large lists
- Monitor bundle size

```bash
# Analyze bundle size
ng build --configuration production --stats-json
npm install --global webpack-bundle-analyzer
webpack-bundle-analyzer dist/ngssr/stats.json
```

## Documentation

- Add README.md in feature folders
- Document complex algorithms
- Document API integration
- Update main README.md when adding features
- Keep .github/copilot-instructions.md updated

## Resources

- [Angular Documentation](https://angular.io)
- [RxJS Documentation](https://rxjs.dev)
- [PrimeNG Components](https://primeng.org)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Commit Message Best Practices](https://tbaggery.com/write-small-git-commit-messages.html)

---

**Questions?** Check existing code or create an issue on GitHub.

**Happy coding!** 🚀
