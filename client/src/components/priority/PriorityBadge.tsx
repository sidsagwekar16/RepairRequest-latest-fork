import { cn } from "@/lib/utils";

interface PriorityBadgeProps {
  priority: string;
  className?: string;
}

export default function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  // Define priority styles
  const priorityConfig: Record<string, { label: string; bgClass: string; textClass: string }> = {
    low: {
      label: "Low",
      bgClass: "bg-green-500 bg-opacity-10",
      textClass: "text-green-600"
    },
    medium: {
      label: "Medium",
      bgClass: "bg-blue-500 bg-opacity-10",
      textClass: "text-blue-600"
    },
    high: {
      label: "High",
      bgClass: "bg-orange-500 bg-opacity-10",
      textClass: "text-orange-600"
    },
    urgent: {
      label: "Urgent",
      bgClass: "bg-red-500 bg-opacity-10",
      textClass: "text-red-600"
    }
  };

  // Get current priority config or use a default
  const currentPriority = priorityConfig[priority.toLowerCase()] || {
    label: priority.charAt(0).toUpperCase() + priority.slice(1),
    bgClass: "bg-gray-200",
    textClass: "text-gray-600"
  };

  return (
    <div
      className={cn(
        "px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full",
        currentPriority.bgClass,
        currentPriority.textClass,
        className
      )}
    >
      {currentPriority.label}
    </div>
  );
}