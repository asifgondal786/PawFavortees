// Admin page header — sab admin pages ka consistent pattern.
// Server component (no interactivity).
export default function PageHeader({ title, subtitle, actions = null }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-charcoal-700 text-sm mt-1.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
