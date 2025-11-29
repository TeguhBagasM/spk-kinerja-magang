// resources/js/Layouts/AuthenticatedLayout.tsx
import { PropsWithChildren, ReactNode } from "react";
import { PageProps } from "@/types";
import { Sidebar } from "@/Components/Sidebar";
import { usePage } from "@inertiajs/react";

interface AuthenticatedLayoutProps extends PropsWithChildren {
    header?: ReactNode;
    auth?: PageProps["auth"];
    user?: PageProps["auth"] extends { user: infer U } ? U : any;
}

export default function AuthenticatedLayout({
    children,
    header,
    auth,
    user,
}: AuthenticatedLayoutProps) {
    const page = usePage<PageProps>();
    const finalAuth = auth ?? page.props.auth ?? (user ? { user } : undefined);

    return (
        <Sidebar auth={finalAuth}>
            {header && <div className="mb-6 pb-4 border-b">{header}</div>}
            {children}
        </Sidebar>
    );
}
