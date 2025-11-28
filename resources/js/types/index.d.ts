export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    // Shorthand properties untuk kemudahan akses
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles: string[];
    permissions: string[];
    status: "pending" | "approved" | "rejected";
    approved_at?: string;
    approved_by?: number;
    created_at: string;
    updated_at: string;
    // Tambahan untuk data registrasi
    student_id?: string;
    campus?: string;
    division?: string;
    phone?: number;
    job_role?: string;
    employee_id?: string;
    position?: string;
    department?: string;
}

// Tambahkan interface baru untuk model-model SPK
export interface PesertaMagang {
    id: number;
    user_id: number;
    student_id: string;
    campus: string;
    division: string;
    phone?: string;
    start_date: string;
    end_date: string;
    mentor_id?: number;
    status_magang: "aktif" | "selesai" | "berhenti";
    created_at: string;
    updated_at: string;
    user?: User;
    mentor?: Mentor;
}

export interface Mentor {
    id: number;
    user_id: number;
    name: string;
    employee_id: string;
    position: string;
    department: string;
    phone?: string;
    created_at: string;
    updated_at: string;
    user?: User;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
};

export interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

export interface Mahasiswa {
    id: number;
    nim: string;
    nama: string;
    jurusan: string;
    universitas: string;
    periode_mulai: string;
    periode_selesai: string;
    pembimbing_id: number;
    created_at: string;
    updated_at: string;
}

export interface Kriteria {
    id: number;
    kode: string;
    nama: string;
    deskripsi: string;
    bobot: number;
    jenis: "benefit" | "cost";
    created_at: string;
    updated_at: string;
}

export interface Penilaian {
    id: number;
    peserta_magang_id: number;
    kriteria_id: number;
    nilai: number;
    catatan?: string;
    penilai_id: number;
    periode_penilaian: string;
    created_at: string;
    updated_at: string;
    peserta_magang?: PesertaMagang;
    kriteria?: Kriteria;
    penilai?: User;
}

export interface HasilSaw {
    id: number;
    peserta_magang_id: number;
    periode_penilaian: string;
    skor_akhir: number;
    ranking: number;
    detail_normalisasi: Record<
        number,
        {
            kode_kriteria: string;
            nama_kriteria: string;
            nilai_asli: number;
            nilai_normalisasi: number;
            bobot: number;
            nilai_preferensi: number;
        }
    >;
    created_at: string;
    updated_at: string;
    peserta_magang?: PesertaMagang;
}
