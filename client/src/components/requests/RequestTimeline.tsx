import { format } from "date-fns";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Card, CardContent } from "@/components/ui/card";

interface RequestTimelineProps {
  timeline: any[];
  isLoading: boolean;
}

export default function RequestTimeline({ timeline, isLoading }: RequestTimelineProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-2"></div>
                  <div className="h-10 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!timeline || timeline.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center py-8">
          <p className="text-gray-500">No timeline information available</p>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get the appropriate icon for each timeline event type
  const getEventIcon = (type: string, status: string) => {
    switch (type) {
      case 'creation':
        return "edit_note";
      case 'assignment':
        return "engineering";
      case 'status':
        switch (status) {
          case 'pending':
            return "hourglass_empty";
          case 'approved':
            return "assignment_turned_in";
          case 'in-progress':
            return "construction";
          case 'completed':
            return "task_alt";
          case 'cancelled':
            return "cancel";
          default:
            return "info";
        }
      default:
        return "info";
    }
  };

  // Helper function to get the appropriate color for each timeline event type/status
  const getEventColor = (type: string, status: string) => {
    switch (type) {
      case 'creation':
        return "bg-blue-500";
      case 'assignment':
        return "bg-purple-500";
      case 'status':
        switch (status) {
          case 'pending':
            return "bg-status-pending";
          case 'approved':
            return "bg-blue-500";
          case 'in-progress':
            return "bg-status-inprogress";
          case 'completed':
            return "bg-status-completed";
          case 'cancelled':
            return "bg-status-cancelled";
          default:
            return "bg-gray-500";
        }
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardContent className="flow-root px-4 py-5 sm:px-6">
        <ul className="-mb-8">
          {timeline.map((event, idx) => (
            <li key={idx}>
              <div className="relative pb-8">
                {idx < timeline.length - 1 && (
                  <span 
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" 
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full ${getEventColor(event.type, event.status)} flex items-center justify-center ring-8 ring-white`}>
                      <span className="material-icons text-white">
                        {getEventIcon(event.type, event.status)}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        {event.type === 'creation' && (
                          <span className="font-medium text-gray-900">Request Submitted</span>
                        )}
                        {event.type === 'status' && (
                          <span className="font-medium text-gray-900">
                            Status Changed: <span className="capitalize">{event.status}</span>
                          </span>
                        )}
                        {event.type === 'assignment' && (
                          <span className="font-medium text-gray-900">
                            Assigned to {event.assignee?.name}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {(() => {
                          try {
                            const date = new Date(event.date);
                            if (isNaN(date.getTime())) {
                              return 'Date unavailable';
                            }
                            return format(date, 'MMMM d, yyyy h:mm a');
                          } catch (error) {
                            console.error('Error formatting date:', error);
                            return 'Date unavailable';
                          }
                        })()}
                      </p>
                    </div>
                    {event.note && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>{event.note}</p>
                      </div>
                    )}
                    {event.type === 'assignment' && (
                      <div className="mt-2 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">Assigned by:</span>
                          <span className="font-medium text-gray-900">{event.assigner?.name}</span>
                        </div>
                        {event.note && (
                          <div className="mt-1 text-gray-700">
                            <p>{event.note}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
