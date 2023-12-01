import axios from "axios";
import useReportStore from "../store/reportStore";
import { useEffect, useState } from "react";

interface DataMeja {
  idMeja: string;
  namaMeja: string;
}

interface DataMenu {
  idMenu: string;
  menuName: string;
  harga: number;
  stokHarian: number;
  defaultStokHarian: number;
  isDefaultStokActive: boolean;
  menuImage: string;
}

interface DataOrderToMenu {
  idOrderToMenu: string;
  jumlahPesanan: string;
  menu: DataMenu;
}

interface DataOrder {
  data: {
    idOrder: string;
    nomerAntrian: number;
    tanggalDatang: Date;
    catatan: string;
    isPaid: boolean;
    meja: DataMeja;
    orderToMenu: DataOrderToMenu[];
  };
}

function DetailTransaksi() {
  const storeDataTransaksi = useReportStore((state) => state.dataTransaksi);
  const [detailOrder, setDetailOrder] = useState<DataOrder | undefined>(
    undefined
  );

  useEffect(() => {
    if (storeDataTransaksi?.idOrder) {
      axios
        .get(
          `http://localhost:1010/order/${storeDataTransaksi.idOrder.idOrder}`
        )
        .then((response) => {
          setDetailOrder(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      setDetailOrder(undefined);
    }
  }, [storeDataTransaksi]);

  return (
    <div>
      <h1 className="mb-6 text-center font-medium text-xl">Detail Transaksi</h1>

      {detailOrder ? (
        <div className="mb-6">
          <div className="border rounded shadow bg-white p-4">
            <div className="flex justify-between items-center">
              <h1 className="font-medium text-xl">
                {detailOrder.data.nomerAntrian}
              </h1>
              <p className="font-light text-gray-600">
                {new Date(detailOrder.data.tanggalDatang).toLocaleString()}
              </p>
            </div>
            {detailOrder.data.orderToMenu.map((menu) => {
              return (
                <div
                  className="grid grid-cols-5 shadow p-3 border rounded col-span-4 mt-4 mb-3"
                  key={menu.idOrderToMenu}
                >
                  <p className="text-lg col-span-3">{menu.menu.menuName}</p>
                  <p className="text-gray-500 text-center">
                    Rp{menu.menu.harga}
                  </p>
                  <p className="text-gray-500 text-center">
                    x{menu.jumlahPesanan}
                  </p>
                </div>
              );
            })}

            <h3 className="font-medium text-lg mt-10">Catatan :</h3>
            <div className="p-2 bg-white text-gray-500 border rounded">
              <p>{detailOrder.data.catatan}</p>
            </div>
          </div>
        </div>
      ) : storeDataTransaksi?.keteranganTransaksi ? (
        <div className="border rounded shadow bg-white p-4">
          {storeDataTransaksi.keteranganTransaksi}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default DetailTransaksi;
