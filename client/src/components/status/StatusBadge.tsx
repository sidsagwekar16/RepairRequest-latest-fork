import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  // Define status styles
  const statusConfig: Record<string, { label: string; bgClass: string; textClass: string }> = {
    pending: {
      label: "Pending",
      bgClass: "bg-status-pending bg-opacity-10",
      textClass: "text-status-pending"
    },
    approved: {
      label: "Approved",
      bgClass: "bg-blue-500 bg-opacity-10",
      textClass: "text-blue-500"
    },
    "in-progress": {
      label: "In Progress",
      bgClass: "bg-status-inprogress bg-opacity-10",
      textClass: "text-status-inprogress"
    },
    completed: {
      label: "Completed",
      bgClass: "bg-status-completed bg-opacity-10",
      textClass: "text-status-completed"
    },
    cancelled: {
      label: "Cancelled",
      bgClass: "bg-status-cancelled bg-opacity-10",
      textClass: "text-status-cancelled"
    }
  };

  // Get current status config or use a default
  const currentStatus = statusConfig[status.toLowerCase()] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    bgClass: "bg-gray-200",
    textClass: "text-gray-600"
  };

  return (
    <div
      className={cn(
        "px-2 inline-flex text-xs leading-5 font-medium rounded-full",
        currentStatus.bgClass,
        currentStatus.textClass,
        className
      )}
    >
      {currentStatus.label}
    </div>
  );
}
