interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-soft p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground/70">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        {icon && (
          <div className="text-accent">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
