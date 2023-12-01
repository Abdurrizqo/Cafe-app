import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";

export enum JenisTransaksi {
  MASUK = "masuk",
  KELUAR = "keluar",
}

interface CreateTransaksi {
  nilaiTransaksi: number;
  jenisTransaksi: JenisTransaksi;
  KeteranganTransaksi: string;
}

function TransaksiView() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransaksi>();

  const onSubmit: SubmitHandler<CreateTransaksi> = (data) => {
    axios
      .post("http://localhost:1010/riwayat-transaksi", data)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
    console.log(data);
    reset();
  };

  return (
    <div className="pt-32 flex justify-center">
      <form
        className="w-[30rem] p-6 rounded border shadow bg-primary-color"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-medium text-xl mb-10">
          Transaksi Keluar/Masuk
        </h1>
        <div className="flex justify-between gap-4 items-center">
          <input
            type="number"
            placeholder="Jumlah Transaksi"
            {...register("nilaiTransaksi")}
            className="py-1 px-3 rounded-full border-2 outline-none grow mr-10"
          />

          <div>
            <select
              className="rounded py-1 px-3 border-2 outline-none"
              {...register("jenisTransaksi")}
            >
              <option>Jenis Transaksi</option>
              <option value={JenisTransaksi.MASUK}>Transaksi Masuk</option>
              <option value={JenisTransaksi.KELUAR}>Transaksi Keluar</option>
            </select>
          </div>
        </div>

        <textarea
          className="rounded border-2 outline-none p-4 mt-8 w-full h-24"
          {...register("KeteranganTransaksi")}
        ></textarea>

        <input
          type="submit"
          className="py-1 w-full bg-button-color text-white rounded text-center mt-10 cursor-pointer"
          value="Simpan"
        />
      </form>
    </div>
  );
}

export default TransaksiView;
