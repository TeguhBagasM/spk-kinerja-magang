import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react";

interface PesertaMagang {
    id: number;
    student_id: string;
    campus: string;
    start_date: string;
    end_date: string;
    status_magang: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    division?: {
        id: number;
        name: string;
        code: string;
    };
    mentor?: {
        id: number;
        name: string;
        position: string;
        department: string;
    };
}

interface Mentor {
    id: number;
    name: string;
    position: string;
    department: string;
}

interface Division {
    id: number;
    name: string;
    code: string;
}

export default function Manage({
    auth,
    peserta,
    mentors,
    divisions,
    pendingCount,
}: PageProps<{
    peserta: PesertaMagang[];
    mentors: Mentor[];
    divisions: Division[];
    pendingCount: number;
}>) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedPeserta, setSelectedPeserta] =
        useState<PesertaMagang | null>(null);

    const createForm = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        student_id: "",
        campus: "",
        division_id: "",
        start_date: "",
        end_date: "",
        mentor_id: "",
        status_magang: "aktif",
    });

    const editForm = useForm({
        name: "",
        email: "",
        phone: "",
        student_id: "",
        campus: "",
        division_id: "",
        start_date: "",
        end_date: "",
        mentor_id: "",
        status_magang: "aktif",
        password: "",
        password_confirmation: "",
    });

    const { data, setData, post, processing, reset } = useForm({
        mentor_id: "",
    });

    const { delete: destroy, processing: deleting } = useForm();

    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route("admin.peserta-magang.store"), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    const handleOpenEditDialog = (peserta: PesertaMagang) => {
        setSelectedPeserta(peserta);
        editForm.setData({
            name: peserta.user.name,
            email: peserta.user.email,
            phone: peserta.user.phone || "",
            student_id: peserta.student_id,
            campus: peserta.campus,
            division_id: peserta.division?.id.toString() || "",
            start_date: peserta.start_date,
            end_date: peserta.end_date,
            mentor_id: peserta.mentor?.id.toString() || "",
            status_magang: peserta.status_magang,
            password: "",
            password_confirmation: "",
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedPeserta) return;

        editForm.put(route("admin.peserta-magang.update", selectedPeserta.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
                setSelectedPeserta(null);
            },
        });
    };

    const handleOpenDeleteDialog = (peserta: PesertaMagang) => {
        setSelectedPeserta(peserta);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = () => {
        if (!selectedPeserta) return;

        destroy(route("admin.peserta-magang.destroy", selectedPeserta.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedPeserta(null);
            },
        });
    };
    const handleOpenAssignDialog = (peserta: PesertaMagang) => {
        setSelectedPeserta(peserta);
        setData("mentor_id", peserta.mentor?.id?.toString() || "");
        setIsAssignDialogOpen(true);
    };

    const handleAssignMentor = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPeserta || !data.mentor_id) return;

        post(route("admin.peserta-magang.assign-mentor", selectedPeserta.id), {
            onSuccess: () => {
                setIsAssignDialogOpen(false);
                reset();
                setSelectedPeserta(null);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            aktif: "bg-green-600",
            selesai: "bg-blue-600",
            berhenti: "bg-red-600",
        };
        return variants[status as keyof typeof variants] || "bg-gray-600";
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Peserta Magang" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            Manajemen Peserta Magang
                        </CardTitle>

                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() =>
                                    router.get("/admin/user-approval")
                                }
                                variant="outline"
                                className="relative gap-2"
                            >
                                <Users className="h-4 w-4" />
                                User Approval
                                {pendingCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </Button>

                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="gap-2"
                            >
                                <PlusCircle className="h-4 w-4" />
                                Tambah Peserta
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIM</TableHead>
                                        <TableHead>Kampus</TableHead>
                                        <TableHead>Divisi</TableHead>
                                        <TableHead>Mentor</TableHead>
                                        <TableHead>Periode</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {peserta.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Belum ada peserta magang.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {peserta.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">
                                                {p.user.name}
                                            </TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {p.student_id}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {p.campus}
                                            </TableCell>
                                            <TableCell>
                                                {p.division ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-sm">
                                                            {p.division.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {p.division.code}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {p.mentor ? (
                                                    <span className="text-sm">
                                                        {p.mentor.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">
                                                        Belum ditentukan
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs">
                                                    <span>{p.start_date}</span>
                                                    <span className="text-gray-500">
                                                        s/d
                                                    </span>
                                                    <span>{p.end_date}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={getStatusBadge(
                                                        p.status_magang
                                                    )}
                                                >
                                                    {p.status_magang
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        p.status_magang.slice(
                                                            1
                                                        )}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenEditDialog(
                                                                p
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
                                                                p
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant={
                                                            p.mentor
                                                                ? "outline"
                                                                : "default"
                                                        }
                                                        onClick={() =>
                                                            handleOpenAssignDialog(
                                                                p
                                                            )
                                                        }
                                                    >
                                                        {p.mentor
                                                            ? "Ubah"
                                                            : "Atur"}{" "}
                                                        Mentor
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
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Tambah Peserta Magang</DialogTitle>
                        <DialogDescription>
                            Isi form untuk menambahkan peserta magang baru
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NIM/Student ID *</Label>
                                    <Input
                                        value={createForm.data.student_id}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "student_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kampus *</Label>
                                    <Input
                                        value={createForm.data.campus}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "campus",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Divisi *</Label>
                                <Select
                                    value={createForm.data.division_id}
                                    onValueChange={(value) =>
                                        createForm.setData("division_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih divisi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {divisions.map((div) => (
                                            <SelectItem
                                                key={div.id}
                                                value={div.id.toString()}
                                            >
                                                {div.name} ({div.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Mulai *</Label>
                                    <Input
                                        type="date"
                                        value={createForm.data.start_date}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Selesai *</Label>
                                    <Input
                                        type="date"
                                        value={createForm.data.end_date}
                                        onChange={(e) =>
                                            createForm.setData(
                                                "end_date",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mentor</Label>
                                    <Select
                                        value={createForm.data.mentor_id}
                                        onValueChange={(value) =>
                                            createForm.setData(
                                                "mentor_id",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih mentor (opsional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mentors.map((mentor) => (
                                                <SelectItem
                                                    key={mentor.id}
                                                    value={mentor.id.toString()}
                                                >
                                                    {mentor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status Magang *</Label>
                                    <Select
                                        value={createForm.data.status_magang}
                                        onValueChange={(value) =>
                                            createForm.setData(
                                                "status_magang",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="selesai">
                                                Selesai
                                            </SelectItem>
                                            <SelectItem value="berhenti">
                                                Berhenti
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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

            {/* Edit Dialog - Similar to Create */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Peserta Magang</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            {/* Same fields as create but using editForm */}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>NIM *</Label>
                                    <Input
                                        value={editForm.data.student_id}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "student_id",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Kampus *</Label>
                                    <Input
                                        value={editForm.data.campus}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "campus",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Divisi *</Label>
                                <Select
                                    value={editForm.data.division_id}
                                    onValueChange={(value) =>
                                        editForm.setData("division_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {divisions.map((div) => (
                                            <SelectItem
                                                key={div.id}
                                                value={div.id.toString()}
                                            >
                                                {div.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Tanggal Mulai *</Label>
                                    <Input
                                        type="date"
                                        value={editForm.data.start_date}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "start_date",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tanggal Selesai *</Label>
                                    <Input
                                        type="date"
                                        value={editForm.data.end_date}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "end_date",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mentor</Label>
                                    <Select
                                        value={editForm.data.mentor_id}
                                        onValueChange={(value) =>
                                            editForm.setData("mentor_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih mentor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mentors.map((mentor) => (
                                                <SelectItem
                                                    key={mentor.id}
                                                    value={mentor.id.toString()}
                                                >
                                                    {mentor.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status *</Label>
                                    <Select
                                        value={editForm.data.status_magang}
                                        onValueChange={(value) =>
                                            editForm.setData(
                                                "status_magang",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="aktif">
                                                Aktif
                                            </SelectItem>
                                            <SelectItem value="selesai">
                                                Selesai
                                            </SelectItem>
                                            <SelectItem value="berhenti">
                                                Berhenti
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-2">
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
                        <AlertDialogTitle>
                            Hapus Peserta Magang?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus{" "}
                            <span className="font-semibold">
                                {selectedPeserta?.user.name}
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

            {/* Dialog Assign/Edit Mentor */}
            <Dialog
                open={isAssignDialogOpen}
                onOpenChange={setIsAssignDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedPeserta?.mentor ? "Ubah" : "Atur"} Mentor
                        </DialogTitle>
                        <DialogDescription>
                            Pilih mentor untuk{" "}
                            <span className="font-semibold">
                                {selectedPeserta?.user.name}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAssignMentor}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="mentor">Mentor</Label>
                                <Select
                                    value={data.mentor_id}
                                    onValueChange={(value) =>
                                        setData("mentor_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mentor..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mentors.map((mentor) => (
                                            <SelectItem
                                                key={mentor.id}
                                                value={mentor.id.toString()}
                                            >
                                                <div className="flex flex-col">
                                                    <span>{mentor.name}</span>
                                                    {mentor.position && (
                                                        <span className="text-xs text-gray-500">
                                                            {mentor.position} -{" "}
                                                            {mentor.department}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAssignDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
