import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
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
    Briefcase,
    Phone,
} from "lucide-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        phone: "",
        role: "peserta_magang",
        // Fields for peserta_magang
        student_id: "",
        campus: "",
        division: "",
        // Fields for mentor
        employee_id: "",
        position: "",
        department: "",
    });

    const [selectedRole, setSelectedRole] = useState("peserta_magang");

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const handleRoleChange = (value: string) => {
        setSelectedRole(value);
        setData("role", value);
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="w-full max-w-2xl mx-auto">
                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Daftar Akun Baru
                        </CardTitle>
                        <CardDescription className="text-center">
                            Lengkapi form di bawah untuk mendaftar. Akun akan
                            diverifikasi oleh admin.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Role Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    Daftar Sebagai{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={data.role}
                                    onValueChange={handleRoleChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="peserta_magang">
                                            Peserta Magang
                                        </SelectItem>
                                        <SelectItem value="mentor">
                                            Mentor
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">
                                        Informasi Akun
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
                                            setData("password", e.target.value)
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

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-muted-foreground">
                                        Informasi{" "}
                                        {selectedRole === "peserta_magang"
                                            ? "Peserta Magang"
                                            : "Mentor"}
                                    </span>
                                </div>
                            </div>

                            {/* Conditional Fields for Peserta Magang */}
                            {selectedRole === "peserta_magang" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                No. Telepon{" "}
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={data.phone}
                                                    className="pl-10"
                                                    placeholder="08xxxxxxxxxx"
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <InputError
                                                message={errors.phone}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

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

                                    <div className="space-y-2">
                                        <Label htmlFor="division">
                                            Divisi yang Diminati{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.division}
                                            onValueChange={(value) =>
                                                setData("division", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih divisi" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IT">
                                                    IT / Technology
                                                </SelectItem>
                                                <SelectItem value="Marketing">
                                                    Marketing
                                                </SelectItem>
                                                <SelectItem value="Finance">
                                                    Finance
                                                </SelectItem>
                                                <SelectItem value="HR">
                                                    Human Resources
                                                </SelectItem>
                                                <SelectItem value="Operations">
                                                    Operations
                                                </SelectItem>
                                                <SelectItem value="Design">
                                                    Design
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.division}
                                            className="mt-2"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Conditional Fields for Mentor */}
                            {selectedRole === "mentor" && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="employee_id">
                                                ID Karyawan{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="employee_id"
                                                name="employee_id"
                                                value={data.employee_id}
                                                placeholder="Contoh: EMP001"
                                                onChange={(e) =>
                                                    setData(
                                                        "employee_id",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                            <InputError
                                                message={errors.employee_id}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                No. Telepon{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="phone"
                                                    name="phone"
                                                    value={data.phone}
                                                    type="number"
                                                    className="pl-10"
                                                    placeholder="08xxxxxxxxxx"
                                                    onChange={(e) =>
                                                        setData(
                                                            "phone",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <InputError
                                                message={errors.phone}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="position">
                                            Jabatan{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="position"
                                                name="position"
                                                value={data.position}
                                                className="pl-10"
                                                placeholder="Contoh: Senior Developer"
                                                onChange={(e) =>
                                                    setData(
                                                        "position",
                                                        e.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                        <InputError
                                            message={errors.position}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="department">
                                            Departemen{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.department}
                                            onValueChange={(value) =>
                                                setData("department", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih departemen" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IT">
                                                    IT / Technology
                                                </SelectItem>
                                                <SelectItem value="Marketing">
                                                    Marketing
                                                </SelectItem>
                                                <SelectItem value="Finance">
                                                    Finance
                                                </SelectItem>
                                                <SelectItem value="HR">
                                                    Human Resources
                                                </SelectItem>
                                                <SelectItem value="Operations">
                                                    Operations
                                                </SelectItem>
                                                <SelectItem value="Design">
                                                    Design
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={errors.department}
                                            className="mt-2"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Submit Button */}
                            <div className="space-y-4 pt-4">
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
