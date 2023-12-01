import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SemuaTransaksiComponent from "../components/SemuaTransaksiComponent";
import DetailTransaksi from "../components/DetailTransaksi";
import axios from "axios";
import useReportStore from "../store/reportStore";

interface MyBalanceResponse {
  data: {
    idRiwayatTransaksi: string;
    TotalKas: number;
  }[];
}

interface RangeDate {
  tanggalAwal: Date;
  tanggalAkhir: Date;
  jenisTransaksi?: string | undefined;
}

function ReportView() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectJenisTransaksi, setSelectJenisTransaksi] = useState<
    string | undefined
  >(undefined);

  const [myBalance, setMyBalance] = useState<MyBalanceResponse>();
  const storeChangeRangeDate = useReportStore((state) => state.editRangeDate);
  const storeRangeDate = useReportStore((state) => state.rangeDate);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(startDate);
    console.log(endDate);
    let postData: RangeDate;
    if (!selectJenisTransaksi || selectJenisTransaksi === "Semua") {
      postData = {
        tanggalAwal: startDate ? startDate : storeRangeDate.tanggalAwal,
        tanggalAkhir: endDate ? endDate : storeRangeDate.tanggalAkhir,
      };
    } else {
      postData = {
        tanggalAwal: startDate ? startDate : storeRangeDate.tanggalAwal,
        tanggalAkhir: endDate ? endDate : storeRangeDate.tanggalAkhir,
        jenisTransaksi: selectJenisTransaksi,
      };
    }

    storeChangeRangeDate(postData);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:1010/riwayat-transaksi`)
      .then((response) => {
        setMyBalance(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="pt-24 px-10 flex justify-between items-center mb-10">
        <form onSubmit={handleSubmit} className="flex gap-8 items-center">
          <DatePicker
            showIcon
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
            icon="fa fa-calendar"
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border p-2 rounded outline-none shadow"
          />

          <DatePicker
            showIcon
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
            icon="fa fa-calendar"
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="border p-2 rounded outline-none shadow"
          />

          <div className="flex gap-6 items-center ">
            <select
              className="py-1 px-4 border rounded shadow outline-none"
              value={selectJenisTransaksi}
              onChange={(e) => {
                setSelectJenisTransaksi(e.target.value);
              }}
            >
              <option>Semua</option>
              <option value="masuk">Masuk</option>
              <option value="Keluar">Keluar</option>
            </select>

            <input
              type="submit"
              value="Cari"
              className="rounded w-32 py-1 bg-button-color text-white shadow"
            />
          </div>
        </form>

        <div className="flex flex-col items-center p-3 border rounded bg-primary-color shadow gap-4">
          <div>My Balance</div>
          <h1 className="font-medium text-lg text-gray-800">
            Rp
            {myBalance
              ? new Intl.NumberFormat("id-ID").format(
                  myBalance.data[0].TotalKas
                )
              : 0}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 px-10">
        <SemuaTransaksiComponent />
        <DetailTransaksi />
      </div>
    </>
  );
}

export default ReportView;
