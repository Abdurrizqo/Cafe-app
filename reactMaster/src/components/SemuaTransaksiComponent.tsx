import { useEffect, useState } from "react";
import useReportStore from "../store/reportStore";
import axios from "axios";

interface OrderData {
  catatan: string;
  idOrder: string;
  isPaid: boolean;
  nomerAntrian: number;
  tanggalDatang: Date;
}
interface ResponseListTransaksi {
  data: {
    idRiwayatTransaksi: string;
    tanggalTransaksi: Date;
    nilaiTransaksi: number;
    keteranganTransaksi: string;
    jenisTansaksi: string;
    TotalKas: number;
    idOrder: OrderData;
  }[];
}

function SemuaTransaksiComponent() {
  const storeRangeDate = useReportStore((state) => state.rangeDate);
  const storeChangeDataTransaksi = useReportStore(
    (state) => state.changeDataTransaksi
  );
  const [listTransaksi, setListTransaksi] = useState<
    ResponseListTransaksi | undefined
  >(undefined);

  const handleDetailTransaksi = (idTransaksi: string) => {
    const data = listTransaksi?.data.find((element) => {
      return element.idRiwayatTransaksi === idTransaksi;
    });
    storeChangeDataTransaksi(data);
  };

  useEffect(() => {
    axios
      .post(`http://localhost:1010/riwayat-transaksi/list`, storeRangeDate)
      .then((response) => {
        setListTransaksi(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [storeRangeDate]);

  return (
    <div className="mb-20 overflow-auto h-[30rem] relative">
      <h1 className="text-center font-medium text-xl">Semua Transaksi</h1>
      <p className="mb-6 mt-4 text-center">
        {`${storeRangeDate.tanggalAwal.toLocaleString()} - ${storeRangeDate.tanggalAkhir.toLocaleString()}`}
      </p>

      {listTransaksi?.data.map((element) => {
        return (
          <div
            className="border-b border-gray-400 flex justify-between items-center gap-4 p-4"
            key={element.idRiwayatTransaksi}
          >
            <p>{new Date(element.tanggalTransaksi).toLocaleString()}</p>
            <p>Transaksi {element.jenisTansaksi}</p>
            <p>Rp{element.nilaiTransaksi}</p>
            <button
              className="rounded bg-button-color py-1 px-4 text-white"
              onClick={() => {
                handleDetailTransaksi(element.idRiwayatTransaksi);
              }}
            >
              Detail
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default SemuaTransaksiComponent;
