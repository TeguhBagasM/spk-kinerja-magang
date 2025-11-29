import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { PageProps, HasilSaw } from "@/types";
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
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Trophy,
    Calculator,
    Calendar,
    Medal,
    Award,
    AlertCircle,
    Eye,
} from "lucide-react";
import { useState } from "react";

interface HasilSawIndexProps extends PageProps {
    hasilSaw: HasilSaw[];
    periode: string;
    penilaianCount: number;
    hasHasil: boolean;
    availablePeriodes: string[];
}

export default function HasilSawIndex({
    hasilSaw,
    periode,
    penilaianCount,
    hasHasil,
}: HasilSawIndexProps) {
    const [selectedPeriode, setSelectedPeriode] = useState(periode);
    const { processing } = useForm();

    const handlePeriodeChange = (newPeriode: string) => {
        setSelectedPeriode(newPeriode);
        router.visit(route("hasil-saw.index"), {
            data: { periode: newPeriode },
            preserveState: true,
        });
    };

    const handleCalculate = () => {
        if (
            confirm(
                "Hitung ulang ranking untuk periode ini? Data sebelumnya akan di-update."
            )
        ) {
            // error disini, dan solusinya:Kalau kamu cuma butuh kirim nilai biasa, jangan pakai useForm, pakai router langsung
            router.post(route("hasil-saw.calculate"), {
                periode: selectedPeriode,
            });
        }
    };

    const getRankingBadge = (ranking: number) => {
        if (ranking === 1)
            return (
                <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-bold text-yellow-600">
                        Rank #{ranking}
                    </span>
                </div>
            );
        if (ranking === 2)
            return (
                <div className="flex items-center gap-2">
                    <Medal className="h-5 w-5 text-gray-400" />
                    <span className="font-bold text-gray-600">
                        Rank #{ranking}
                    </span>
                </div>
            );
        if (ranking === 3)
            return (
                <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-500" />
                    <span className="font-bold text-orange-600">
                        Rank #{ranking}
                    </span>
                </div>
            );
        return <span className="font-semibold">Rank #{ranking}</span>;
    };

    const getScoreColor = (score: number) => {
        if (score >= 0.9) return "text-green-600";
        if (score >= 0.8) return "text-blue-600";
        if (score >= 0.7) return "text-yellow-600";
        return "text-gray-600";
    };

    return (
        <AuthenticatedLayout>
            <Head title="Hasil Penilaian & Ranking" />

            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Hasil Penilaian & Ranking
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Ranking peserta magang berdasarkan metode SAW (Simple
                        Additive Weighting)
                    </p>
                </div>

                {/* Filter & Action Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Periode & Perhitungan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
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
                            <div className="flex items-end gap-2">
                                <Button
                                    onClick={handleCalculate}
                                    disabled={
                                        processing || penilaianCount === 0
                                    }
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Calculator className="mr-2 h-4 w-4" />
                                    {processing
                                        ? "Menghitung..."
                                        : "Hitung Ranking"}
                                </Button>
                            </div>
                        </div>

                        {penilaianCount === 0 && (
                            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-orange-800">
                                    <p className="font-semibold">
                                        Belum ada data penilaian
                                    </p>
                                    <p>
                                        Silakan input penilaian terlebih dahulu
                                        sebelum menghitung ranking.
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results */}
                {!hasHasil ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Trophy className="h-16 w-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Belum Ada Hasil Ranking
                            </h3>
                            <p className="text-gray-600 text-center max-w-md mb-4">
                                Klik tombol "Hitung Ranking" untuk menghitung
                                skor dan peringkat peserta magang.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Ranking Peserta Magang</CardTitle>
                            <CardDescription>
                                Periode:{" "}
                                {new Date(periode).toLocaleDateString("id-ID", {
                                    month: "long",
                                    year: "numeric",
                                })}{" "}
                                • Total {hasilSaw.length} peserta
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {/* Mobile View */}
                            <div className="block lg:hidden divide-y">
                                {hasilSaw.map((hasil) => (
                                    <div
                                        key={hasil.id}
                                        className="p-4 space-y-3"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                {getRankingBadge(hasil.ranking)}
                                                <h4 className="font-semibold mt-2">
                                                    {
                                                        hasil.peserta_magang
                                                            ?.user?.name
                                                    }
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {
                                                        hasil.peserta_magang
                                                            ?.student_id
                                                    }
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">
                                                    Skor
                                                </p>
                                                <p
                                                    className={`text-2xl font-bold ${getScoreColor(
                                                        hasil.skor_akhir
                                                    )}`}
                                                >
                                                    {hasil.skor_akhir.toFixed(
                                                        4
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        "hasil-saw.show",
                                                        hasil.id
                                                    )
                                                )
                                            }
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Lihat Detail
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden lg:block">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-32">
                                                Ranking
                                            </TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead>NIM/NIS</TableHead>
                                            <TableHead>Universitas</TableHead>
                                            <TableHead className="text-right">
                                                Skor Akhir
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {hasilSaw.map((hasil) => (
                                            <TableRow
                                                key={hasil.id}
                                                className={
                                                    hasil.ranking <= 3
                                                        ? "bg-blue-50/50"
                                                        : ""
                                                }
                                            >
                                                <TableCell>
                                                    {getRankingBadge(
                                                        hasil.ranking
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {
                                                        hasil.peserta_magang
                                                            ?.user?.name
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        hasil.peserta_magang
                                                            ?.student_id
                                                    }
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {
                                                        hasil.peserta_magang
                                                            ?.campus
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={`text-lg font-bold ${getScoreColor(
                                                            hasil.skor_akhir
                                                        )}`}
                                                    >
                                                        {hasil.skor_akhir.toFixed(
                                                            4
                                                        )}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            router.visit(
                                                                route(
                                                                    "hasil-saw.show",
                                                                    hasil.id
                                                                )
                                                            )
                                                        }
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
