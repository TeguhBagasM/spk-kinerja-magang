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
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react";

interface Division {
    id: number;
    name: string;
    code: string;
    description?: string;
    is_active: boolean;
    peserta_magang_count: number;
    created_at: string;
}

export default function Index({
    auth,
    divisions,
}: PageProps<{ divisions: Division[] }>) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedDivision, setSelectedDivision] = useState<Division | null>(
        null
    );

    const createForm = useForm({
        name: "",
        code: "",
        description: "",
        is_active: true,
    });

    const editForm = useForm({
        name: "",
        code: "",
        description: "",
        is_active: true,
    });

    const { delete: destroy, processing: deleting } = useForm();

    // Handle Create
    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route("admin.divisions.store"), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    // Handle Edit Dialog Open
    const handleOpenEditDialog = (division: Division) => {
        setSelectedDivision(division);
        editForm.setData({
            name: division.name,
            code: division.code,
            description: division.description || "",
            is_active: division.is_active,
        });
        setIsEditDialogOpen(true);
    };

    // Handle Update
    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedDivision) return;

        editForm.put(route("admin.divisions.update", selectedDivision.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
                setSelectedDivision(null);
            },
        });
    };

    // Handle Delete Dialog Open
    const handleOpenDeleteDialog = (division: Division) => {
        setSelectedDivision(division);
        setIsDeleteDialogOpen(true);
    };

    // Handle Delete
    const handleDelete = () => {
        if (!selectedDivision) return;

        destroy(route("admin.divisions.destroy", selectedDivision.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedDivision(null);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Divisi" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            Manajemen Divisi
                        </CardTitle>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Tambah Divisi
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Divisi</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-center">
                                            <Users className="h-4 w-4 inline mr-1" />
                                            Peserta
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {divisions.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Belum ada divisi. Klik tombol
                                                "Tambah Divisi" untuk membuat
                                                divisi baru.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {divisions.map((division) => (
                                        <TableRow key={division.id}>
                                            <TableCell className="font-mono font-medium">
                                                {division.code}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {division.name}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {division.description || (
                                                    <span className="text-gray-400 text-sm">
                                                        Tidak ada deskripsi
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {
                                                        division.peserta_magang_count
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Badge
                                                        variant={
                                                            division.is_active
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className={
                                                            division.is_active
                                                                ? "bg-green-600"
                                                                : ""
                                                        }
                                                    >
                                                        {division.is_active
                                                            ? "Aktif"
                                                            : "Nonaktif"}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenEditDialog(
                                                                division
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
                                                                division
                                                            )
                                                        }
                                                        disabled={
                                                            division.peserta_magang_count >
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tambah Divisi Baru</DialogTitle>
                        <DialogDescription>
                            Isi form di bawah untuk menambahkan divisi baru
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-code">
                                    Kode Divisi *
                                </Label>
                                <Input
                                    id="create-code"
                                    placeholder="Contoh: IT, HR, FIN"
                                    value={createForm.data.code}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "code",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.code && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.code}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-name">
                                    Nama Divisi *
                                </Label>
                                <Input
                                    id="create-name"
                                    placeholder="Contoh: Information Technology"
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

                            <div className="space-y-2">
                                <Label htmlFor="create-description">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="create-description"
                                    placeholder="Deskripsi singkat tentang divisi..."
                                    value={createForm.data.description}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="create-active"
                                    checked={createForm.data.is_active}
                                    onCheckedChange={(checked) =>
                                        createForm.setData("is_active", checked)
                                    }
                                />
                                <Label htmlFor="create-active">
                                    Aktifkan divisi
                                </Label>
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

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Divisi</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi divisi{" "}
                            <span className="font-semibold">
                                {selectedDivision?.name}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-code">Kode Divisi *</Label>
                                <Input
                                    id="edit-code"
                                    value={editForm.data.code}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "code",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    required
                                />
                                {editForm.errors.code && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.code}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Nama Divisi *</Label>
                                <Input
                                    id="edit-name"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData("name", e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.name && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-description">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="edit-description"
                                    value={editForm.data.description}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="edit-active"
                                    checked={editForm.data.is_active}
                                    onCheckedChange={(checked) =>
                                        editForm.setData("is_active", checked)
                                    }
                                />
                                <Label htmlFor="edit-active">
                                    Aktifkan divisi
                                </Label>
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

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Divisi?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus divisi{" "}
                            <span className="font-semibold">
                                {selectedDivision?.name}
                            </span>
                            ? Tindakan ini tidak dapat dibatalkan.
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
