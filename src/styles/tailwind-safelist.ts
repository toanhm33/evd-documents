/**
 * Ensures Tailwind scans CVA variant classes that live in string literals.
 * Imported for side-effect only — do not remove.
 */
export const tailwindSafelist = [
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
  'disabled:pointer-events-none disabled:opacity-50',
  'bg-primary text-primary-foreground hover:bg-primary/90',
  'border border-border bg-white hover:bg-muted',
  'hover:bg-muted',
  'bg-destructive text-white hover:bg-destructive/90',
  'h-9 px-4 py-2',
  'h-8 px-3 text-xs',
  'h-10 px-6',
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  'bg-green-100 text-green-800',
  'bg-zinc-100 text-zinc-700',
  'bg-amber-100 text-amber-800',
  'bg-muted text-muted-foreground',
  'flex h-9 w-full rounded-md border border-border bg-white px-3 py-1 text-sm shadow-sm',
  'placeholder:text-muted-foreground',
  'focus-visible:ring-primary/40',
  'disabled:cursor-not-allowed',
].join(' ')
