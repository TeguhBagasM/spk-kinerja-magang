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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    PlusCircle,
    Pencil,
    Trash2,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

interface Kriteria {
    id: number;
    kode: string;
    nama: string;
    deskripsi?: string;
    bobot: number;
    jenis: "benefit" | "cost";
    is_active: boolean;
    penilaian_count: number;
    created_at: string;
}

export default function Index({
    auth,
    kriteria,
}: PageProps<{ kriteria: Kriteria[] }>) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedKriteria, setSelectedKriteria] = useState<Kriteria | null>(
        null
    );

    const createForm = useForm({
        kode: "",
        nama: "",
        deskripsi: "",
        bobot: "",
        jenis: "benefit" as "benefit" | "cost",
        is_active: true,
    });

    const editForm = useForm({
        kode: "",
        nama: "",
        deskripsi: "",
        bobot: "",
        jenis: "benefit" as "benefit" | "cost",
        is_active: true,
    });

    const { delete: destroy, processing: deleting } = useForm();

    // Calculate total bobot
    const totalBobot = kriteria.reduce(
        (sum, k) => sum + parseFloat(k.bobot.toString()),
        0
    );

    // Handle Create
    const handleCreate: FormEventHandler = (e) => {
        e.preventDefault();
        createForm.post(route("admin.kriteria.store"), {
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createForm.reset();
            },
        });
    };

    // Handle Edit Dialog Open
    const handleOpenEditDialog = (kriteria: Kriteria) => {
        setSelectedKriteria(kriteria);
        editForm.setData({
            kode: kriteria.kode,
            nama: kriteria.nama,
            deskripsi: kriteria.deskripsi || "",
            bobot: kriteria.bobot.toString(),
            jenis: kriteria.jenis,
            is_active: kriteria.is_active,
        });
        setIsEditDialogOpen(true);
    };

    // Handle Update
    const handleUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        if (!selectedKriteria) return;

        editForm.put(route("admin.kriteria.update", selectedKriteria.id), {
            onSuccess: () => {
                setIsEditDialogOpen(false);
                editForm.reset();
                setSelectedKriteria(null);
            },
        });
    };

    // Handle Delete Dialog Open
    const handleOpenDeleteDialog = (kriteria: Kriteria) => {
        setSelectedKriteria(kriteria);
        setIsDeleteDialogOpen(true);
    };

    // Handle Delete
    const handleDelete = () => {
        if (!selectedKriteria) return;

        destroy(route("admin.kriteria.destroy", selectedKriteria.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setSelectedKriteria(null);
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Kriteria Penilaian" />

            <div className="max-w-7xl mx-auto py-8 px-4">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-semibold">
                                Manajemen Kriteria Penilaian
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                Total Bobot: {totalBobot.toFixed(2)}%
                                {totalBobot !== 100 && (
                                    <span className="text-amber-600 ml-2">
                                        (Harus 100%)
                                    </span>
                                )}
                            </p>
                        </div>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="gap-2"
                        >
                            <PlusCircle className="h-4 w-4" />
                            Tambah Kriteria
                        </Button>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kode</TableHead>
                                        <TableHead>Nama Kriteria</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead className="text-center">
                                            Bobot
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Jenis
                                        </TableHead>
                                        {/* <TableHead className="text-center">
                                            Penilaian
                                        </TableHead> */}
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {kriteria.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Belum ada kriteria. Klik tombol
                                                "Tambah Kriteria" untuk membuat
                                                kriteria baru.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {kriteria.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono font-medium">
                                                {item.kode}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item.nama}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {item.deskripsi || (
                                                    <span className="text-gray-400 text-sm">
                                                        Tidak ada deskripsi
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center font-semibold">
                                                {item.bobot}%
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        item.jenis === "benefit"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="gap-1"
                                                >
                                                    {item.jenis ===
                                                    "benefit" ? (
                                                        <>
                                                            <TrendingUp className="h-3 w-3" />
                                                            Benefit
                                                        </>
                                                    ) : (
                                                        <>
                                                            <TrendingDown className="h-3 w-3" />
                                                            Cost
                                                        </>
                                                    )}
                                                </Badge>
                                            </TableCell>
                                            {/* <TableCell className="text-center">
                                                <Badge variant="secondary">
                                                    {item.penilaian_count}
                                                </Badge>
                                            </TableCell> */}
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant={
                                                        item.is_active
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={
                                                        item.is_active
                                                            ? "bg-green-600"
                                                            : ""
                                                    }
                                                >
                                                    {item.is_active
                                                        ? "Aktif"
                                                        : "Nonaktif"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleOpenEditDialog(
                                                                item
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
                                                                item
                                                            )
                                                        }
                                                        disabled={
                                                            item.penilaian_count >
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

                        {totalBobot !== 100 && kriteria.length > 0 && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    <strong>Peringatan:</strong> Total bobot
                                    saat ini {totalBobot.toFixed(2)}%. Untuk
                                    perhitungan SAW yang valid, total bobot
                                    harus 100%.
                                </p>
                            </div>
                        )}
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
                        <DialogTitle>Tambah Kriteria Baru</DialogTitle>
                        <DialogDescription>
                            Isi form di bawah untuk menambahkan kriteria
                            penilaian baru
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-kode">
                                    Kode Kriteria *
                                </Label>
                                <Input
                                    id="create-kode"
                                    placeholder="Contoh: C1, C2, C3"
                                    value={createForm.data.kode}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "kode",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.kode && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.kode}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-nama">
                                    Nama Kriteria *
                                </Label>
                                <Input
                                    id="create-nama"
                                    placeholder="Contoh: Kedisiplinan, Kerjasama, dll"
                                    value={createForm.data.nama}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "nama",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.nama && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.nama}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-bobot">
                                    Bobot (%) *
                                </Label>
                                <Input
                                    id="create-bobot"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    placeholder="Contoh: 15, 20, 25"
                                    value={createForm.data.bobot}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "bobot",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {createForm.errors.bobot && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.bobot}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Pastikan total bobot semua kriteria = 100%
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-jenis">
                                    Jenis Kriteria *
                                </Label>
                                <Select
                                    value={createForm.data.jenis}
                                    onValueChange={(value) =>
                                        createForm.setData(
                                            "jenis",
                                            value as "benefit" | "cost"
                                        )
                                    }
                                >
                                    <SelectTrigger id="create-jenis">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="benefit">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                <div>
                                                    <div className="font-medium">
                                                        Benefit
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Semakin tinggi semakin
                                                        baik
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="cost">
                                            <div className="flex items-center gap-2">
                                                <TrendingDown className="h-4 w-4" />
                                                <div>
                                                    <div className="font-medium">
                                                        Cost
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Semakin rendah semakin
                                                        baik
                                                    </div>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {createForm.errors.jenis && (
                                    <p className="text-sm text-red-600">
                                        {createForm.errors.jenis}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-deskripsi">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="create-deskripsi"
                                    placeholder="Deskripsi singkat tentang kriteria..."
                                    value={createForm.data.deskripsi}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "deskripsi",
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
                                    Aktifkan kriteria
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
                        <DialogTitle>Edit Kriteria</DialogTitle>
                        <DialogDescription>
                            Perbarui informasi kriteria{" "}
                            <span className="font-semibold">
                                {selectedKriteria?.nama}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleUpdate}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-kode">
                                    Kode Kriteria *
                                </Label>
                                <Input
                                    id="edit-kode"
                                    value={editForm.data.kode}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "kode",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    required
                                />
                                {editForm.errors.kode && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.kode}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-nama">
                                    Nama Kriteria *
                                </Label>
                                <Input
                                    id="edit-nama"
                                    value={editForm.data.nama}
                                    onChange={(e) =>
                                        editForm.setData("nama", e.target.value)
                                    }
                                    required
                                />
                                {editForm.errors.nama && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.nama}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-bobot">Bobot (%) *</Label>
                                <Input
                                    id="edit-bobot"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={editForm.data.bobot}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "bobot",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {editForm.errors.bobot && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.bobot}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-jenis">
                                    Jenis Kriteria *
                                </Label>
                                <Select
                                    value={editForm.data.jenis}
                                    onValueChange={(value) =>
                                        editForm.setData(
                                            "jenis",
                                            value as "benefit" | "cost"
                                        )
                                    }
                                >
                                    <SelectTrigger id="edit-jenis">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="benefit">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Benefit (Semakin tinggi semakin
                                                baik)
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="cost">
                                            <div className="flex items-center gap-2">
                                                <TrendingDown className="h-4 w-4" />
                                                Cost (Semakin rendah semakin
                                                baik)
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {editForm.errors.jenis && (
                                    <p className="text-sm text-red-600">
                                        {editForm.errors.jenis}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-deskripsi">
                                    Deskripsi
                                </Label>
                                <Textarea
                                    id="edit-deskripsi"
                                    value={editForm.data.deskripsi}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "deskripsi",
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
                                    Aktifkan kriteria
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
                        <AlertDialogTitle>Hapus Kriteria?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kriteria{" "}
                            <span className="font-semibold">
                                {selectedKriteria?.nama}
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
