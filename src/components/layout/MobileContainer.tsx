export default function MobileContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg min-h-screen pb-20 px-4 pt-6">
      {children}
    </div>
  );
}
