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

// Dummy data untuk chart
const statusData = [
    { name: "UI/UX Designer", value: 1, color: "#0891b2" },
    { name: "Bussiness Analyst", value: 3, color: "#22c55e" },
    { name: "Fullstack Mobile", value: 2, color: "#f97316" },
    { name: "Fullstack Developer", value: 6, color: "#06b6d4" },
];

const performanceData = [
    { bulan: "Jan", peserta: 12, penilaian: 10 },
    { bulan: "Feb", peserta: 15, penilaian: 13 },
    { bulan: "Mar", peserta: 18, penilaian: 16 },
    { bulan: "Apr", peserta: 14, penilaian: 14 },
    { bulan: "Mei", peserta: 20, penilaian: 18 },
    { bulan: "Jun", peserta: 16, penilaian: 15 },
];

const recentScores = [
    { name: "Ahmad Fauzi", score: 92, status: "Excellent" },
    { name: "Siti Nurhaliza", score: 88, status: "Very Good" },
    { name: "Budi Santoso", score: 85, status: "Good" },
    { name: "Rina Melati", score: 90, status: "Excellent" },
];

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const userRoles = auth.user?.roles || [];

    // Check user role
    const isAdmin = userRoles.includes("admin");
    const isMentor = userRoles.includes("mentor");
    const isPeserta = userRoles.includes("peserta_magang");

    // Stats data based on role
    const getStatsCards = () => {
        if (isAdmin || isMentor) {
            return [
                {
                    title: "Total Peserta",
                    value: "17",
                    description: "Peserta magang aktif",
                    icon: Users,
                    color: "bg-blue-500",
                },
                {
                    title: "Mentor",
                    value: "10",
                    description: "Mentor aktif",
                    icon: Award,
                    color: "bg-green-500",
                },
                {
                    title: "Total Divisi",
                    value: "7",
                    description: "Divisi yang tersedia",
                    icon: ClipboardList,
                    color: "bg-orange-500",
                },
                {
                    title: "Penilaian Selesai",
                    value: "12",
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
                    value: "87.5",
                    description: "Performa keseluruhan",
                    icon: TrendingUp,
                    color: "bg-blue-500",
                },
                {
                    title: "Penilaian Selesai",
                    value: "8",
                    description: "Dari 10 kriteria",
                    icon: FileText,
                    color: "bg-green-500",
                },
                {
                    title: "Jam Magang",
                    value: "320",
                    description: "Total jam kerja",
                    icon: Clock,
                    color: "bg-orange-500",
                },
                {
                    title: "Ranking",
                    value: "#12",
                    description: "Dari 50 peserta",
                    icon: Award,
                    color: "bg-purple-500",
                },
            ];
        }
    };

    const statsCards = getStatsCards();

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
                    {(isAdmin || isMentor) && (
                        <Card className="col-span-1">
                            <CardHeader>
                                <CardTitle>Distribusi Peserta Aktif</CardTitle>
                                <CardDescription>
                                    Data Peserta Magang berdasarkan divisi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="mt-4 space-y-2">
                                    {statusData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between text-sm"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            item.color,
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
                    <Card
                        className={
                            isAdmin || isMentor ? "col-span-1" : "col-span-2"
                        }
                    >
                        <CardHeader>
                            <CardTitle>
                                {isAdmin || isMentor
                                    ? "Tren Peserta & Penilaian"
                                    : "Perkembangan Nilai Anda"}
                            </CardTitle>
                            <CardDescription>
                                Data 6 bulan terakhir
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                {isPeserta ? (
                                    <LineChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="bulan" />
                                        <YAxis />
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
                                ) : (
                                    <BarChart data={performanceData}>
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
                                )}
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Table */}
                {(isAdmin || isMentor) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Penilaian Terbaru</CardTitle>
                            <CardDescription>
                                Hasil penilaian peserta magang terkini
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentScores.map((item, index) => (
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
                {isPeserta && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Kriteria Penilaian Anda</CardTitle>
                            <CardDescription>
                                Progress penilaian berdasarkan kriteria
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        name: "Kedisiplinan",
                                        score: 90,
                                        max: 100,
                                    },
                                    { name: "Kerjasama", score: 85, max: 100 },
                                    { name: "Inisiatif", score: 88, max: 100 },
                                    {
                                        name: "Kemampuan Teknis",
                                        score: 92,
                                        max: 100,
                                    },
                                    { name: "Komunikasi", score: 87, max: 100 },
                                ].map((criteria, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-medium">
                                                {criteria.name}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {criteria.score}/{criteria.max}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
