export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-sm p-8 bg-surface rounded-md shadow-2xl flex flex-col gap-6 items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p className="text-tx-body-muted">Loading...</p>
      </div>
    </div>
  );
}