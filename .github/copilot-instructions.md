# GitHub Copilot Instructions for ngssr Project

## Project Overview

This is an Angular Standalone Components project with RxJS state management, using:

- **Framework**: Angular 18+ with Standalone Components
- **State Management**: Custom Redux-like pattern (Actions, Reducers, Effects, Store, Facade)
- **Styling**: PrimeNG components + custom CSS
- **Testing**: Jasmine/Karma + fast-check (property-based testing)
- **Backend**: JSON Server (mock API at http://localhost:3000)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## Project Structure

```
src/app/
├── core/                          # Core services
│   └── services/
│       ├── layout-config.service.ts
│       └── layout.service.ts
├── features/                      # Feature modules (lazy-loaded)
│   ├── todo/
│   │   ├── components/
│   │   │   ├── todo-container/
│   │   │   ├── todo-list/
│   │   │   ├── todo-form/
│   │   │   ├── todo-item/
│   │   │   └── index.ts
│   │   ├── models/
│   │   ├── services/
│   │   ├── store/               # Redux-like: actions, reducer, effects, store, facade
│   │   ├── index.ts
│   │   └── todo.routes.ts
│   └── user/                     # User Management Feature (complete CRUD)
│       ├── components/
│       │   ├── user-container/
│       │   ├── user-list/
│       │   ├── user-form/
│       │   └── index.ts
│       ├── models/
│       ├── services/
│       ├── store/
│       ├── index.ts
│       ├── user.routes.ts
│       └── README.md
├── shared/                       # Shared components & utilities
│   ├── components/
│   │   ├── breadcrumb/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── navigation/
│   │   ├── page-layout/
│   │   └── index.ts
│   ├── constants/
│   ├── grid/                     # Custom Grid system
│   ├── models/
│   ├── utils/
│   ├── validators/
│   └── index.ts
├── app.component.ts              # Root component
├── app.config.ts                 # App config
├── app.routes.ts                 # Main routes with lazy loading
└── ...

tools/
├── generators/                   # Code generators
│   ├── generate-feature.js       # Create feature with all files
│   ├── generate-store.js         # Create store files
│   ├── generate-model.js         # Create model interfaces
│   └── generate-api-service.js   # Create API service
└── ...
```

## Architectural Patterns

### 1. Redux-like State Management

Every feature has its own store with:

```typescript
// store/feature.actions.ts
export enum FeatureActionTypes {
  LOAD = "LOAD_FEATURES",
  ADD = "ADD_FEATURE",
  UPDATE = "UPDATE_FEATURE",
  DELETE = "DELETE_FEATURE",
  // ... + SUCCESS/FAILURE variants
}

export const loadFeatures = () => ({ type: FeatureActionTypes.LOAD });

// store/feature.reducer.ts
export function featureReducer(
  state: FeatureState,
  action: Action
): FeatureState {
  switch (action.type) {
    case FeatureActionTypes.LOAD:
      return { ...state, loading: true };
    // ...
  }
}

// store/feature.effects.ts
@Injectable({ providedIn: "root" })
export class FeatureEffects {
  init(actions$: Subject<Action>, dispatch: (action: Action) => void) {
    merge(this.loadEffect(actions$)).subscribe(
      (action) => action && dispatch(action)
    );
  }

  private loadEffect(actions$) {
    return actions$.pipe(
      filter((a) => a.type === FeatureActionTypes.LOAD),
      switchMap(() =>
        this.apiService.getAll().pipe(
          map((data) => loadSuccess(data)),
          catchError((error) => of(loadFailure(error.message)))
        )
      )
    );
  }
}

// store/feature.store.ts
@Injectable({ providedIn: "root" })
export class FeatureStore {
  private state$ = new BehaviorSubject<FeatureState>(initialState);

  features$ = this.state$.pipe(
    map((s) => s.features),
    distinctUntilChanged()
  );
  loading$ = this.state$.pipe(map((s) => s.loading));

  dispatch(action: Action) {
    this.state$.next(this.reducer(this.state$.value, action));
  }
}

// store/feature.facade.ts
@Injectable({ providedIn: "root" })
export class FeatureFacade {
  features$ = this.store.features$;

  loadFeatures() {
    this.store.dispatch(loadFeatures());
  }
  addFeature(data) {
    this.store.dispatch(addFeature(data));
  }
}
```

### 2. Standalone Components

All components are standalone with OnPush change detection:

```typescript
@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [CommonModule, PrimeNG modules, OtherComponents],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.css'
})
export class FeatureListComponent {
  @Input() data: Feature[] = [];
  @Output() readonly itemSelect = new EventEmitter<Feature>();
}
```

**Key Rules:**

- Use `readonly` for @Input/@Output
- Use OnPush change detection
- Separate template/style files
- Use CommonModule explicitly
- Import all dependencies in `imports: []`

### 3. Smart vs Presentational Components

- **Smart (Container)**: Connects to store/facade, handles orchestration
- **Presentational**: Receives @Input, emits @Output, no store access
- Containers manage state, presentational display UI

### 4. Reactive Forms

All forms use Reactive Forms with validation:

```typescript
form = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  email: ['', [Validators.required, Validators.email]]
});

onSubmit() {
  if (this.form.valid) {
    this.itemSubmit.emit(this.form.value);
  }
}
```

## Naming Conventions

### Files

- **Components**: `feature-list.component.ts`, `feature-list.component.html`, `feature-list.component.css`
- **Services**: `feature.service.ts`, `feature-api.service.ts`
- **Models**: `feature.model.ts`
- **Store**: `feature.actions.ts`, `feature.reducer.ts`, `feature.effects.ts`, `feature.store.ts`, `feature.facade.ts`
- **Tests**: `feature.component.spec.ts`, `feature.service.spec.ts`

### TypeScript

- Classes: PascalCase (`UserComponent`, `UserService`)
- Interfaces: PascalCase with suffix (`UserState`, `User`)
- Functions: camelCase (`loadUsers()`, `saveUser()`)
- Constants: UPPER_SNAKE_CASE (`USER_LIST_COLUMNS`, `MAX_PAGE_SIZE`)
- Properties: camelCase (`userName`, `isLoading`)
- Private: prefix with underscore (`_internalState`)

### CSS Classes

- BEM style for custom CSS: `.feature__header`, `.feature__item--active`
- PrimeNG prefix: `.p-button`, `.p-table`, `.p-card`
- Utility classes: `.me-2` (margin-right), `.w-full` (width: 100%)

## Testing Strategy

### Unit Tests (Jasmine)

- Test component inputs/outputs
- Test service methods
- Test store actions/reducers
- Mock HttpClient with HttpTestingController

```typescript
it("should emit itemSelect when item clicked", () => {
  spyOn(component.itemSelect, "emit");
  const item = { id: "1", name: "Test" };

  component.itemSelect.emit(item);

  expect(component.itemSelect.emit).toHaveBeenCalledWith(item);
});
```

### Property-Based Tests (fast-check)

Used in reducer & service tests for confidence:

```typescript
it("should maintain user count", () => {
  fc.assert(
    fc.property(fc.array(userArbitrary), (users) => {
      const action = loadUsersSuccess(users);
      const result = reducer(initialState, action);
      expect(result.users.length).toBe(users.length);
    }),
    { numRuns: 100 }
  );
});
```

### Test Files Organization

- `*.component.spec.ts` - Component tests (4-8 tests each)
- `*.service.spec.ts` - Service tests with HttpTestingController
- `*.reducer.spec.ts` - Reducer tests with property-based
- `*.effects.spec.ts` - Effects tests (basic instantiation)
- `*.facade.spec.ts` - Facade tests (dispatch verification)

## Code Guidelines

### DO's ✅

1. **Use Reactive Programming**
   - Prefer Observables over Promises
   - Use RxJS operators: `map`, `switchMap`, `filter`, `distinctUntilChanged`, `catchError`
   - Use async pipe in templates: `{{ users$ | async }}`

2. **Use Strict Types**
   - Always type function parameters: `(user: User) => { }`
   - Use interfaces from models: `interface User { id: string; name: string; }`
   - Avoid `any` type

3. **Keep Components Focused**
   - One component = one responsibility
   - Use smart/presentational split
   - Inject only needed services
   - Use @Input/@Output for communication

4. **Error Handling**
   - Always catchError in effects
   - Provide user-friendly error messages (Tiếng Việt)
   - Log errors to console with context

5. **Performance**
   - Use OnPush change detection
   - Use trackBy in \*ngFor: `trackBy: (i, item) => item.id`
   - Unsubscribe properly (use async pipe when possible)

6. **Testing**
   - Test public APIs not implementation
   - Mock dependencies (HttpClient, Services)
   - Test edge cases and error scenarios
   - Aim for >80% coverage

### DON'Ts ❌

1. **Avoid mutable state**

   ```typescript
   // ❌ Wrong
   state.users.push(user);

   // ✅ Right
   return { ...state, users: [...state.users, user] };
   ```

2. **Avoid untyped values**

   ```typescript
   // ❌ Wrong
   const data: any = response;

   // ✅ Right
   const data: User[] = response;
   ```

3. **Avoid calling methods in templates**

   ```typescript
   // ❌ Wrong
   <div *ngIf="getError()">Error</div>

   // ✅ Right
   <div *ngIf="error$ | async as error">{{ error }}</div>
   ```

4. **Avoid big components**
   - If > 200 lines, split into smaller presentational components
   - Move logic to services/facade
   - Move styles to separate files

5. **Avoid nested subscriptions**

   ```typescript
   // ❌ Wrong
   this.service1.getAll().subscribe(data => {
     this.service2.update(data).subscribe(...);
   });

   // ✅ Right
   this.service1.getAll().pipe(
     switchMap(data => this.service2.update(data))
   ).subscribe(...);
   ```

6. **Avoid bare HTTP calls**
   - Always route through API service
   - Always handle errors
   - Always provide feedback to user

## API & Endpoints

**Base URL**: `http://localhost:3000`

### Todo Feature

- `GET /todos` - List all todos
- `POST /todos` - Create todo
- `PUT /todos/:id` - Update todo
- `DELETE /todos/:id` - Delete todo

### User Feature

- `GET /users` - List all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

Error handling:

- 404 Not Found → "Dữ liệu không tìm thấy"
- 500 Server Error → "Lỗi server: 500"
- Network error → "Không thể kết nối đến server"

## Generating New Features

Use the code generators in `tools/generators/`:

```bash
# Generate complete feature
npm run g:feature -- --name=product

# Generate only store
npm run g:store -- --name=product

# Generate model
npm run g:model -- --name=product

# Generate API service
npm run g:api-service -- --name=product
```

This creates:

- Feature directory structure
- Models with interfaces
- API service with CRUD
- Store (actions, reducer, effects, store, facade)
- Components (container, list, form)
- Tests for all files

## Git Commit Convention

Use Conventional Commits:

```
feat(user): add user delete functionality
fix(todo): handle null values in reducer
test(user): improve error handling tests
docs(user): update README

feat: New feature (minor version bump)
fix: Bug fix (patch version bump)
test: Test improvements
docs: Documentation
refactor: Code refactoring without feature change
perf: Performance improvements
chore: Dependencies, configs
```

**Rules:**

- Lowercase subject line
- Reference issue: `feat(todo): add filtering #123`
- Use imperative mood: "add" not "added" or "adds"
- Max 50 chars for subject, 72 for body

## Pre-commit Hooks (Husky)

Automatically runs:

1. ESLint fix
2. Prettier format
3. Commit lint validation

If failing:

```bash
# Fix manually
npm run lint:fix
npm run format

# Or bypass (not recommended)
git commit --no-verify
```

## Language

- **Code comments**: English
- **Error messages**: Tiếng Việt
- **Constants & Messages**: Tiếng Việt
- **Documentation**: English with Tiếng Việt examples

## When Creating New Feature

1. **Analyze requirements**
   - CRUD operations or read-only?
   - Need API integration?
   - Search/filter needed?
   - Pagination required?

2. **Create structure**

   ```bash
   npm run g:feature -- --name=feature-name
   ```

3. **Implement store** (if needed)
   - Define models (interface + type)
   - Create actions with payloads
   - Write pure reducer function
   - Implement effects with error handling
   - Create facade as public API
   - Write comprehensive tests

4. **Create components**
   - Container (smart): orchestrates state & logic
   - List (presentational): displays items
   - Form (presentational): input for create/edit
   - Write tests for @Input/@Output

5. **Add routing**

   ```typescript
   // feature.routes.ts
   export const FEATURE_ROUTES: Routes = [{
     path: '',
     component: FeatureContainerComponent
   }];

   // app.routes.ts
   { path: 'feature', loadChildren: () =>
     import('./features/feature').then(m => m.FEATURE_ROUTES)
   }
   ```

6. **Test thoroughly**
   - Unit tests for all public methods
   - Component input/output tests
   - Store action/reducer tests
   - API error scenarios
   - Aim for 80%+ coverage

7. **Document**
   - Add README.md in feature folder
   - Document API integration
   - Document state management flow
   - Add code comments for complex logic

## Resources

- **Angular**: https://angular.io/docs
- **RxJS**: https://rxjs.dev
- **PrimeNG**: https://primeng.org
- **Jasmine**: https://jasmine.github.io
- **fast-check**: https://github.com/dubzzz/fast-check

## Questions for Clarification

When implementing new features, consider:

1. **State Management**: Should this be in store or component state?
2. **Component Scope**: Smart or presentational?
3. **API Integration**: Which endpoints? Error cases?
4. **Testing**: What are the critical paths?
5. **UI/UX**: PrimeNG component suitable? Custom styling needed?
6. **Performance**: Pagination/virtualization needed?

---

**Last Updated**: January 14, 2026
**Angular Version**: 18+
**Project Status**: Active Development
