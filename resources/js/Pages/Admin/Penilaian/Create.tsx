import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { PageProps, PesertaMagang, Kriteria, Penilaian } from "@/types";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Input } from "@/Components/ui/input";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { ArrowLeft, Save, Info } from "lucide-react";
import { useState } from "react";

interface PenilaianCreateProps extends PageProps {
    pesertaMagang: PesertaMagang;
    kriteria: Kriteria[];
    periode: string;
    existingPenilaian: Record<number, Penilaian>;
}

export default function PenilaianCreate({
    pesertaMagang,
    kriteria,
    periode,
    existingPenilaian,
}: PenilaianCreateProps) {
    const [nilaiData, setNilaiData] = useState<
        Record<number, { kriteria_id: number; nilai: number; catatan: string }>
    >(() => {
        const initial: Record<
            number,
            { kriteria_id: number; nilai: number; catatan: string }
        > = {};

        kriteria.forEach((k) => {
            const existing = existingPenilaian[k.id];
            initial[k.id] = {
                kriteria_id: k.id,
                nilai: existing ? parseFloat(existing.nilai.toString()) : 0,
                catatan: existing?.catatan || "",
            };
        });

        return initial;
    });

    const { processing } = useForm();

    const handleNilaiChange = (kriteriaId: number, nilai: string) => {
        if (nilai === "") {
            setNilaiData((prev) => ({
                ...prev,
                [kriteriaId]: {
                    ...prev[kriteriaId],
                    nilai: 0,
                },
            }));
            return;
        }

        const numValue = parseFloat(nilai);

        // Validasi range 0-100
        if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

        setNilaiData((prev) => ({
            ...prev,
            [kriteriaId]: {
                ...prev[kriteriaId],
                nilai: numValue,
            },
        }));
    };

    const handleCatatanChange = (kriteriaId: number, catatan: string) => {
        setNilaiData((prev) => ({
            ...prev,
            [kriteriaId]: {
                ...prev[kriteriaId],
                catatan,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(route("penilaian.store", pesertaMagang.id), {
            periode_penilaian: periode,
            nilai: Object.values(nilaiData),
        });
    };

    // Helper untuk menentukan warna badge berdasarkan nilai
    const getNilaiCategory = (nilai: number) => {
        if (nilai >= 90)
            return {
                text: "Sangat Baik",
                color: "bg-emerald-100 text-emerald-700",
            };
        if (nilai >= 80)
            return {
                text: "Baik",
                color: "bg-blue-100 text-blue-700",
            };
        if (nilai >= 70)
            return {
                text: "Cukup",
                color: "bg-yellow-100 text-yellow-700",
            };
        if (nilai >= 60)
            return {
                text: "Kurang",
                color: "bg-orange-100 text-orange-700",
            };
        return {
            text: "Sangat Kurang",
            color: "bg-red-100 text-red-700",
        };
    };

    return (
        <AuthenticatedLayout>
            <Head title="Input Penilaian" />

            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 max-w-5xl">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.visit(route("penilaian.index"))}
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Input Penilaian Kinerja
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {pesertaMagang.user?.name} -{" "}
                            {pesertaMagang.student_id}
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Nama Peserta
                                </p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {pesertaMagang.user?.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Universitas
                                </p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {pesertaMagang.campus}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Periode Penilaian
                                </p>
                                <p className="font-semibold text-gray-900 mt-1">
                                    {new Date(periode).toLocaleDateString(
                                        "id-ID",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Panduan Penilaian - DI ATAS */}
                <Alert className="border-blue-200 bg-blue-50">
                    <Info className="h-4 w-4 text-blue-600" />
                    <AlertDescription>
                        <div className="space-y-2">
                            <p className="font-semibold text-blue-900 text-sm">
                                Panduan Penilaian (Skala 0-100):
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-gray-700">
                                        <strong>90-100:</strong> Sangat Baik
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-gray-700">
                                        <strong>80-89:</strong> Baik
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    <span className="text-gray-700">
                                        <strong>70-79:</strong> Cukup
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <span className="text-gray-700">
                                        <strong>60-69:</strong> Kurang
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-gray-700">
                                        <strong>&lt; 60:</strong> Sangat Kurang
                                    </span>
                                </div>
                            </div>
                        </div>
                    </AlertDescription>
                </Alert>

                {/* Form Penilaian */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kriteria Penilaian</CardTitle>
                            <CardDescription>
                                Berikan nilai untuk setiap kriteria berdasarkan
                                kinerja peserta magang
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {kriteria.map((k, index) => {
                                const currentNilai =
                                    nilaiData[k.id]?.nilai || 0;
                                const category = getNilaiCategory(currentNilai);

                                return (
                                    <div
                                        key={k.id}
                                        className="border border-gray-200 rounded-lg p-5 bg-white"
                                    >
                                        <div className="space-y-4">
                                            {/* Kriteria Header */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                                                            {index + 1}
                                                        </span>
                                                        <Label className="text-base font-bold text-gray-900">
                                                            {k.nama}
                                                        </Label>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mt-2 ml-8">
                                                        {k.deskripsi}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-xs text-gray-500 font-medium">
                                                        Bobot
                                                    </span>
                                                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded">
                                                        {k.bobot}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Input Nilai dengan Status Badge */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 ml-8">
                                                <div className="flex-shrink-0 w-full sm:w-32">
                                                    <Label
                                                        htmlFor={`nilai-${k.id}`}
                                                        className="text-sm text-gray-700 mb-1 block"
                                                    >
                                                        Nilai
                                                    </Label>
                                                    <Input
                                                        id={`nilai-${k.id}`}
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        value={
                                                            currentNilai || ""
                                                        }
                                                        onChange={(e) =>
                                                            handleNilaiChange(
                                                                k.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="0-100"
                                                        className="text-2xl font-bold text-center h-14"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-1 flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold ${category.color}`}
                                                    >
                                                        {category.text}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Catatan */}
                                            <div className="ml-8">
                                                <Label
                                                    htmlFor={`catatan-${k.id}`}
                                                    className="text-sm text-gray-700 mb-1 block"
                                                >
                                                    Catatan Penilaian{" "}
                                                    <span className="text-gray-400">
                                                        (Opsional)
                                                    </span>
                                                </Label>
                                                <Textarea
                                                    id={`catatan-${k.id}`}
                                                    placeholder="Berikan catatan atau feedback untuk kriteria ini..."
                                                    value={
                                                        nilaiData[k.id]
                                                            ?.catatan || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleCatatanChange(
                                                            k.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={2}
                                                    className="resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.visit(route("penilaian.index"))
                            }
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? "Menyimpan..." : "Simpan Penilaian"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
