import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

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

interface Peserta {
    id: number;
    student_id: string;
    campus: string;
    division: string;
    start_date: string;
    end_date: string;
    status_magang: string;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    mentor?: {
        id: number;
        name: string;
    };
}

export default function Index({
    auth,
    peserta,
}: PageProps<{ peserta: Peserta[] }>) {
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
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {peserta.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={7}
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
                                            <TableCell>{p.division}</TableCell>

                                            <TableCell>
                                                {p.mentor ? (
                                                    <span>{p.mentor.name}</span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">
                                                        Belum ditentukan
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span>{p.start_date}</span>
                                                    <span>sampai</span>
                                                    <span>{p.end_date}</span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="success"
                                                    className="bg-green-600"
                                                >
                                                    Disetujui
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
