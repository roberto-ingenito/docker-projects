You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

### Local State

Lives inside a single component. Use when the data is not needed by others.

```typescript
@Component({ ... })
export class ProductsComponent {
  searchQuery = signal('');
  isLoading   = signal(false);
  products    = signal<Product[]>([]);
}
```

### Global State — Service + Signals

A shared injectable service used across multiple components. This is the recommended Angular-native approach.

```typescript
@Injectable({ providedIn: 'root' })
export class AuthStore {
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  login(user: User) {
    this.currentUser.set(user);
  }
  logout() {
    this.currentUser.set(null);
  }
}
```

```typescript
// In any component
export class NavbarComponent {
  auth = inject(AuthStore);
  // template: {{ auth.currentUser()?.name }}
}
```

### When to Use What

| Situation                              | Solution                    |
| -------------------------------------- | --------------------------- |
| Data used by a single component        | Local state with `signal()` |
| Data shared across multiple components | Service + Signals           |
| Enterprise app with complex logic      | NgRx or NgRx SignalStore    |

---

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

---

## Project Structure

### Full Tree

```
src/app/
│
├── core/                        # exists only once in the app
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   └── services/
│       └── auth.store.ts
│
├── shared/                      # reusable across multiple features
│   ├── components/
│   │   ├── page-header/
│   │   └── confirm-dialog/
│   ├── pipes/
│   │   └── currency-ita.pipe.ts
│   └── utils/
│       └── date.utils.ts
│
├── layout/                      # app shell
│   ├── sidebar/
│   ├── navbar/
│   └── layout.component.ts
│
├── features/                    # one folder per domain
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── users/
│   │   ├── pages/
│   │   │   ├── users-list/
│   │   │   └── user-detail/
│   │   ├── components/
│   │   │   └── user-card/
│   │   ├── users.store.ts
│   │   └── users.routes.ts
│   │
│   └── reports/
│       ├── pages/
│       ├── reports.store.ts
│       └── reports.routes.ts
│
├── app.routes.ts
├── app.config.ts
└── app.component.ts
```

### The Three Main Folders

| Folder      | Rule                                                            | Examples                            |
| ----------- | --------------------------------------------------------------- | ----------------------------------- |
| `core/`     | Only one instance exists in the entire app                      | `AuthStore`, guards, interceptors   |
| `shared/`   | Reusable across different features, zero business logic         | `PageHeaderComponent`, pipes, utils |
| `features/` | Self-contained per domain, owns its pages, components and store | `users/`, `dashboard/`, `reports/`  |

### Golden Rule

> If a component is used in **two different features** → it belongs in `shared/`
> If it is used **only within one feature** → it stays inside that feature
> If it exists **only once** in the app → it belongs in `core/`

### Internal Structure of a Feature

```
features/users/
├── pages/                  # components tied to routes
│   ├── users-list/
│   └── user-detail/
├── components/             # components used only within this feature
│   └── user-card/
├── users.store.ts          # feature state
└── users.routes.ts         # feature routes
```
