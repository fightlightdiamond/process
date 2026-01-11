# Angular Todo App with RxJS Store

A modern, feature-based Angular 17 Todo application with custom RxJS state management, Server-Side Rendering (SSR), and comprehensive testing.

## 🚀 Features

- **CRUD Operations**: Create, Read, Update, Delete todos
- **Custom RxJS Store**: Redux-like state management without NgRx
- **Server-Side Rendering**: Angular SSR with hydration
- **Feature-Based Architecture**: Scalable, maintainable code structure
- **Component-Driven Design**: Smart/Container and Presentational components
- **Property-Based Testing**: Using fast-check for comprehensive test coverage
- **Code Quality**: ESLint, Prettier, Commitlint, Husky

## 📁 Project Structure

```
src/app/
├── features/                    # Feature modules
│   └── todo/                    # Todo feature
│       ├── components/          # Feature components
│       │   ├── todo-container/  # Smart component (connects to store)
│       │   ├── todo-form/       # Presentational (add/edit form)
│       │   ├── todo-item/       # Presentational (single todo)
│       │   └── todo-list/       # Presentational (todo list)
│       ├── models/              # Feature models
│       │   └── todo.model.ts
│       ├── services/            # Feature services
│       │   └── todo-api.service.ts
│       ├── store/               # Feature state management
│       │   ├── todo.actions.ts  # Action creators
│       │   ├── todo.reducer.ts  # Pure reducer function
│       │   ├── todo.effects.ts  # Side effects (API calls)
│       │   ├── todo.store.ts    # RxJS store
│       │   └── todo.facade.ts   # Simplified API for components
│       ├── todo.routes.ts       # Feature routes
│       └── index.ts             # Public API
├── shared/                      # Shared utilities
│   ├── constants/               # Application constants
│   ├── utils/                   # Utility functions
│   └── validators/              # Custom validators
├── environments/                # Environment configs
└── app.routes.ts                # Root routes (lazy loading)
```

## 🛠️ Tech Stack

- **Framework**: Angular 17
- **State Management**: Custom RxJS Store (BehaviorSubject + Reducer pattern)
- **UI Library**: PrimeNG 17
- **Backend**: JSON Server (mock API)
- **Testing**: Jasmine, Karma, fast-check (property-based testing)
- **Code Quality**: ESLint, Prettier, Commitlint, Husky

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd ngssr

# Install dependencies
npm install
```

## 🚀 Running the Application

### Development Mode

```bash
# Start JSON Server (API)
npm run api

# Start Angular dev server (in another terminal)
npm start
```

Open http://localhost:4200 in your browser.

### Production Build

```bash
npm run build
```

### SSR Mode

```bash
npm run build
npm run serve:ssr:ngssr
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --code-coverage
```

### Test Coverage

- **230+ tests** including unit tests and property-based tests
- Property-based testing with fast-check for comprehensive coverage
- Tests for components, store, reducer, effects, and services

## 📝 Code Quality

### Linting

```bash
# Check lint errors
npm run lint

# Fix lint errors
npm run lint:fix
```

### Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation
- style:    Code style (formatting)
- refactor: Code refactoring
- perf:     Performance improvements
- test:     Adding tests
- build:    Build system changes
- ci:       CI configuration
- chore:    Maintenance tasks
```

Examples:

```bash
git commit -m "feat(todo): add delete functionality"
git commit -m "fix(store): resolve state mutation issue"
git commit -m "test(reducer): add property-based tests"
```

## 🏗️ Architecture

### State Management Flow

```
Component → Facade → Store → Reducer → State
                ↓
            Effects → API Service → HTTP
                ↓
            Success/Failure Action → Reducer → State
```

### Component Architecture

```
TodoContainerComponent (Smart)
├── TodoFormComponent (Presentational)
└── TodoListComponent (Presentational)
    └── TodoItemComponent (Presentational)
```

**Smart Components**:

- Connect to store via Facade
- Handle business logic
- Pass data to presentational components

**Presentational Components**:

- Receive data via @Input
- Emit events via @Output
- No service injection
- Pure rendering logic

## 🔧 Code Generators

Generate new features quickly:

```bash
# Generate a new feature
npm run g:feature <feature-name>

# Generate a store
npm run g:store <store-name>

# Generate an API service
npm run g:api-service <service-name>
```

## 📋 API Endpoints

JSON Server provides these endpoints:

| Method | Endpoint   | Description   |
| ------ | ---------- | ------------- |
| GET    | /todos     | Get all todos |
| POST   | /todos     | Create a todo |
| PATCH  | /todos/:id | Update a todo |
| DELETE | /todos/:id | Delete a todo |

## 🔒 Security Features

- Input validation and sanitization
- XSS protection (HTML character removal)
- Type guards for runtime validation
- No hardcoded secrets or API keys

## 📊 Performance Optimizations

- **OnPush Change Detection**: All components use OnPush strategy
- **Lazy Loading**: Features loaded on demand
- **TrackBy Functions**: Optimized list rendering
- **distinctUntilChanged**: Prevents unnecessary re-renders

## 🎨 ESLint Rules

50+ Angular-specific ESLint rules including:

- Component best practices
- Template accessibility
- Lifecycle hooks validation
- Input/Output conventions

## 📄 License

MIT License

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
