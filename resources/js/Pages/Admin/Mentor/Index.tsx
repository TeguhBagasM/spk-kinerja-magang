import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, FormEventHandler } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react";

interface Mentor {
    id: number;
    name: string;
    employee_id: string;
    position: string;
    department: string;
    user: {
        id: number;
        email: string;
        phone?: string;
    };
    peserta_magang_count: number;
}

export default function Index({
    auth,
    mentors,
}: PageProps<{ mentors: Mentor[] }>) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    const createForm = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        employee_id: "",
        position: "",
        department: "",
    });

    const editForm = useForm({
        name: "",
        email: "",
        phone: "",
        employee_id: "",
        position: "",
        department: "",
        password: "",
        password_confirmation: "",
    });

    const { delete: destroy, processing: deleting } = useForm();

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route("admin.mentors.store"), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleOpenEditDialog = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        editForm.setData({
            name: mentor.name,
            email: mentor.user.email,
            phone: mentor.user.phone || "",
            employee_id: mentor.employee_id,
            position: mentor.position,
            department: mentor.department,
            password: "",
            password_confirmation: "",
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedMentor) return;

        editForm.put(route("admin.mentors.update", selectedMentor.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
                setSelectedMentor(null);
            },
        });
    };

    const handleOpenDeleteDialog = (mentor: Mentor) => {
        setSelectedMentor(mentor);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!selectedMentor) return;

        destroy(route("admin.mentors.destroy", selectedMentor.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedMentor(null);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Mentor" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            Manajemen Mentor
                        </CardTitle>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Tambah Mentor
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>ID Karyawan</TableHead>
                                        <TableHead>Jabatan</TableHead>
                                        <TableHead>Departemen</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Telepon</TableHead>
                                        <TableHead className="text-center">
                                            <Users className="h-4 w-4 inline mr-1" />
                                            Peserta
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {mentors.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Belum ada mentor. Klik "Tambah
                                                Mentor" untuk menambahkan.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {mentors.map((mentor) => (
                                        <TableRow key={mentor.id}>
                                            <TableCell className="font-medium">
                                                {mentor.name}
                                            </TableCell>
                                            <TableCell className="font-mono">
                                                {mentor.employee_id}
                                            </TableCell>
                                            <TableCell>
                                                {mentor.position}
                                            </TableCell>
                                            <TableCell>
                                                {mentor.department}
                                            </TableCell>
                                            <TableCell>
                                                {mentor.user.email}
                                            </TableCell>
                                            <TableCell>
                                                {mentor.user.phone || "-"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {
                                                        mentor.peserta_magang_count
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenEditDialog(
                                                                mentor
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleOpenDeleteDialog(
                                                                mentor
                                                            )
                                                        }
                                                        disabled={
                                                            mentor.peserta_magang_count >
                                                            0
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
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
            </div>

            {/* Create Dialog */}
            <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            >
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Mentor Baru</DialogTitle>
                        <DialogDescription>
                            Isi form untuk menambahkan mentor baru
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nama Lengkap *</Label>
                                <Input
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.name && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input
                                        type="email"
                                        value={createForm.data.email}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {createForm.errors.email && (
                                        <p className="text-sm text-red-600">
                                            {createForm.errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>No. Telepon</Label>
                                    <Input
                                        value={createForm.data.phone}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Password *</Label>
                                    <Input
                                        type="password"
                                        value={createForm.data.password}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                    {createForm.errors.password && (
                                        <p className="text-sm text-red-600">
                                            {createForm.errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Konfirmasi Password *</Label>
                                    <Input
                                        type="password"
                                        value={
                                            createForm.data
                                                .password_confirmation
                                        }
                                        onChange={(e) =>
                                            createForm.setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>ID Karyawan *</Label>
                                <Input
                                    value={createForm.data.employee_id}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "employee_id",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.employee_id && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.employee_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jabatan *</Label>
                                    <Input
                                        value={createForm.data.position}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "position",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Departemen *</Label>
                                    <Input
                                        value={createForm.data.department}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "department",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsCreateDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                            >
                                {createForm.processing
                                    ? "Menyimpan..."
                                    : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog - Similar structure, just use editForm */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Mentor</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi mentor
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            {/* Same fields as create, but using editForm */}
                            <div className="space-y-2">
                                <Label>Nama Lengkap *</Label>
                                <Input
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email *</Label>
                                    <Input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>No. Telepon</Label>
                                    <Input
                                        value={editForm.data.phone}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>ID Karyawan *</Label>
                                <Input
                                    value={editForm.data.employee_id}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "employee_id",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Jabatan *</Label>
                                    <Input
                                        value={editForm.data.position}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "position",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Departemen *</Label>
                                    <Input
                                        value={editForm.data.department}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "department",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-4">
                                    Kosongkan jika tidak ingin mengubah password
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Password Baru</Label>
                                        <Input
                                            type="password"
                                            value={editForm.data.password}
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Konfirmasi Password</Label>
                                        <Input
                                            type="password"
                                            value={
                                                editForm.data
                                                    .password_confirmation
                                            }
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                {editForm.processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Mentor?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus mentor{" "}
                            <span className="font-semibold">
                                {selectedMentor?.name}
                            </span>
                            ? Akun user juga akan ikut terhapus.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {deleting ? "Menghapus..." : "Hapus"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
