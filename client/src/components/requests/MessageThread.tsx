import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Send } from "lucide-react";

interface MessageThreadProps {
  requestId: number;
}

const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty")
});

type MessageFormValues = z.infer<typeof messageSchema>;

export default function MessageThread({ requestId }: MessageThreadProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: messages, isLoading } = useQuery({
    queryKey: [`/api/requests/${requestId}/messages`],
  });
  
  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  });
  
  const sendMessageMutation = useMutation({
    mutationFn: async (data: MessageFormValues) => {
      const res = await apiRequest("POST", `/api/requests/${requestId}/messages`, data);
      return res.json();
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: [`/api/requests/${requestId}/messages`] });
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully."
      });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });
  
  const onSubmit = (data: MessageFormValues) => {
    setIsSubmitting(true);
    sendMessageMutation.mutate(data);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="animate-pulse space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex">
                <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/4 mb-2"></div>
                  <div className="h-20 bg-gray-100 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message: any) => (
              <div key={message.id} className="flex">
                <div className="mr-4 flex-shrink-0">
                  <UserAvatar 
                    user={message.sender} 
                    bgColor={message.sender.role === 'admin' || message.sender.role === 'maintenance' ? 'bg-secondary' : 'bg-primary'} 
                  />
                </div>
                <div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">{message.sender.name}</span>
                    {message.sender.role && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {message.sender.role}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-sm text-gray-700">
                    <p>{message.content}</p>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>{format(new Date(message.sentAt), 'MMMM d, yyyy h:mm a')}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Textarea 
                rows={3} 
                placeholder="Type your message here..." 
                {...form.register("content")}
                className="w-full"
              />
              {form.formState.errors.content && (
                <p className="text-xs text-red-500 mt-1">{form.formState.errors.content.message}</p>
              )}
              <div className="mt-3 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex items-center"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
