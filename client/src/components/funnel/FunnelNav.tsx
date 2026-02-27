export function FunnelNav() {
  return (
    <nav className="w-full border-b border-[var(--titan-border)] bg-white py-4">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color: "var(--titan-text-primary)" }}>
            <span style={{ background: "var(--titan-grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Health Pro CEO
            </span>
            {" "}Academy
          </span>
        </div>
      </div>
    </nav>
  );
}
