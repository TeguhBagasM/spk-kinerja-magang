import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    FileText,
    LogOut,
    ChevronRight,
    UserCircle,
} from "lucide-react";
import { PageProps } from "@/types";
import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarRail,
} from "@/Components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";

interface SidebarProps {
    auth: PageProps["auth"];
    children: React.ReactNode;
}

const menuItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "mentor", "peserta_magang"],
    },
    {
        title: "Manajemen Divisi",
        href: "/admin/divisions",
        icon: Users,
        roles: ["admin"],
        permission: "manage divisions",
    },
    {
        title: "Manajemen Kriteria",
        href: "/admin/kriteria",
        icon: Users,
        roles: ["admin"],
        permission: "manage kriteria",
    },
    {
        title: "Manajemen Mentor",
        href: "/admin/mentors",
        icon: Users,
        roles: ["admin"],
        permission: "manage mentors",
    },
    {
        title: "User Approval",
        href: "/admin/user-approval",
        icon: Users,
        roles: ["admin", "mentor"],
        permission: "approve users",
    },
    {
        title: "Peserta Magang",
        href: "/admin/peserta-magang/manage",
        icon: Users,
        roles: ["admin", "mentor"],
    },
    {
        title: "Penilaian",
        href: "/penilaian",
        icon: ClipboardList,
        roles: ["admin", "mentor"],
        permission: "view penilaian",
    },
    {
        title: "Hasil & Ranking",
        href: "/hasil-saw",
        icon: FileText,
        roles: ["admin", "mentor"],
        permission: "view laporan",
    },
];

export function Sidebar({ auth, children }: SidebarProps) {
    const userRoles = auth.user?.roles || [];
    const userPermissions = auth.user?.permissions || [];

    const canAccessMenu = (item: (typeof menuItems)[0]) => {
        const hasRole = item.roles.some((role) => userRoles.includes(role));
        const hasPermission =
            !item.permission || userPermissions.includes(item.permission);
        return hasRole && hasPermission;
    };

    const filteredMenuItems = menuItems.filter(canAccessMenu);

    // Get user initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Format role display
    const formatRole = (roles: string[]) => {
        return roles
            .map((role) =>
                role
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
            )
            .join(", ");
    };

    return (
        <SidebarProvider>
            <ShadcnSidebar collapsible="icon">
                {/* Header with Logo */}
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/dashboard">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                                        <img
                                            src="/images/logo-tdi.png"
                                            alt="Application Logo"
                                            width={100}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">
                                            SPK Penilaian
                                        </span>
                                        <span className="text-xs">
                                            Kinerja Magang
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                {/* Main Navigation */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {filteredMenuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        window.location.pathname === item.href;

                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* Footer with User Info */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarFallback className="rounded-lg">
                                                {getInitials(
                                                    auth.user?.name || "U"
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {auth.user?.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {formatRole(userRoles)}
                                            </span>
                                        </div>
                                        <ChevronRight className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/profile"
                                            className="cursor-pointer"
                                        >
                                            <UserCircle className="mr-2 h-4 w-4" />
                                            Profile
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full cursor-pointer text-red-600"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </ShadcnSidebar>

            {/* Main Content Area */}
            <main className="flex flex-1 flex-col">
                {/* Header with Trigger */}
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex-1" />
                    {/* Add any header actions here */}
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-auto p-6">{children}</div>
            </main>
        </SidebarProvider>
    );
}
