import axios from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface ResponseError {
  message: string;
  code: number;
}

interface DataMenu {
  menuName: string;
  harga: number;
  stokHarian: number;
  defaultStokHarian: number;
  menuImage: string | FileList;
  idMenu?: string;
  isDefaultStokActive: boolean;
}

interface FormMejaProps {
  changeList: () => void;
  dataMenu?: DataMenu | undefined;
  removeDataMenu: () => void;
}

function FormMenuComponent({
  changeList,
  dataMenu,
  removeDataMenu,
}: FormMejaProps) {
  const [errorResponse, setErrorResponse] = useState<ResponseError>();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DataMenu>();

  const onSubmit: SubmitHandler<DataMenu> = (data) => {
    console.log(data);
    setErrorResponse(undefined);
    const formData = new FormData();

    formData.append("defaultStokHarian", data.defaultStokHarian.toString());
    formData.append("harga", data.harga.toString());
    formData.append("menuName", data.menuName);
    formData.append("stokHarian", data.stokHarian.toString());

    formData.append("menuImage", data.menuImage[0]);
    formData.append("isDefaultStokActive", data.isDefaultStokActive.toString());

    if (dataMenu) {
      axios
        .patch(`http://localhost:1010/menu/${dataMenu.idMenu}`, formData)
        .then(function (response) {
          console.log(response);
          reset();
        })
        .catch(function (error) {
          console.log(error.response.data);
          reset();
          setErrorResponse(error.response.data);
        });
    } else {
      axios
        .post("http://localhost:1010/menu", formData)
        .then(function (response) {
          console.log(response);
          reset();
          changeList();
        })
        .catch(function (error) {
          console.log(error.response.data);
          reset();
          setErrorResponse(error.response.data);
        });
    }
  };

  const removeDataEditMenu = () => {
    reset();
    removeDataMenu();
  };

  useEffect(() => {
    if (dataMenu) {
      setValue("menuName", dataMenu.menuName);
      setValue("harga", dataMenu.harga);
      setValue("stokHarian", dataMenu.stokHarian);
      setValue("defaultStokHarian", dataMenu.defaultStokHarian);
      setValue("isDefaultStokActive", dataMenu.isDefaultStokActive);
    }
  }, [dataMenu]);

  return (
    <>
      <div className="bg-tertiary-color px-5 pt-32 h-screen">
        <h1 className="text-center font-medium text-lg font-roboto">
          Form Tambah Menu Baru
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-10 justify-center"
        >
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text"
              className="py-1 px-2 border-gray-300 col-span-2 border rounded outline-none"
              placeholder="Nama Menu"
              {...register("menuName", { required: true, maxLength: 100 })}
            />

            <input
              type="number"
              className="py-1 px-2 border-gray-300 border rounded outline-none"
              placeholder="Harga"
              {...register("harga", { required: true })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="py-1 px-2 border-gray-300 border rounded outline-none"
              placeholder="Stok Harian"
              {...register("stokHarian", { required: true })}
            />
            <input
              type="number"
              className="py-1 px-2 border-gray-300 border rounded outline-none"
              placeholder="Default Stok"
              {...register("defaultStokHarian", { required: true })}
            />
          </div>

          <div className="flex gap-2 items-center">
            <input type="checkbox" {...register("isDefaultStokActive")} />
            <label>Aktifkan Reset Harian</label>
          </div>

          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            {...register("menuImage")}
            className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-color file:text-button-color hover:file:bg-gray-100 file:shadow file:my-3"
          />

          {!dataMenu ? (
            <input
              type="submit"
              className="px-8 py-2 rounded-full bg-button-color cursor-pointer text-white"
            />
          ) : (
            <div className="flex gap-8 items-center justify-end">
              <input
                type="submit"
                value="edit"
                className="px-8 py-1 border border-button-color rounded-full bg-button-color cursor-pointer text-white"
              />
              <button
                onClick={removeDataEditMenu}
                className="px-4 py-1 rounded-full border-button-color border cursor-pointer text-button-color"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default FormMenuComponent;
