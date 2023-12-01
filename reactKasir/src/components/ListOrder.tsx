import axios from "axios";
import { useEffect, useState } from "react";
import useOrderStore from "../store/OrderStore";
import { TiDelete } from "react-icons/ti";

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

interface JsonResponseAllOrder {
  data: Order[];
}

function ListOrder() {
  const selectedOrder = useOrderStore((state) => state.selectOrderToEdit);
  const selectedBayar = useOrderStore((state) => state.selectOrderToBayar);
  const reloadState = useOrderStore((state) => state.reloadList);
  const resetList = useOrderStore((state) => state.changeReloadList);
  const bayar = useOrderStore((state) => state.changeStateBayar);

  const [allOrder, setAllOrder] = useState<JsonResponseAllOrder | undefined>(
    undefined
  );

  const editOrder = (order: Order) => {
    selectedOrder(order);
  };

  const deleteOrder = (idOrder: string) => {
    axios
      .delete(`http://localhost:1010/order/${idOrder}`)
      .then(() => {
        resetList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const filterDate = {
      todayStart: new Date(new Date().setHours(0, 0, 0, 0)),
      todayEnd: new Date(new Date().setHours(23, 59, 59, 999)),
      isPaid: false,
    };
    axios
      .post(`http://localhost:1010/order/all-order`, filterDate)
      .then(function (response) {
        setAllOrder(response.data);
        resetList;
      })
      .catch(function (error) {
        console.log(error);
        resetList;
      });
  }, [reloadState]);

  return (
    <div className="h-screen overflow-auto p-8">
      {allOrder?.data.map((element) => {
        return (
          <div className="mb-6" key={element.idOrder}>
            <div className="border rounded shadow bg-white p-4 relative">
              <TiDelete
                className="text-3xl text-red-400 absolute -top-3 -right-3 cursor-pointer"
                onClick={() => {
                  deleteOrder(element.idOrder);
                }}
              />
              <div className="flex justify-between items-center">
                <h1 className="font-medium text-xl">{element.nomerAntrian}</h1>
                <p className="font-light text-gray-600">
                  {new Date(element.tanggalDatang).toLocaleString()}
                </p>
              </div>
              {element.orderToMenu.map((menu) => {
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
                <p>{element.catatan}</p>
              </div>

              <div className="flex justify-end items-center gap-4 mt-8">
                <button
                  className="rounded text-white bg-blue-400 px-3 py-2 w-24 cursor-pointer"
                  onClick={() => {
                    editOrder(element);
                  }}
                >
                  Edit
                </button>
                <button
                  className="rounded text-white bg-green-400 px-3 py-2 w-24 cursor-pointer"
                  onClick={() => {
                    bayar();
                    selectedBayar(element);
                  }}
                >
                  Bayar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ListOrder;
