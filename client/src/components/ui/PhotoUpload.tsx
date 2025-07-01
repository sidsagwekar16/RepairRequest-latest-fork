import React, { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Input } from "./input";
import { Button } from "./button";
import { useToast } from "@/hooks/use-toast";
import { Image, X, Camera, FileImage, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoUploadProps {
  form: any;
  name: string;
  label: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  maxPhotos?: number;
}

export function PhotoUpload({
  form,
  name,
  label,
  description,
  accept = "image/*",
  maxSizeMB = 5,
  multiple = false,
  maxPhotos = 5
}: PhotoUploadProps) {
  const { toast } = useToast();
  const [previews, setPreviews] = useState<{id: string, url: string, file: File}[]>([]);
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) {
      return;
    }

    // Handle multiple files if enabled
    if (multiple) {
      const newFiles = Array.from(files);
      
      // Check if adding new files would exceed the maximum
      if (previews.length + newFiles.length > maxPhotos) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: `You can upload a maximum of ${maxPhotos} photos.`
        });
        return;
      }
      
      // Process each file
      const validFiles: File[] = [];
      const newPreviews: {id: string, url: string, file: File}[] = [...previews];
      
      newFiles.forEach(file => {
        // Check file size
        if (file.size > maxSize) {
          toast({
            variant: "destructive",
            title: "File too large",
            description: `File "${file.name}" exceeds ${maxSizeMB}MB limit.`
          });
          return;
        }
        
        // Create preview URL
        const fileUrl = URL.createObjectURL(file);
        const id = `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        newPreviews.push({
          id,
          url: fileUrl,
          file
        });
        
        validFiles.push(file);
      });
      
      // Update form values and previews
      setPreviews(newPreviews);
      
      // Set the form value based on what the form expects
      // If the form expects an array of files
      form.setValue(name, validFiles);
    } 
    // Handle single file
    else {
      const file = files[0];
      
      // Check file size
      if (file.size > maxSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: `File size cannot exceed ${maxSizeMB}MB.`
        });
        return;
      }
      
      // Clear any existing preview
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
      
      // Create a new preview
      const fileUrl = URL.createObjectURL(file);
      const id = `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      setPreviews([{
        id,
        url: fileUrl,
        file
      }]);
      
      // Set form value with file
      form.setValue(name, file);
    }
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const removeFile = (idToRemove: string) => {
    // Find the preview to remove
    const previewToRemove = previews.find(preview => preview.id === idToRemove);
    
    if (previewToRemove) {
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(previewToRemove.url);
      
      // Update previews
      const newPreviews = previews.filter(preview => preview.id !== idToRemove);
      setPreviews(newPreviews);
      
      // Update form value based on whether it's multiple or single
      if (multiple) {
        const remainingFiles = newPreviews.map(p => p.file);
        form.setValue(name, remainingFiles.length > 0 ? remainingFiles : null);
      } else {
        form.setValue(name, null);
      }
      
      toast({
        title: "Photo removed",
        description: "The photo has been removed."
      });
    }
  };

  const clearAllFiles = () => {
    // Revoke all object URLs
    previews.forEach(preview => URL.revokeObjectURL(preview.url));
    
    // Clear previews
    setPreviews([]);
    
    // Clear form value
    form.setValue(name, null);
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="space-y-4">
              {/* Upload controls */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById(`${name}-upload`)?.click()}
                  className="flex gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {multiple ? "Add Photos" : "Select Photo"}
                </Button>
                
                {previews.length > 0 && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm" 
                    onClick={clearAllFiles}
                    className="flex gap-1 items-center"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove All
                  </Button>
                )}
                
                <Input
                  id={`${name}-upload`}
                  type="file"
                  accept={accept}
                  multiple={multiple}
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {multiple && previews.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {previews.length} of {maxPhotos} photos selected
                  </p>
                )}
              </div>

              {/* Preview display */}
              {previews.length > 0 && (
                <div className={cn(
                  "grid gap-4 mt-4",
                  multiple ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"
                )}>
                  {previews.map(preview => (
                    <div 
                      key={preview.id} 
                      className="relative rounded-md overflow-hidden border border-border group"
                    >
                      <img 
                        src={preview.url} 
                        alt="Preview" 
                        className="w-full h-48 object-cover" 
                      />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                          onClick={() => removeFile(preview.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <div className="text-white text-sm font-medium px-3 py-1 bg-black/60 rounded-md">
                          {preview.file.name.length > 20 
                            ? preview.file.name.substring(0, 20) + '...' 
                            : preview.file.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Empty state */}
              {previews.length === 0 && (
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
                  <FileImage className="mx-auto h-12 w-12 text-muted-foreground/70" />
                  <h3 className="mt-2 text-sm font-semibold text-foreground">No photos selected</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {multiple 
                      ? `Select up to ${maxPhotos} photos (max ${maxSizeMB}MB each)` 
                      : `Select a photo (max ${maxSizeMB}MB)`}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-4"
                    onClick={() => document.getElementById(`${name}-upload`)?.click()}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {multiple ? "Add Photos" : "Select Photo"}
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}