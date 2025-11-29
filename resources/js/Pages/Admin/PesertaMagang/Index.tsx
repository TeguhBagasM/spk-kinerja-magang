import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";

interface Peserta {
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
        phone: string;
    };
    division?: {
        id: number;
        name: string;
        code: string;
    };
    mentor?: {
        id: number;
        name: string;
        position?: string;
        department?: string;
    };
}

interface Mentor {
    id: number;
    name: string;
    position?: string;
    department?: string;
}

export default function Index({
    auth,
    peserta,
    mentors,
}: PageProps<{ peserta: Peserta[]; mentors: Mentor[] }>) {
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
    const [selectedPeserta, setSelectedPeserta] = useState<Peserta | null>(
        null
    );

    const { data, setData, post, processing, reset } = useForm({
        mentor_id: "",
    });

    const handleOpenAssignDialog = (peserta: Peserta) => {
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

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Peserta Magang" />

            <div className="max-w-7xl mx-auto py-8">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Daftar Peserta Magang yang Disetujui
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>NIM/NIS</TableHead>
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
                                                className="text-center py-6"
                                            >
                                                Tidak ada peserta magang.
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {peserta.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-medium">
                                                {p.user.name}
                                            </TableCell>
                                            <TableCell>
                                                {p.student_id}
                                            </TableCell>
                                            <TableCell>{p.campus}</TableCell>
                                            <TableCell>
                                                {p.division ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {p.division.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {p.division.code}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        Tidak ada divisi
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {p.mentor ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {p.mentor.name}
                                                        </span>
                                                        {p.mentor.position && (
                                                            <span className="text-xs text-gray-500">
                                                                {
                                                                    p.mentor
                                                                        .position
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        Belum ditentukan
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{p.start_date}</span>
                                                    <span className="text-gray-500">
                                                        sampai
                                                    </span>
                                                    <span>{p.end_date}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="default"
                                                    className="bg-green-600"
                                                >
                                                    Disetujui
                                                </Badge>
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
