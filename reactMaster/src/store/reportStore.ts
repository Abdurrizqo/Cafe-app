import { create } from "zustand";

interface RangeDate {
    tanggalAwal: Date,
    tanggalAkhir: Date,
    jenisTransaksi?: string | undefined,
}

interface OrderData {
    catatan: string;
    idOrder: string;
    isPaid: boolean;
    nomerAntrian: number;
    tanggalDatang: Date;
}
interface ListTransaksi {
    idRiwayatTransaksi: string;
    tanggalTransaksi: Date;
    nilaiTransaksi: number;
    keteranganTransaksi: string;
    jenisTansaksi: string;
    TotalKas: number;
    idOrder: OrderData;
}

const today = new Date();
today.setHours(23, 59, 59, 999)

const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(today.getDate() - 3);

interface ReportStore {
    rangeDate: RangeDate;
    editRangeDate: (by: RangeDate) => void;
    dataTransaksi: ListTransaksi | undefined
    changeDataTransaksi: (by: ListTransaksi | undefined) => void
}

const defaultRange: RangeDate = {
    tanggalAwal: threeDaysAgo,
    tanggalAkhir: today,
}

const useReportStore = create<ReportStore>()((set) => ({
    rangeDate: defaultRange,
    editRangeDate: (by) => set(() => ({ rangeDate: by })),
    dataTransaksi: undefined,
    changeDataTransaksi: (by) => set(() => ({ dataTransaksi: by }))
}))

export default useReportStore