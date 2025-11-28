import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginatedData, User } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import {
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface UserApprovalProps extends PageProps {
    pendingUsers: PaginatedData<User>;
}

type ConfirmDialog = {
    isOpen: boolean;
    type: "approve" | "reject" | null;
    userId: number | null;
    userName: string;
};

export default function UserApproval({ pendingUsers }: UserApprovalProps) {
    const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>({
        isOpen: false,
        type: null,
        userId: null,
        userName: "",
    });

    const openConfirmDialog = (
        type: "approve" | "reject",
        userId: number,
        userName: string
    ) => {
        setConfirmDialog({
            isOpen: true,
            type,
            userId,
            userName,
        });
    };

    const closeConfirmDialog = () => {
        setConfirmDialog({
            isOpen: false,
            type: null,
            userId: null,
            userName: "",
        });
    };

    const handleConfirm = () => {
        if (!confirmDialog.userId || !confirmDialog.type) return;

        const action = confirmDialog.type === "approve" ? "approve" : "reject";

        router.post(
            `/admin/users/${confirmDialog.userId}/${action}`,
            {},
            {
                onFinish: () => closeConfirmDialog(),
            }
        );
    };

    const getRoleName = (user: User) => {
        if (!user.roles || user.roles.length === 0) return "No Role";

        const role = user.roles[0];
        if (typeof role === "object" && role !== null && "name" in role) {
            return (role as any).name.replace(/_/g, " ");
        }

        if (typeof role === "string") {
            return role.replace(/_/g, " ");
        }

        return "Unknown Role";
    };

    const getRoleBadgeVariant = (roleName: string) => {
        const role = roleName.toLowerCase();
        if (role.includes("peserta")) return "default";
        if (role.includes("mentor")) return "secondary";
        return "outline";
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Approval" />

            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Persetujuan Pengguna
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">
                            Kelola persetujuan pendaftaran peserta magang dan
                            mentor
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">
                            {pendingUsers.total}
                        </span>
                        <span>menunggu persetujuan</span>
                    </div>
                </div>

                {/* Alert if no pending users */}
                {pendingUsers.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-gray-100 p-4 mb-4">
                                <UserCheck className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Tidak ada pengguna menunggu
                            </h3>
                            <p className="text-gray-600 text-center max-w-md">
                                Semua pendaftaran telah diproses. Halaman ini
                                akan menampilkan pengguna baru yang menunggu
                                persetujuan.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Pengguna Pending</CardTitle>
                            <CardDescription>
                                Tinjau dan setujui atau tolak pendaftaran
                                pengguna baru
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Mobile View */}
                            <div className="block lg:hidden">
                                <div className="divide-y">
                                    {pendingUsers.data.map((user) => (
                                        <div
                                            key={user.id}
                                            className="p-4 space-y-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {user.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant={getRoleBadgeVariant(
                                                        getRoleName(user)
                                                    )}
                                                    className="capitalize"
                                                >
                                                    {getRoleName(user)}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Mendaftar pada{" "}
                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                    onClick={() =>
                                                        openConfirmDialog(
                                                            "approve",
                                                            user.id,
                                                            user.name
                                                        )
                                                    }
                                                >
                                                    <CheckCircle className="mr-1 h-4 w-4" />
                                                    Setujui
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="flex-1"
                                                    onClick={() =>
                                                        openConfirmDialog(
                                                            "reject",
                                                            user.id,
                                                            user.name
                                                        )
                                                    }
                                                >
                                                    <XCircle className="mr-1 h-4 w-4" />
                                                    Tolak
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>
                                                Tanggal Daftar
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingUsers.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {user.name}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {user.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={getRoleBadgeVariant(
                                                            getRoleName(user)
                                                        )}
                                                        className="capitalize"
                                                    >
                                                        {getRoleName(user)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() =>
                                                                openConfirmDialog(
                                                                    "approve",
                                                                    user.id,
                                                                    user.name
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle className="mr-1 h-4 w-4" />
                                                            Setujui
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                openConfirmDialog(
                                                                    "reject",
                                                                    user.id,
                                                                    user.name
                                                                )
                                                            }
                                                        >
                                                            <XCircle className="mr-1 h-4 w-4" />
                                                            Tolak
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination (jika diperlukan nanti) */}
                {pendingUsers.data.length > 0 && pendingUsers.last_page > 1 && (
                    <div className="flex justify-center">
                        {/* Tambahkan pagination component di sini */}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialog.isOpen}
                onOpenChange={closeConfirmDialog}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            {confirmDialog.type === "approve" ? (
                                <div className="rounded-full bg-green-100 p-2">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            ) : (
                                <div className="rounded-full bg-red-100 p-2">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                            )}
                            <DialogTitle>
                                {confirmDialog.type === "approve"
                                    ? "Setujui Pengguna"
                                    : "Tolak Pengguna"}
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <DialogDescription className="py-4">
                        {confirmDialog.type === "approve" ? (
                            <span>
                                Apakah Anda yakin ingin menyetujui{" "}
                                <span className="font-semibold text-gray-900">
                                    {confirmDialog.userName}
                                </span>
                                ? Pengguna akan dapat mengakses sistem setelah
                                disetujui.
                            </span>
                        ) : (
                            <span>
                                Apakah Anda yakin ingin menolak{" "}
                                <span className="font-semibold text-gray-900">
                                    {confirmDialog.userName}
                                </span>
                                ? Tindakan ini tidak dapat dibatalkan.
                            </span>
                        )}
                    </DialogDescription>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={closeConfirmDialog}>
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            className={
                                confirmDialog.type === "approve"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : ""
                            }
                            variant={
                                confirmDialog.type === "approve"
                                    ? "default"
                                    : "destructive"
                            }
                        >
                            {confirmDialog.type === "approve"
                                ? "Ya, Setujui"
                                : "Ya, Tolak"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
