import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface AdminActionsProps {
  requestId: number;
  request: any;
}

const adminActionsSchema = z.object({
  status: z.string(),
  priority: z.string().optional(),
  assigneeId: z.string().optional(),
  note: z.string().optional(),
});

type AdminActionsValues = z.infer<typeof adminActionsSchema>;

export default function AdminActions({ requestId, request }: AdminActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  // Fetch maintenance staff for assignment dropdown
  const { data: maintenanceStaff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["/api/users/maintenance"],
  });
  
  const form = useForm<AdminActionsValues>({
    resolver: zodResolver(adminActionsSchema),
    defaultValues: {
      status: request.status,
      priority: request.priority,
      assigneeId: request.assignee?.id || "",
      note: "",
    }
  });
  
  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (data: { status: string; priority?: string; note: string }) => {
      const res = await apiRequest("POST", `/api/requests/${requestId}/status`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/requests/${requestId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/requests/${requestId}/timeline`] });
      toast({
        title: "Status Updated",
        description: "The request status has been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "There was an error updating the status. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  // Assign request mutation
  const assignRequestMutation = useMutation({
    mutationFn: async (data: { assigneeId: string; internalNotes: string }) => {
      const res = await apiRequest("POST", `/api/requests/${requestId}/assign`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/requests/${requestId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/requests/${requestId}/timeline`] });
      toast({
        title: "Request Assigned",
        description: "The request has been assigned successfully."
      });
    },
    onError: (error) => {
      console.error("Error assigning request:", error);
      toast({
        title: "Error",
        description: "There was an error assigning the request. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = (data: AdminActionsValues) => {
    setIsSubmitting(true);
    
    // If assignee changed, update assignment
    if (data.assigneeId && data.assigneeId !== request.assignee?.id) {
      assignRequestMutation.mutate({
        assigneeId: data.assigneeId,
        internalNotes: data.note || ""
      });
    }
    
    // If status or priority changed, update status
    if (data.status !== request.status || data.priority !== request.priority) {
      updateStatusMutation.mutate({
        status: data.status,
        priority: data.priority,
        note: data.note || ""
      });
    }
    
    // If nothing changed but there's a note, update status with the same status (to add the note)
    if (data.status === request.status && data.priority === request.priority && data.assigneeId === request.assignee?.id && data.note) {
      updateStatusMutation.mutate({
        status: data.status,
        priority: data.priority,
        note: data.note
      });
    }
  };
  
  // Handle mark as complete
  const handleMarkComplete = () => {
    setIsSubmitting(true);
    updateStatusMutation.mutate({
      status: "completed",
      note: "Request marked as complete"
    });
  };
  
  // Handle cancel request
  const handleCancelRequest = () => {
    setIsSubmitting(true);
    updateStatusMutation.mutate({
      status: "cancelled",
      note: "Request cancelled by administrator"
    });
  };
  
  return (
    <Card>
      <CardContent className="pt-6 pb-8 mb-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isSubmitting || isLoadingStaff}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {maintenanceStaff?.map((staff: any) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.firstName} {staff.lastName} ({staff.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Internal Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add notes about this update (optional)"
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end sm:space-x-3 sm:space-y-0">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" disabled={isSubmitting} className="w-full sm:w-auto">
                    Cancel Request
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this request? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>No, go back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancelRequest}>
                      Yes, cancel request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              {(request.status === 'pending' || request.status === 'approved' || request.status === 'in-progress') && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      type="button" 
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      Mark as Complete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark as Complete</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to mark this request as complete?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No, go back</AlertDialogCancel>
                      <AlertDialogAction onClick={handleMarkComplete}>
                        Yes, mark as complete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
