import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    UserCircle,
    Mail,
    Lock,
    Building,
    Phone,
    GraduationCap,
} from "lucide-react";

interface Division {
    id: number;
    name: string;
    code: string;
    description?: string;
}

interface Props {
    divisions: Division[];
}

export default function Register({ divisions }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        student_id: "",
        campus: "",
        division_id: "",
        start_date: "",
        end_date: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrasi Peserta Magang" />

            <div className="w-full max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="space-y-1">
                        <div className="flex justify-center mb-4">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <GraduationCap className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Registrasi Peserta Magang
                        </CardTitle>
                        <CardDescription className="text-center">
                            Akun akan diverifikasi oleh admin sebelum dapat
                            digunakan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-5">
                            {/* Data Pribadi Section */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground font-medium">
                                            Data Pribadi
                                        </span>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nama Lengkap{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <UserCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="pl-10"
                                            placeholder="Masukkan nama lengkap"
                                            autoComplete="name"
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="pl-10"
                                            placeholder="nama@email.com"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label htmlFor="phone">No. Telepon</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={data.phone}
                                            className="pl-10"
                                            placeholder="08xxxxxxxxxx"
                                            onChange={(e) =>
                                                setData("phone", e.target.value)
                                            }
                                        />
                                    </div>
                                    <InputError
                                        message={errors.phone}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">
                                        Password{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="pl-10"
                                            placeholder="Minimal 8 karakter"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Konfirmasi Password{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="pl-10"
                                            placeholder="Ulangi password"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* Data Akademik Section */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground font-medium">
                                            Data Akademik
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Student ID */}
                                    <div className="space-y-2">
                                        <Label htmlFor="student_id">
                                            NIM/Student ID{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="student_id"
                                            name="student_id"
                                            value={data.student_id}
                                            placeholder="Contoh: 123456789"
                                            onChange={(e) =>
                                                setData(
                                                    "student_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.student_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Campus */}
                                    <div className="space-y-2">
                                        <Label htmlFor="campus">
                                            Kampus/Universitas{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="campus"
                                                name="campus"
                                                value={data.campus}
                                                className="pl-10"
                                                placeholder="Contoh: Universitas Indonesia"
                                                onChange={(e) =>
                                                    setData(
                                                        "campus",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <InputError
                                            message={errors.campus}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Data Magang Section */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-muted-foreground font-medium">
                                            Informasi Magang
                                        </span>
                                    </div>
                                </div>

                                {/* Division */}
                                <div className="space-y-2">
                                    <Label htmlFor="division_id">
                                        Divisi yang Diminati{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.division_id}
                                        onValueChange={(value) =>
                                            setData("division_id", value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih divisi untuk magang" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {divisions.map((division) => (
                                                <SelectItem
                                                    key={division.id}
                                                    value={division.id.toString()}
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">
                                                            {division.name}
                                                        </span>
                                                        {division.description && (
                                                            <span className="text-xs text-gray-500">
                                                                {
                                                                    division.description
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError
                                        message={errors.division_id}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">
                                            Tanggal Mulai Magang{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="start_date"
                                            name="start_date"
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    "start_date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.start_date}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">
                                            Tanggal Selesai Magang{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="end_date"
                                            name="end_date"
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    "end_date",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.end_date}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="space-y-4 pt-2">
                                <PrimaryButton
                                    className="w-full justify-center"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Memproses..."
                                        : "Daftar Sekarang"}
                                </PrimaryButton>

                                <div className="text-center text-sm">
                                    <span className="text-gray-600">
                                        Sudah punya akun?{" "}
                                    </span>
                                    <Link
                                        href={route("login")}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Masuk di sini
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
