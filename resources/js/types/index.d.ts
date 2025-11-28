export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    roles: string[];
    permissions: string[];
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
    bobot: number;
    jenis: "benefit" | "cost";
    created_at: string;
    updated_at: string;
}

export interface Penilaian {
    id: number;
    mahasiswa_id: number;
    kriteria_id: number;
    nilai: number;
    catatan?: string;
    penilai_id: number;
    created_at: string;
    updated_at: string;
    mahasiswa?: Mahasiswa;
    kriteria?: Kriteria;
}
