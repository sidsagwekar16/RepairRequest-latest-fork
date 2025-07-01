import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  className?: string;
}

export default function StatsCard({ title, value, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="px-4 py-5 sm:p-6">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className={cn(
            "mt-1 text-3xl font-bold",
            className ? "" : "text-gray-900"
          )}>{value}</dd>
        </dl>
      </CardContent>
    </Card>
  );
}
