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
import { ArrowLeft, Save, Star } from "lucide-react";
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
        Record<
            number,
            { kriteria_id: number; nilai_skala: number; catatan: string }
        >
    >(() => {
        const initial: Record<
            number,
            { kriteria_id: number; nilai_skala: number; catatan: string }
        > = {};

        kriteria.forEach((k) => {
            const existing = existingPenilaian[k.id];
            initial[k.id] = {
                kriteria_id: k.id,
                nilai_skala: existing ? getSkalaFromNilai(existing.nilai) : 3,
                catatan: existing?.catatan || "",
            };
        });

        return initial;
    });

    const { processing } = useForm();

    function getSkalaFromNilai(nilai: number): number {
        if (nilai >= 90) return 5;
        if (nilai >= 80) return 4;
        if (nilai >= 70) return 3;
        if (nilai >= 60) return 2;
        return 1;
    }

    const handleSkalaChange = (kriteriaId: number, skala: number) => {
        setNilaiData((prev) => ({
            ...prev,
            [kriteriaId]: {
                ...prev[kriteriaId],
                nilai_skala: skala,
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

        // const nilaiArray = Object.values(nilaiData);

        router.post(route("penilaian.store", pesertaMagang.id), {
            periode_penilaian: periode,
            nilai: Object.values(nilaiData),
        });
    };

    const getSkalaLabel = (skala: number) => {
        const labels: Record<number, { text: string; color: string }> = {
            5: { text: "Sangat Baik (90-100)", color: "text-green-600" },
            4: { text: "Baik (80-89)", color: "text-blue-600" },
            3: { text: "Cukup (70-79)", color: "text-yellow-600" },
            2: { text: "Kurang (60-69)", color: "text-orange-600" },
            1: { text: "Sangat Kurang (50-59)", color: "text-red-600" },
        };
        return labels[skala];
    };

    return (
        <AuthenticatedLayout>
            <Head title="Input Penilaian" />

            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
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
                            Input Penilaian
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            {pesertaMagang.user?.name} -{" "}
                            {pesertaMagang.student_id}
                        </p>
                    </div>
                </div>

                {/* Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Peserta</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Nama</p>
                            <p className="font-semibold">
                                {pesertaMagang.user?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Universitas</p>
                            <p className="font-semibold">
                                {pesertaMagang.campus}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Periode Penilaian
                            </p>
                            <p className="font-semibold">
                                {new Date(periode).toLocaleDateString("id-ID", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Penilaian */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Kriteria Penilaian</CardTitle>
                            <CardDescription>
                                Berikan penilaian untuk setiap kriteria dengan
                                skala 1-5
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {kriteria.map((k, index) => (
                                <div
                                    key={k.id}
                                    className="border-b pb-6 last:border-b-0"
                                >
                                    <div className="space-y-4">
                                        {/* Kriteria Info */}
                                        <div>
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <Label className="text-base font-semibold">
                                                        {index + 1}. {k.nama}
                                                    </Label>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {k.deskripsi}
                                                    </p>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    Bobot: {k.bobot}%
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rating Selector */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {[1, 2, 3, 4, 5].map(
                                                    (skala) => (
                                                        <button
                                                            key={skala}
                                                            type="button"
                                                            onClick={() =>
                                                                handleSkalaChange(
                                                                    k.id,
                                                                    skala
                                                                )
                                                            }
                                                            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                                                                nilaiData[k.id]
                                                                    ?.nilai_skala ===
                                                                skala
                                                                    ? "border-blue-500 bg-blue-50"
                                                                    : "border-gray-200 hover:border-gray-300"
                                                            }`}
                                                        >
                                                            <div className="flex flex-col items-center gap-1">
                                                                <div className="flex">
                                                                    {Array.from(
                                                                        {
                                                                            length: skala,
                                                                        }
                                                                    ).map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <Star
                                                                                key={
                                                                                    i
                                                                                }
                                                                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                                <span className="text-lg font-bold">
                                                                    {skala}
                                                                </span>
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                            <p
                                                className={`text-sm font-medium ${
                                                    getSkalaLabel(
                                                        nilaiData[k.id]
                                                            ?.nilai_skala
                                                    ).color
                                                }`}
                                            >
                                                {
                                                    getSkalaLabel(
                                                        nilaiData[k.id]
                                                            ?.nilai_skala
                                                    ).text
                                                }
                                            </p>
                                        </div>

                                        {/* Catatan */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`catatan-${k.id}`}
                                                className="text-sm"
                                            >
                                                Catatan (Opsional)
                                            </Label>
                                            <Textarea
                                                id={`catatan-${k.id}`}
                                                placeholder="Tambahkan catatan untuk penilaian ini..."
                                                value={
                                                    nilaiData[k.id]?.catatan ||
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleCatatanChange(
                                                        k.id,
                                                        e.target.value
                                                    )
                                                }
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.visit(route("penilaian.index"))
                            }
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {processing ? "Menyimpan..." : "Simpan Penilaian"}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
