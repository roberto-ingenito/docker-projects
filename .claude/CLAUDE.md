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

## UI Design System

The UI must be **minimal and elegant** throughout the entire project. Every component, page, and layout must follow these guidelines consistently — no exceptions.

### Philosophy

- Less is more: remove anything that does not serve a clear purpose
- Whitespace is a design element, use it generously
- No decorative shadows, gradients, or borders unless they carry meaning
- Prefer subtle transitions over flashy animations

### Typography

- **Primary font:** `Lora` (serif) — for headings and display text
- **UI font:** `Inter` — for body text, labels, inputs, and data
- Load both from Google Fonts

```scss
// styles/typography.scss
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap');

:root {
  --font-display: 'Lora', Georgia, serif;
  --font-ui: 'Inter', system-ui, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 600;
}
body {
  font-family: var(--font-ui);
  font-weight: 400;
}
```

### Color Palette

Neutral palette only. The accent is a single, muted tone — never saturated.

```scss
// styles/tokens.scss

:root {
  // Neutrals
  --color-white: #ffffff;
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-200: #e4e4e7;
  --color-gray-400: #a1a1aa;
  --color-gray-600: #52525b;
  --color-gray-800: #27272a;
  --color-black: #09090b;

  // Accent — muted warm gray with a hint of stone
  --color-accent: #78716c;
  --color-accent-subtle: #e7e5e4;

  // Semantic
  --color-danger: #dc2626;
  --color-success: #16a34a;
}
```

### Light & Dark Theme

Define the theme via CSS custom properties on `[data-theme]`. Never hardcode colors in components — always reference tokens.

```scss
// styles/theme.scss

[data-theme='light'] {
  --bg-base: var(--color-white);
  --bg-subtle: var(--color-gray-50);
  --bg-muted: var(--color-gray-100);
  --border: var(--color-gray-200);
  --text-primary: var(--color-gray-800);
  --text-muted: var(--color-gray-400);
  --text-on-accent: var(--color-white);
}

[data-theme='dark'] {
  --bg-base: var(--color-black);
  --bg-subtle: #111113;
  --bg-muted: #1c1c1f;
  --border: #2a2a2e;
  --text-primary: var(--color-gray-100);
  --text-muted: var(--color-gray-600);
  --text-on-accent: var(--color-white);
}
```

Apply the theme attribute on the root element and toggle it via a service:

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  toggle() {
    this.theme.update((t) => (t === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  init() {
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.theme.set(preferred);
    document.documentElement.setAttribute('data-theme', preferred);
  }
}
```

### Spacing & Layout

Use a consistent 4px base grid.

```scss
:root {
  --space-1: 0.25rem; //  4px
  --space-2: 0.5rem; //  8px
  --space-3: 0.75rem; // 12px
  --space-4: 1rem; // 16px
  --space-6: 1.5rem; // 24px
  --space-8: 2rem; // 32px
  --space-12: 3rem; // 48px
  --space-16: 4rem; // 64px

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Components Style Rules

- **Buttons:** flat, no shadow, 1px border using `--border`; accent fill only for the primary action
- **Inputs:** minimal border-bottom or full border with `--radius-sm`; no background fill in light mode
- **Cards:** `--bg-subtle` background, `--border` border, `--radius-md` radius, no shadow
- **Dividers:** use `--border` color, 1px, never decorative
- **Icons:** use a single icon library consistently (e.g. Lucide); size 16px or 20px only

### SCSS File Structure

```
src/styles/
├── _tokens.scss      # color and design tokens
├── _typography.scss  # font imports and type scale
├── _theme.scss       # light/dark theme maps
├── _reset.scss       # minimal CSS reset
├── _layout.scss      # global layout utilities
└── styles.scss       # imports all partials
```

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
