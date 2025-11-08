# Internationalization (i18n) Guidelines

## Overview

This project uses a custom translation system to support multiple languages (English and Spanish). All user-facing text must be translated to ensure a consistent multilingual experience.

## Translation System

- **Translation Files**: `src/i18n/en.json` and `src/i18n/es.json`
- **Hook**: Use `useTranslation()` from `@/hooks/use-translation`
- **Provider**: `LanguageProvider` in `@/contexts/language-context`

## Rules

### ✅ DO

1. **Always use `t()` for user-facing text**:
   ```typescript
   const { t } = useTranslation();
   return <h1>{t("dashboard.title")}</h1>;
   ```

2. **Add keys to both `en.json` and `es.json`**:
   ```json
   // en.json
   {
     "dashboard": {
       "title": "Dashboard"
     }
   }
   
   // es.json
   {
     "dashboard": {
       "title": "Panel"
     }
   }
   ```

3. **Use nested keys for organization**:
   ```typescript
   t("dashboard.leadManager.assignedLeads")
   ```

4. **Handle dynamic content with `.replace()`**:
   ```typescript
   t("dashboard.basedOnRatings")
     .replace("{count}", count.toString())
     .replace("{rating}", ratingLabel)
   ```

5. **Format numbers and dates appropriately**:
   ```typescript
   // Good: Numbers are universal
   value={totalLeads}
   
   // Good: Dates formatted by browser locale
   {new Date(lead.createdAt).toLocaleDateString()}
   ```

### ❌ DON'T

1. **Never hardcode English text in JSX**:
   ```typescript
   // ❌ BAD
   <h1>Dashboard</h1>
   
   // ✅ GOOD
   <h1>{t("dashboard.title")}</h1>
   ```

2. **Never hardcode text in component props**:
   ```typescript
   // ❌ BAD
   <Button>Submit</Button>
   
   // ✅ GOOD
   <Button>{t("common.submit")}</Button>
   ```

3. **Never hardcode empty states or error messages**:
   ```typescript
   // ❌ BAD
   <p>No data available</p>
   
   // ✅ GOOD
   <p>{t("common.noDataAvailable")}</p>
   ```

### Exceptions (Allowed)

The following are acceptable to hardcode:

- **Technical strings**: `className`, `id`, `key`, `type`, `name`
- **Status codes**: `"WON"`, `"LOST"`, `"PENDING"` (internal enums)
- **File paths**: `"/api/users"`, `"./styles.css"`
- **Colors and CSS**: `"#fff"`, `"rgb(255, 0, 0)"`, `"10px"`
- **Numbers and symbols**: `123`, `"$"`, `"%"`
- **Environment variables**: `process.env.NEXT_PUBLIC_API_URL`

## Component Checklist

When creating or updating a component, ensure:

- [ ] Import `useTranslation()` if component has user-facing text
- [ ] Replace all English strings with `t()` calls
- [ ] Add translation keys to both `en.json` and `es.json`
- [ ] Test language switching (English ↔ Spanish)
- [ ] Verify no hardcoded text appears in the UI

## Translation Key Naming Convention

Use a hierarchical structure:

```
{domain}.{page/component}.{element}
```

Examples:
- `dashboard.leadManager.title`
- `assignments.qualifyLead`
- `common.submit`
- `ratings.noRatingsYet`

## Testing Translations

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Log in as a Lead Manager

3. Toggle language in the UI (usually in header/navigation)

4. Navigate through:
   - Dashboard
   - Assignments page
   - Proposals page

5. Verify:
   - All text changes language
   - No English leaks in Spanish mode
   - No Spanish leaks in English mode
   - Dates and numbers format correctly

## Code Review Requirements

Before merging, ensure:

1. ✅ All user-facing strings use `t()`
2. ✅ Keys exist in both `en.json` and `es.json`
3. ✅ Language switching works without page reload
4. ✅ No console errors when switching languages
5. ✅ Build passes: `npm run build`

## Adding New Languages

To add a new language:

1. Create `src/i18n/{locale}.json` (e.g., `fr.json`)
2. Copy all keys from `en.json`
3. Translate all values
4. Update `LanguageProvider` to support new locale
5. Add language selector option in UI

## Resources

- Translation files: `src/i18n/`
- Language context: `src/contexts/language-context.tsx`
- Translation hook: `src/hooks/use-translation.ts`
- Example components:
  - `src/components/dashboard/lead-manager-dashboard.tsx`
  - `src/app/assignments/page.tsx`
  - `src/app/proposals/page.tsx`
