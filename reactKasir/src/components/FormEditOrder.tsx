import { SubmitHandler, useForm } from "react-hook-form";
import useOrderStore from "../store/OrderStore";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import debounce from "lodash.debounce";

interface ResponseMeja {
  currentPage: number;
  data: {
    idMeja: string;
    namaMeja: string;
  }[];
  limit: number;
  totalElement: number;
  totalPage: number;
}

interface DataMenu {
  menuName: string;
  harga: number;
  stokHarian: number;
  defaultStokHarian: number;
  menuImage: string;
  idMenu: string;
  isDefaultStokActive: boolean;
  jumlahPesanan?: number;
}

interface ResponseMenu {
  currentPage: number;
  data: DataMenu[];
  limit: number;
  totalElement: number;
  totalPage: number;
}

interface CreateOrder {
  idOrder: string;
  meja: string;
  catatan: string;
  listMenu: {
    menuId: string;
    jumlahPesanan: number;
  }[];
}

function FormEditOrder() {
  const [allMeja, setAllMeja] = useState<ResponseMeja | undefined>();
  const [findMenu, setFindMenu] = useState<ResponseMenu | undefined>();
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<DataMenu[] | []>([]);
  const selectedOrder = useOrderStore((state) => state.order);
  const resetSelectedOrder = useOrderStore((state) => state.selectOrderToEdit);
  const resetList = useOrderStore((state) => state.changeReloadList);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOrder>();

  const debounceSearch = useCallback(
    debounce((query: string) => {
      axios
        .get(`http://localhost:1010/menu?page=1&limit=100&seacrhMenu=${query}`)
        .then(function (response) {
          setFindMenu(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }, 500),
    []
  );

  const getMenuData = (menu: DataMenu) => {
    reset();
    const filterSelectedMenu: DataMenu | undefined = selectedMenu.find(
      (element) => {
        return element.idMenu === menu.idMenu;
      }
    );

    if (!filterSelectedMenu) {
      setSelectedMenu([...selectedMenu, menu]);
    }
  };

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceSearch(event.target.value);
  };

  const deleteSelectedMenu = (menuId: string) => {
    setSelectedMenu(
      selectedMenu.filter((element) => {
        return element.idMenu !== menuId;
      })
    );
  };

  const onSubmit: SubmitHandler<CreateOrder> = (data) => {
    data.idOrder = selectedOrder ? selectedOrder?.idOrder : "";
    axios
      .patch(
        `http://localhost:1010/order/${selectedOrder?.idOrder}/edit-order`,
        data
      )
      .then(function (response) {
        console.log(response);
        reset();
        resetList();
        setSelectedMenu([])
        resetSelectedOrder(undefined)
      })
      .catch(function (error) {
        console.log(error.response.data);
        reset();
        resetList();
      });
  };

  const cancelEdit = () => {
    reset();
    resetSelectedOrder(undefined);
  };

  useEffect(() => {
    axios
      .get("http://localhost:1010/meja")
      .then(function (response) {
        setAllMeja(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const menus = selectedOrder?.orderToMenu.map((element) => {
        return { ...element.menu, jumlahPesanan: element.jumlahPesanan };
      });
      setSelectedMenu(menus);
    }
  }, [selectedOrder]);

  return (
    <>
      <div className="p-8 h-screen overflow-auto">
        <h1 className="text-center font-medium font-nunito text-2xl">
          Edit Order
        </h1>
        <div className="flex justify-between items-center mt-8 border-b-2 border-gray-300 pb-2">
          <h3 className="font-medium">
            Nomer Antrian: {selectedOrder?.nomerAntrian}
          </h3>
          <p className="text-gray-800 font-light">
            {selectedOrder &&
              new Date(selectedOrder?.tanggalDatang).toLocaleString()}
          </p>
        </div>

        <form className="w-full my-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-10">
            <div className="w-full col-span-2 relative">
              <input
                type="text"
                placeholder="Cari Menu..."
                onChange={(e) => search(e)}
                onFocus={() => {
                  setIsSearchOpen(!isSearchOpen);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setIsSearchOpen(!isSearchOpen);
                  }, 100);
                }}
                className="rounded-full w-full border px-4 py-1 outline-none text-lg relative z-20 border-gray-300"
              />

              {isSearchOpen && findMenu && (
                <div className="absolute left-0 right-0 shadow border rounded px-4 py-5 pt-10 top-3 mx-1 z-10 bg-white">
                  {findMenu?.data.map((element) => {
                    return (
                      <div
                        key={element.idMenu}
                        onClick={() => {
                          getMenuData(element);
                        }}
                        className="p-3 flex justify-between border-b-2 mb-4 bg-white hover:bg-blue-50 cursor-pointer rounded"
                      >
                        <p>{element.menuName}</p>
                        <p>Rp{element.harga}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <select
              className="w-full py-1 px-2 border rounded outline-none drop-shadow"
              {...register("meja")}
            >
              <option value={selectedOrder?.meja.idMeja}>
                {selectedOrder?.meja.namaMeja}
              </option>
              {allMeja?.data.map((element) => {
                return (
                  <option value={element.idMeja} key={element.idMeja}>
                    {element.namaMeja}
                  </option>
                );
              })}
            </select>
          </div>

          {selectedMenu.map((element, index) => {
            return (
              <div className="mt-8 grid grid-cols-5 gap-8" key={element.idMenu}>
                <div className="grid grid-cols-5 shadow p-3 border rounded col-span-4">
                  <p className="text-lg col-span-4">{element.menuName}</p>
                  <p className="text-gray-500 font-semibold">{element.harga}</p>
                </div>

                <div className="flex justify-center items-center gap-3">
                  <input
                    type="hidden"
                    value={element.idMenu}
                    {...register(`listMenu.${index}.menuId` as const)}
                  />
                  <input
                    type="number"
                    placeholder="Jumlah"
                    className="rounded border p-3 shadow outline-none block w-20"
                    {...register(`listMenu.${index}.jumlahPesanan` as const, {
                      value: element.jumlahPesanan,
                    })}
                  />

                  <div>
                    <MdDelete
                      className="text-3xl text-red-500 cursor-pointer"
                      onClick={() => deleteSelectedMenu(element.idMenu)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {selectedMenu.length > 0 && (
            <>
              <textarea
                className="w-full rounded shadow bg-white border p-3 mt-4 h-40 outline-none"
                placeholder="Tambahkan Catatan Dari Customer"
                {...register("catatan", { value: selectedOrder?.catatan })}
              ></textarea>

              <div className="flex justify-end items-center gap-5">
                <button
                  className="w-full rounded text-white mt-6 py-2 cursor-pointer bg-red-400"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>

                <input
                  type="submit"
                  className="w-full rounded text-white mt-6 py-2 cursor-pointer bg-blue-400"
                  value="Edit"
                />
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}

export default FormEditOrder;
