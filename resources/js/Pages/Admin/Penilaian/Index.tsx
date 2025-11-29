import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps, PaginatedData, PesertaMagang, Kriteria } from "@/types";
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
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    ClipboardList,
    Plus,
    Calendar,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface PenilaianIndexProps extends PageProps {
    pesertaMagang: PaginatedData<PesertaMagang>;
    kriteria: Kriteria[];
    periode: string;
    hasPenilaian: boolean;
}

export default function PenilaianIndex({
    pesertaMagang,
    kriteria,
    periode,
    hasPenilaian,
}: PenilaianIndexProps) {
    const [selectedPeriode, setSelectedPeriode] = useState(periode);

    const handlePeriodeChange = (newPeriode: string) => {
        setSelectedPeriode(newPeriode);
        router.visit(route("penilaian.index"), {
            data: { periode: newPeriode },
            preserveState: true,
        });
    };

    const handleInputPenilaian = (peserta: PesertaMagang) => {
        router.visit(
            route("penilaian.create", {
                pesertaMagang: peserta.id,
                periode: selectedPeriode,
            })
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Penilaian Peserta Magang" />

            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Penilaian Peserta Magang
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Input dan kelola penilaian kinerja peserta magang
                    </p>
                </div>

                {/* Filter Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Periode Penilaian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <Label htmlFor="periode">Pilih Periode</Label>
                                <Input
                                    id="periode"
                                    type="month"
                                    value={selectedPeriode.substring(0, 7)}
                                    onChange={(e) => {
                                        const newPeriode = `${e.target.value}-01`;
                                        handlePeriodeChange(newPeriode);
                                    }}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                {hasPenilaian ? (
                                    <div className="flex items-center gap-2 text-green-600 text-sm">
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>
                                            Ada penilaian di periode ini
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-orange-600 text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>Belum ada penilaian</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Kriteria */}
                <Card>
                    <CardHeader>
                        <CardTitle>Kriteria Penilaian</CardTitle>
                        <CardDescription>
                            Total {kriteria.length} kriteria dengan bobot
                            masing-masing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {kriteria.map((k) => (
                                <div
                                    key={k.id}
                                    className="border rounded-lg p-3"
                                >
                                    <p className="text-xs text-gray-500">
                                        {k.kode}
                                    </p>
                                    <p className="font-medium text-sm">
                                        {k.nama}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {k.bobot}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Table Peserta */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Peserta Magang Aktif</CardTitle>
                        <CardDescription>
                            {pesertaMagang.total} peserta magang aktif
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {pesertaMagang.data.length === 0 ? (
                            <div className="text-center py-12">
                                <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    Tidak ada peserta magang aktif
                                </h3>
                            </div>
                        ) : (
                            <>
                                {/* Mobile View */}
                                <div className="block lg:hidden divide-y">
                                    {pesertaMagang.data.map((peserta) => (
                                        <div
                                            key={peserta.id}
                                            className="p-4 space-y-3"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold">
                                                        {peserta.user?.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {peserta.student_id}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {peserta.campus}
                                                    </p>
                                                </div>
                                                <Badge>
                                                    {peserta.status_magang}
                                                </Badge>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="w-full"
                                                onClick={() =>
                                                    handleInputPenilaian(
                                                        peserta
                                                    )
                                                }
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Input Penilaian
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop View */}
                                <div className="hidden lg:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>NIM/NIS</TableHead>
                                                <TableHead>
                                                    Universitas
                                                </TableHead>
                                                <TableHead>Mentor</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    Aksi
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {pesertaMagang.data.map(
                                                (peserta) => (
                                                    <TableRow key={peserta.id}>
                                                        <TableCell className="font-medium">
                                                            {peserta.user?.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {peserta.student_id}
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            {
                                                                peserta.campus
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-gray-600">
                                                            {peserta.mentor
                                                                ?.name || "-"}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                variant={
                                                                    peserta.status_magang ===
                                                                    "aktif"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                                className="capitalize"
                                                            >
                                                                {
                                                                    peserta.status_magang
                                                                }
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleInputPenilaian(
                                                                        peserta
                                                                    )
                                                                }
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Input Penilaian
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
