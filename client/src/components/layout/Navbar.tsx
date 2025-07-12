import { UserAvatar } from "@/components/ui/UserAvatar";
import { queryClient } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import canterburyLogoPath from "@assets/one_line_logo-03 (1)_1749356183104.png";

interface NavbarProps {
  toggleMobileSidebar: () => void;
  user: any;
}

export default function Navbar({ toggleMobileSidebar, user }: NavbarProps) {

  return (
    <nav className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-light focus:outline-none"
                onClick={toggleMobileSidebar}
              >
                <span className="material-icons">menu</span>
              </button>
            </div>
            
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-white text-xl font-heading font-bold">
                {user?.role === 'super_admin' ? 'SchoolHouse Logistics' : user?.organizationName || 'RepairRequest'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center">
            {user?.organizationName === 'Canterbury School' && user?.role !== 'super_admin' && (
              <div className="relative">
                <div className="py-2 px-6">
                  <img 
                    src={canterburyLogoPath} 
                    alt="Canterbury School" 
                    className="h-12 w-auto"
                  />
                </div>
              </div>
            )}
            
            <div className="ml-3 relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex text-sm rounded-full focus:outline-none">
                    <span className="sr-only">Open user menu</span>
                    <UserAvatar user={user} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-normal">
                      <p className="font-medium text-sm">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/">
                    <DropdownMenuItem>
                      <span className="material-icons text-sm mr-2">dashboard</span>
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/my-requests">
                    <DropdownMenuItem>
                      <span className="material-icons text-sm mr-2">assignment</span>
                      My Requests
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/new-facilities-request">
                    <DropdownMenuItem>
                      <span className="material-icons text-sm mr-2">event_seat</span>
                      New Facilities Request
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/new-building-request">
                    <DropdownMenuItem>
                      <span className="material-icons text-sm mr-2">home_repair_service</span>
                      New Building Request
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={async (e) => {
                      e.preventDefault();
                      await fetch("/api/logout", { credentials: "include" });
                      // Clear React Query cache
                      queryClient.clear();
                      window.location.href = "/landing";
                    }}
                  >
                    <span className="material-icons text-sm mr-2">logout</span>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
