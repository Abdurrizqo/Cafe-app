import axios from "axios";
import useOrderStore from "../store/OrderStore";
import { useEffect, useState } from "react";

function BayarModal() {
  const bayarOrder = useOrderStore((state) => state.selectedBayar);
  const changeStateBayar = useOrderStore((state) => state.changeStateBayar);
  const resetList = useOrderStore((state) => state.changeReloadList);
  const [totalHarga, setTotalHarga] = useState<number>(0);
  const [uangDiTerima, setUangDiTerima] = useState<number>();
  const [hasilAkhir, setHasilAkhir] = useState<number>(0);

  const handleUangMasuk = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUangDiTerima(parseInt(e.target.value));
    setHasilAkhir((totalHarga - parseInt(e.target.value)) * -1);
  };

  const handleBayar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .patch(`http://localhost:1010/order/${bayarOrder?.idOrder}/bayar-order`, {
        jumlahBayar: uangDiTerima,
      })
      .then(function (response) {
        resetList();
        changeStateBayar();
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

  const cancelBayar = () => {
    changeStateBayar();
  };

  useEffect(() => {
    if (bayarOrder) {
      setTotalHarga(Total(bayarOrder?.orderToMenu));
    }
  }, [bayarOrder]);

  return (
    <>
      <div className="absolute left-0 right-0 top-0 bottom-0 bg-black opacity-40 z-40"></div>
      <div className="absolute w-full flex justify-center mt-10 z-50">
        <div className="bg-white rounded border p-4 w-1/3">
          <h1 className="text-xl font-medium text-center mb-10">Pembayaran</h1>
          <div className="flex justify-between items-center border-b-2 pb-3 border-gray-800">
            <p>{bayarOrder?.meja.namaMeja}</p>
            <p className="text-gray-500">{bayarOrder?.tanggalDatang}</p>
          </div>

          <div className="h-60 overflow-auto rounded my-5">
            {bayarOrder?.orderToMenu.map((element) => {
              return (
                <div
                  className="grid grid-cols-5 shadow p-3 border rounded col-span-4 mt-4 mb-3"
                  key={element.idOrderToMenu}
                >
                  <p className="text-lg col-span-3">{element.menu.menuName}</p>
                  <p className="text-gray-500 text-center">
                    Rp{element.menu.harga}
                  </p>
                  <p className="text-gray-500 text-center">
                    x{element.jumlahPesanan}
                  </p>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={(e) => {
              handleBayar(e);
            }}
          >
            <div className="border-t-2 border-gray-800">
              <div className="text-xl mt-3 flex justify-between">
                <p>Total</p>
                <p>Rp{new Intl.NumberFormat("id-ID").format(totalHarga)}</p>
              </div>

              <div className="flex justify-between mt-3 items-center">
                <p>Jumlah Bayar</p>
                <input
                  type="number"
                  value={uangDiTerima ? uangDiTerima : ""}
                  onChange={handleUangMasuk}
                  className="w-20 border-b-2 border-gray-800 p-1 text-center outline-none"
                />
              </div>

              <div className="flex justify-end mt-3">
                <p className="text-center block w-20">
                  {new Intl.NumberFormat("id-ID").format(hasilAkhir)}
                </p>
              </div>

              <div className="flex justify-center items-center gap-10 mt-10">
                <button
                  className="rounded bg-red-400 text-white w-full py-2 cursor-pointer"
                  onClick={cancelBayar}
                >
                  Cancel
                </button>

                <input
                  type="submit"
                  value="Bayar"
                  className="rounded bg-blue-400 text-white w-full py-2 cursor-pointer"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

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

const Total = (dataOrder: OrderToMenu[]) => {
  let totalHarga: number = 0;

  for (let i = 0; i < dataOrder.length; i++) {
    totalHarga += dataOrder[i].jumlahPesanan * dataOrder[i].menu.harga;
  }

  return totalHarga;
};

export default BayarModal;
