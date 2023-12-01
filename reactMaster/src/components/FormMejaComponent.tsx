import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface DataInput {
  namaMeja: string;
}

interface ResponseError {
  message: string;
  code: number;
}

interface FormMejaProps {
  changeList: () => void;
}

function FormMejaComponent({ changeList }: FormMejaProps) {
  const [errorResponse, setErrorResponse] = useState<ResponseError>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataInput>();

  const onSubmit: SubmitHandler<DataInput> = (data) => {
    setErrorResponse(undefined);
    axios
      .post("http://localhost:1010/meja", data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error.response.data);
        setErrorResponse(error.response.data);
      });

    changeList();
  };

  return (
    <>
      <div className="bg-tertiary-color px-5 pt-32 h-screen">
        <h1 className="text-center font-medium text-lg font-roboto">
          Form Tambah Meja Baru
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex gap-4 mt-10 justify-center items-center"
        >
          <input
            type="text"
            className="py-2 px-2 border-gray-300 border rounded grow outline-none"
            placeholder="Nama Meja"
            {...register("namaMeja", { required: true, maxLength: 60 })}
          />

          <input
            type="submit"
            className="px-8 py-2 rounded-full bg-button-color cursor-pointer text-white"
          />
        </form>
        {errors.namaMeja && (
          <div className="mt-2 text-red-400 font-light">*wajib diisi</div>
        )}
        {errorResponse?.message.includes("Duplicate entry") ? (
          <div className="mt-2 text-red-400 font-light">
            *Duplikat nama meja
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default FormMejaComponent;
