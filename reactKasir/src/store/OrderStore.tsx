import { create } from "zustand";

interface Menu {
  idMenu: string;
  menuName: string;
  harga: number;
  stokHarian: number;
  defaultStokHarian: number;
  isDefaultStokActive: boolean;
  menuImage: string;
}

interface OrderToMenu {
  idOrderToMenu: string;
  jumlahPesanan: number;
  menu: Menu;
}

interface Meja {
  idMeja: string;
  namaMeja: string;
}

interface Order {
  idOrder: string;
  nomerAntrian: number;
  tanggalDatang: string;
  catatan: string;
  isPaid: boolean;
  meja: Meja;
  orderToMenu: OrderToMenu[];
}

interface OrderStore {
  order: Order | undefined;
  selectOrderToEdit: (by: Order | undefined) => void;
  reloadList: boolean;
  changeReloadList: () => void;
  stateBayar: boolean;
  changeStateBayar: () => void;
  selectedBayar: Order | undefined;
  selectOrderToBayar: (by: Order | undefined) => void;
}

const useOrderStore = create<OrderStore>()((set) => ({
  order: undefined,
  selectOrderToEdit: (by) => set(() => ({ order: by })),
  reloadList: false,
  changeReloadList: () => set((state) => ({ reloadList: !state.reloadList })),
  stateBayar: false,
  changeStateBayar: () => set((state) => ({ stateBayar: !state.stateBayar })),
  selectedBayar: undefined,
  selectOrderToBayar: (by) => set(() => ({ selectedBayar: by })),
}));

export default useOrderStore;
