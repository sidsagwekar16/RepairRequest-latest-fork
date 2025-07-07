import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Building2, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Organization {
  id: number;
  name: string;
  slug: string;
  domain?: string;
  logoUrl?: string;
  settings?: any;
  createdAt: string;
  userCount?: number;
  buildingCount?: number;
}

export default function AdminOrganizations() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const { toast } = useToast();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["https://repairrequest.onrender.com/api/admin/organizations"],
  });

  const createOrgMutation = useMutation({
    mutationFn: (orgData: any) => {
      return fetch("/api/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orgData),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to create organization");
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      setShowCreateForm(false);
      toast({ title: "Organization created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating organization", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const updateOrgMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => {
      return fetch(`/api/admin/organizations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(res => {
        if (!res.ok) throw new Error("Failed to update organization");
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/organizations"] });
      setSelectedOrg(null);
      toast({ title: "Organization updated successfully" });
    },
  });

  const deleteOrgMutation = useMutation({
    mutationFn: (id: number) => {
      return fetch(`https://repairrequest.onrender.com/api/admin/organizations/${id}`, {
        method: "DELETE",
      }).then(async res => {
        if (!res.ok) throw new Error("Failed to delete organization");
        const text = await res.text();
        return text ? JSON.parse(text) : {};
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["https://repairrequest.onrender.com/api/admin/organizations"] });
      setSelectedOrg(null);
      toast({ title: "Organization deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting organization",
        description: error.message,
        variant: "destructive"
      });
    },
  });

  const handleCreateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orgData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      domain: formData.get("domain") || null,
      logoUrl: formData.get("logoUrl") || null,
    };
    createOrgMutation.mutate(orgData);
  };

  const handleUpdateOrg = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOrg) return;
    
    const formData = new FormData(e.currentTarget);
    const orgData = {
      id: selectedOrg.id,
      name: formData.get("name"),
      domain: formData.get("domain") || null,
      logoUrl: formData.get("logoUrl") || null,
    };
    updateOrgMutation.mutate(orgData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Organization Management</h1>
          <p className="text-gray-600">Manage client organizations and their settings</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Create Organization Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Create New Organization</CardTitle>
            <CardDescription>
              Add a new client organization to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Organization Name</Label>
                  <Input id="name" name="name" required placeholder="Acme School District" />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input id="slug" name="slug" required placeholder="acme-school" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="domain">Email Domain (Optional)</Label>
                  <Input id="domain" name="domain" placeholder="acmeschool.edu" />
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                  <Input id="logoUrl" name="logoUrl" placeholder="https://..." />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createOrgMutation.isPending}>
                  {createOrgMutation.isPending ? "Creating..." : "Create Organization"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Organizations List */}
      <div className="grid gap-4">
        {organizations && Array.isArray(organizations) ? organizations.map((org: Organization) => (
          <Card key={org.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{org.name}</CardTitle>
                    <CardDescription>
                      Slug: {org.slug} {org.domain && `• Domain: ${org.domain}`}
                    </CardDescription>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedOrg(org)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {org.userCount || 0} Users
                </div>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {org.buildingCount || 0} Buildings
                </div>
                <div>Created: {new Date(org.createdAt).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No organizations found</p>
          </div>
        )}
      </div>

      {/* Edit Organization Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Organization</CardTitle>
              <CardDescription>Update organization settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateOrg} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Organization Name</Label>
                  <Input 
                    id="edit-name" 
                    name="name" 
                    defaultValue={selectedOrg.name}
                    required 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-domain">Email Domain</Label>
                  <Input 
                    id="edit-domain" 
                    name="domain" 
                    defaultValue={selectedOrg.domain || ""}
                    placeholder="organization.edu"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-logoUrl">Logo URL</Label>
                  <Input 
                    id="edit-logoUrl" 
                    name="logoUrl" 
                    defaultValue={selectedOrg.logoUrl || ""}
                    placeholder="https://..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={updateOrgMutation.isPending}>
                    {updateOrgMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    type="button"
                    disabled={deleteOrgMutation.isPending}
                    className="bg-red-800 hover:bg-red-900 text-white"
                    onClick={() => selectedOrg && deleteOrgMutation.mutate(selectedOrg.id)}
                  >
                    {deleteOrgMutation.isPending ? "Deleting..." : "Delete"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setSelectedOrg(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}