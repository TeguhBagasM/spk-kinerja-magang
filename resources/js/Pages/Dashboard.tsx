import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Users,
    ClipboardList,
    FileText,
    TrendingUp,
    Award,
    Clock,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
} from "recharts";

import type { PieLabelRenderProps } from "recharts";

interface DashboardStats {
    totalPeserta?: number;
    totalMentor?: number;
    totalDivisi?: number;
    penilaianSelesai?: number;
    nilaiRataRata?: number;
    totalKriteria?: number;
    hariMagang?: number;
    ranking?: number;
    skorAkhir?: number;
}

interface DistribusiDivisi {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface TrenData {
    bulan: string;
    peserta?: number;
    penilaian: number;
}

interface PenilaianTerbaru {
    name: string;
    score: number;
    status: string;
}

interface PenilaianKriteria {
    name: string;
    score: number;
    max: number;
}

interface DashboardPageProps extends PageProps {
    stats: DashboardStats;
    distribusiDivisi?: DistribusiDivisi[];
    trenData?: TrenData[];
    penilaianTerbaru?: PenilaianTerbaru[];
    penilaianPerKriteria?: PenilaianKriteria[];
    trenNilai?: TrenData[];
    error?: string;
}

// Warna untuk Pie Chart
const COLORS = ["#0891b2", "#22c55e", "#f97316", "#06b6d4", "#8b5cf6"];

export default function Dashboard() {
    const {
        auth,
        stats,
        distribusiDivisi,
        trenData,
        penilaianTerbaru,
        penilaianPerKriteria,
        trenNilai,
        error,
    } = usePage<DashboardPageProps>().props;

    const userRoles = auth.user?.roles || [];

    // Check user role
    const isAdmin = userRoles.includes("admin");
    const isMentor = userRoles.includes("mentor");
    const isPeserta = userRoles.includes("peserta_magang");

    // Stats cards based on role
    const getStatsCards = () => {
        if (isAdmin || isMentor) {
            return [
                {
                    title: "Total Peserta",
                    value: stats?.totalPeserta?.toString() || "0",
                    description: "Peserta magang aktif",
                    icon: Users,
                    color: "bg-blue-500",
                },
                {
                    title: "Mentor",
                    value: stats?.totalMentor?.toString() || "0",
                    description: "Mentor aktif",
                    icon: Award,
                    color: "bg-green-500",
                },
                {
                    title: "Total Divisi",
                    value: stats?.totalDivisi?.toString() || "0",
                    description: "Divisi yang tersedia",
                    icon: ClipboardList,
                    color: "bg-orange-500",
                },
                {
                    title: "Penilaian Selesai",
                    value: stats?.penilaianSelesai?.toString() || "0",
                    description: "Penilaian bulan ini",
                    icon: FileText,
                    color: "bg-purple-500",
                },
            ];
        } else {
            // Stats for peserta magang
            return [
                {
                    title: "Nilai Rata-rata",
                    value: stats?.nilaiRataRata?.toString() || "0",
                    description: "Performa keseluruhan",
                    icon: TrendingUp,
                    color: "bg-blue-500",
                },
                {
                    title: "Penilaian Selesai",
                    value: `${stats?.penilaianSelesai || 0}/${
                        stats?.totalKriteria || 0
                    }`,
                    description: "Dari total kriteria",
                    icon: FileText,
                    color: "bg-green-500",
                },
                {
                    title: "Hari Magang",
                    value: `${stats?.hariMagang ?? 0}`,
                    description: "Hari kerja efektif",
                    icon: Clock,
                    color: "bg-orange-500",
                },
                {
                    title: "Ranking",
                    value: stats?.ranking ? `#${stats.ranking}` : "-",
                    description: `Dari ${stats?.totalPeserta || 0} peserta`,
                    icon: Award,
                    color: "bg-purple-500",
                },
            ];
        }
    };

    const statsCards = getStatsCards();

    // Handle error state
    if (error) {
        return (
            <AuthenticatedLayout>
                <Head title="Dashboard" />
                <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Selamat datang kembali, {auth.user?.name}!
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`${stat.color} p-2 rounded-lg`}
                                    >
                                        <Icon className="h-4 w-4 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {stat.value}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Pie Chart - Only for Admin/Mentor */}
                    {(isAdmin || isMentor) &&
                        distribusiDivisi &&
                        distribusiDivisi.length > 0 && (
                            <Card className="col-span-1">
                                <CardHeader>
                                    <CardTitle>
                                        Distribusi Peserta Aktif
                                    </CardTitle>
                                    <CardDescription>
                                        Data Peserta Magang berdasarkan divisi
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={300}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={distribusiDivisi}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({
                                                    name,
                                                    percent,
                                                }: PieLabelRenderProps) =>
                                                    `${name ?? "Unknown"}: ${
                                                        percent
                                                            ? (
                                                                  percent * 100
                                                              ).toFixed(0)
                                                            : 0
                                                    }%`
                                                }
                                            >
                                                {distribusiDivisi.map(
                                                    (
                                                        _,
                                                        index // ✅ Fix: Rename entry to _
                                                    ) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 space-y-2">
                                        {distribusiDivisi.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between text-sm"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                COLORS[
                                                                    index %
                                                                        COLORS.length
                                                                ],
                                                        }}
                                                    />
                                                    <span>{item.name}</span>
                                                </div>
                                                <span className="font-semibold">
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                    {/* Performance Chart */}
                    {(isAdmin || isMentor) && trenData && (
                        <Card
                            className={
                                distribusiDivisi && distribusiDivisi.length > 0
                                    ? "col-span-1"
                                    : "col-span-2"
                            }
                        >
                            <CardHeader>
                                <CardTitle>Tren Peserta & Penilaian</CardTitle>
                                <CardDescription>
                                    Data 6 bulan terakhir
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={trenData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="bulan" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="peserta"
                                            fill="#3b82f6"
                                            name="Peserta"
                                        />
                                        <Bar
                                            dataKey="penilaian"
                                            fill="#10b981"
                                            name="Penilaian"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {/* Line Chart for Peserta */}
                    {isPeserta && trenNilai && (
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle>Perkembangan Nilai Anda</CardTitle>
                                <CardDescription>
                                    Rata-rata nilai 6 bulan terakhir
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={trenNilai}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="bulan" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="penilaian"
                                            stroke="#8b5cf6"
                                            strokeWidth={2}
                                            name="Nilai"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recent Activity Table - Admin/Mentor */}
                {(isAdmin || isMentor) &&
                    penilaianTerbaru &&
                    penilaianTerbaru.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Penilaian Terbaru</CardTitle>
                                <CardDescription>
                                    Hasil penilaian peserta magang terkini
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {penilaianTerbaru.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 rounded-lg border"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">
                                                        {item.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {item.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {item.score}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Score
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {/* Personal Progress for Peserta */}
                {isPeserta &&
                    penilaianPerKriteria &&
                    penilaianPerKriteria.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Kriteria Penilaian Anda</CardTitle>
                                <CardDescription>
                                    Progress penilaian berdasarkan kriteria
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {penilaianPerKriteria.map(
                                        (criteria, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2"
                                            >
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-medium">
                                                        {criteria.name}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {criteria.score}/
                                                        {criteria.max}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all ${
                                                            criteria.score >= 90
                                                                ? "bg-emerald-600"
                                                                : criteria.score >=
                                                                  80
                                                                ? "bg-blue-600"
                                                                : criteria.score >=
                                                                  70
                                                                ? "bg-yellow-600"
                                                                : criteria.score >=
                                                                  60
                                                                ? "bg-orange-600"
                                                                : "bg-red-600"
                                                        }`}
                                                        style={{
                                                            width: `${
                                                                (criteria.score /
                                                                    criteria.max) *
                                                                100
                                                            }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                {/* Empty State - Peserta belum ada penilaian */}
                {isPeserta &&
                    (!penilaianPerKriteria ||
                        penilaianPerKriteria.length === 0) && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Belum Ada Penilaian
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Anda belum memiliki data penilaian. Hubungi
                                    mentor Anda untuk informasi lebih lanjut.
                                </p>
                            </CardContent>
                        </Card>
                    )}
            </div>
        </AuthenticatedLayout>
    );
}
