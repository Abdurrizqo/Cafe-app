import axios from "axios";
import { TiDelete } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";

interface ResponseMenu {
  currentPage: number;
  data: {
    menuName: string;
    harga: number;
    stokHarian: number;
    defaultStokHarian: number;
    menuImage: string;
    idMenu: string;
    isDefaultStokActive: boolean;
  }[];
  limit: number;
  totalElement: number;
  totalPage: number;
}

interface PropsListMenu {
  responseMenu: ResponseMenu | undefined;
  changeList: (querySearch?: string) => void;
  editList:(idMenu:string) => void
}

function ListMenuComponent({ responseMenu, changeList, editList }: PropsListMenu) {
  const [cari, setCari] = useState<string>("");

  const removeElement = (idElement: string) => {
    axios
      .delete(`http://localhost:1010/menu/${idElement}`)
      .then(() => {
        changeList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editElement = (idElement: string) => {
    editList(idElement)
  };

  const debounceSearch = useCallback(
    debounce((query: string) => {
      changeList(query);
    }, 800),
    []
  );

  const search = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCari(event.target.value);
    debounceSearch(event.target.value);
  };

  return (
    <>
      <div className="w-full h-screen pt-32 pb-20 col-span-3 overflow-auto">
        <div>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              search(e);
            }}
            type="text"
            value={cari}
            placeholder="Cari Menu"
            className="px-4 py-2 rounded-full w-80 bg-white shadow border outline-none mb-5 border-gray-400"
          />
        </div>
        <div className="flex flex-col gap-6">
          {responseMenu?.data.map((element) => {
            return (
              <div
                className="grid grid-cols-6 gap-3 relative items-center bg-primary-color mx-4 rounded shadow border-2 p-3"
                key={element.idMenu}
              >
                <div className="absolute -top-1 right-0 flex gap-2 items-center">
                  <FaEdit
                    className="text-green-600 text-xl cursor-pointer"
                    onClick={() => {
                      editElement(element.idMenu);
                    }}
                  />

                  <TiDelete
                    className="text-red-600 text-2xl cursor-pointer"
                    onClick={() => {
                      removeElement(element.idMenu);
                    }}
                  />
                </div>

                <img
                  className="w-20 h-20"
                  src={`http://localhost:1010/menu/image/${element.menuImage}`}
                  alt={element.menuName}
                />
                <div className="text-center">
                  <p className="font-medium">Nama Menu</p>
                  {element.menuName}
                </div>

                <div className="text-center">
                  <p className="font-medium">Harga Menu</p>
                  {element.harga}
                </div>

                <div className="text-center">
                  <p className="font-medium">Stok Hari Ini</p>
                  {element.stokHarian}
                </div>

                <div className="text-center">
                  <p className="font-medium">Default Stok</p>
                  {element.defaultStokHarian}
                </div>

                <div className="text-center">
                  <p className="font-medium">Reset Harian</p>
                  {element.isDefaultStokActive ? "YA" : "TIDAK"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default ListMenuComponent;
