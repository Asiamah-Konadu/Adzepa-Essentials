export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="h-9 w-48 bg-sand/40 animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[4/5] bg-sand/40 animate-pulse" />
            <div className="h-4 w-3/4 bg-sand/40 animate-pulse mt-3" />
            <div className="h-4 w-1/3 bg-sand/40 animate-pulse mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
