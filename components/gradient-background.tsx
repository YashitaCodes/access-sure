export function GradientBackground() {
  return (
    <div className="absolute inset-0 -z-20 h-full w-full overflow-hidden">
      <div className="absolute top-0 -left-1/4 w-1/2 aspect-square bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 aspect-square bg-gradient-to-l from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20" />
    </div>
  );
}