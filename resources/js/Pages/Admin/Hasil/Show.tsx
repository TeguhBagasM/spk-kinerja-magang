import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps, HasilSaw, Penilaian } from "@/types";
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
    Trophy,
    ArrowLeft,
    Medal,
    Award,
    User,
    Building2,
    Calendar,
    Star,
    TrendingUp,
} from "lucide-react";

interface HasilSawShowProps extends PageProps {
    hasilSaw: HasilSaw & {
        peserta_magang: {
            user: { name: string };
            student_id: string;
            campus: string;
            mentor: { name: string } | null;
        };
    };
    penilaianDetail: (Penilaian & {
        kriteria: {
            nama: string;
            bobot: number;
            jenis: "benefit" | "cost";
        };
    })[];
}

export default function HasilSawShow({
    hasilSaw,
    penilaianDetail,
}: HasilSawShowProps) {
    const getRankingBadge = (ranking: number) => {
        if (ranking === 1)
            return (
                <div className="flex items-center gap-2 text-yellow-600">
                    <Trophy className="h-6 w-6" />
                    <span className="text-2xl font-bold">Rank #{ranking}</span>
                </div>
            );
        if (ranking === 2)
            return (
                <div className="flex items-center gap-2 text-gray-600">
                    <Medal className="h-6 w-6" />
                    <span className="text-2xl font-bold">Rank #{ranking}</span>
                </div>
            );
        if (ranking === 3)
            return (
                <div className="flex items-center gap-2 text-orange-600">
                    <Award className="h-6 w-6" />
                    <span className="text-2xl font-bold">Rank #{ranking}</span>
                </div>
            );
        return (
            <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-gray-400" />
                <span className="text-2xl font-bold">Rank #{ranking}</span>
            </div>
        );
    };

    const getScoreColor = (score: number) => {
        if (score >= 0.9) return "text-green-600 bg-green-50";
        if (score >= 0.8) return "text-blue-600 bg-blue-50";
        if (score >= 0.7) return "text-yellow-600 bg-yellow-50";
        return "text-gray-600 bg-gray-50";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 0.9) return "Sangat Baik";
        if (score >= 0.8) return "Baik";
        if (score >= 0.7) return "Cukup";
        return "Perlu Peningkatan";
    };

    // Calculate percentage for progress bars
    const getPercentage = (nilai: number) => {
        return (nilai / 100) * 100;
    };

    return (
        <AuthenticatedLayout>
            <Head
                title={`Detail Ranking - ${hasilSaw.peserta_magang?.user?.name}`}
            />

            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Back Button */}
                <Button
                    variant="outline"
                    onClick={() => router.visit(route("hasil-saw.index"))}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Ranking
                </Button>

                {/* Header - Profile & Ranking */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profil Peserta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Nama Lengkap
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {hasilSaw.peserta_magang?.user?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">
                                        NIM/NIS
                                    </p>
                                    <p className="text-lg font-semibold">
                                        {hasilSaw.peserta_magang?.student_id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Building2 className="h-4 w-4" />
                                        Universitas/Sekolah
                                    </p>
                                    <p className="text-base">
                                        {hasilSaw.peserta_magang?.campus}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Periode Penilaian
                                    </p>
                                    <p className="text-base">
                                        {new Date(
                                            hasilSaw.periode_penilaian
                                        ).toLocaleDateString("id-ID", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                {hasilSaw.peserta_magang?.mentor && (
                                    <div className="sm:col-span-2">
                                        <p className="text-sm text-gray-500">
                                            Mentor Pembimbing
                                        </p>
                                        <p className="text-base">
                                            {
                                                hasilSaw.peserta_magang.mentor
                                                    .name
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ranking & Score Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Hasil Penilaian
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">
                                    Peringkat
                                </p>
                                <div className="flex justify-center">
                                    {getRankingBadge(hasilSaw.ranking)}
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-gray-500 mb-2">
                                    Skor Akhir SAW
                                </p>
                                <div
                                    className={`inline-block px-6 py-4 rounded-lg ${getScoreColor(
                                        hasilSaw.skor_akhir
                                    )}`}
                                >
                                    <p className="text-4xl font-bold">
                                        {hasilSaw.skor_akhir.toFixed(4)}
                                    </p>
                                    <p className="text-sm font-medium mt-1">
                                        {getScoreLabel(hasilSaw.skor_akhir)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown Nilai per Kriteria */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Penilaian per Kriteria</CardTitle>
                        <CardDescription>
                            Breakdown nilai untuk setiap kriteria penilaian
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Mobile View */}
                        <div className="block lg:hidden space-y-4">
                            {penilaianDetail.map((penilaian) => (
                                <div
                                    key={penilaian.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold">
                                                {penilaian.kriteria.nama}
                                            </h4>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                    Bobot:{" "}
                                                    {penilaian.kriteria.bobot}%
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${
                                                        penilaian.kriteria
                                                            .jenis === "benefit"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                    }`}
                                                >
                                                    {penilaian.kriteria
                                                        .jenis === "benefit"
                                                        ? "Benefit"
                                                        : "Cost"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {penilaian.nilai}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                / 100
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{
                                                    width: `${getPercentage(
                                                        penilaian.nilai
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                        <div>
                                            <span className="font-medium">
                                                Ternormalisasi:
                                            </span>{" "}
                                            {penilaian.nilai_ternormalisasi?.toFixed(
                                                4
                                            ) || "-"}
                                        </div>
                                        <div>
                                            <span className="font-medium">
                                                Preferensi:
                                            </span>{" "}
                                            {penilaian.nilai_preferensi?.toFixed(
                                                4
                                            ) || "-"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop View */}
                        <div className="hidden lg:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Kriteria</TableHead>
                                        <TableHead className="text-center">
                                            Bobot
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Jenis
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Nilai Asli
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Nilai Ternormalisasi
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Nilai Preferensi
                                        </TableHead>
                                        <TableHead className="w-48">
                                            Progress
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {penilaianDetail.map((penilaian) => (
                                        <TableRow key={penilaian.id}>
                                            <TableCell className="font-medium">
                                                {penilaian.kriteria.nama}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold">
                                                    {penilaian.kriteria.bobot}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span
                                                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                        penilaian.kriteria
                                                            .jenis === "benefit"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-orange-100 text-orange-700"
                                                    }`}
                                                >
                                                    {penilaian.kriteria
                                                        .jenis === "benefit"
                                                        ? "Benefit"
                                                        : "Cost"}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className="text-lg font-bold text-blue-600">
                                                    {penilaian.nilai}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center font-mono">
                                                {penilaian.nilai_ternormalisasi?.toFixed(
                                                    4
                                                ) || "-"}
                                            </TableCell>
                                            <TableCell className="text-center font-mono font-semibold">
                                                {penilaian.nilai_preferensi?.toFixed(
                                                    4
                                                ) || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-blue-600 h-2 rounded-full transition-all"
                                                            style={{
                                                                width: `${getPercentage(
                                                                    penilaian.nilai
                                                                )}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-xs text-gray-500 text-center">
                                                        {getPercentage(
                                                            penilaian.nilai
                                                        ).toFixed(0)}
                                                        %
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-blue-50 font-semibold">
                                        <TableCell
                                            colSpan={5}
                                            className="text-right"
                                        >
                                            Total Skor Akhir (SAW):
                                        </TableCell>
                                        <TableCell
                                            className="text-center"
                                            colSpan={2}
                                        >
                                            <span className="text-xl font-bold text-blue-600">
                                                {hasilSaw.skor_akhir.toFixed(4)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Info Box - SAW Method */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <h4 className="font-semibold text-blue-900 mb-2">
                            Tentang Metode SAW (Simple Additive Weighting)
                        </h4>
                        <div className="text-sm text-blue-800 space-y-2">
                            <p>
                                Metode SAW menghitung ranking dengan
                                langkah-langkah berikut:
                            </p>
                            <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>
                                    <strong>Normalisasi:</strong> Nilai asli
                                    dinormalisasi menjadi skala 0-1
                                </li>
                                <li>
                                    <strong>Pembobotan:</strong> Nilai
                                    ternormalisasi dikalikan dengan bobot
                                    kriteria
                                </li>
                                <li>
                                    <strong>Penjumlahan:</strong> Semua nilai
                                    preferensi dijumlahkan untuk mendapatkan
                                    skor akhir
                                </li>
                                <li>
                                    <strong>Ranking:</strong> Peserta diurutkan
                                    berdasarkan skor akhir tertinggi
                                </li>
                            </ol>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
