// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <p className="mt-6 text-lg font-medium text-foreground/70">Med Elec...</p>
      </div>
    </div>
  );
}