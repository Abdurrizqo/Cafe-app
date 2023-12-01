import { useState, useEffect } from "react";
import FormMenuComponent from "../components/FormMenuComponent";
import ListMenuComponent from "../components/ListMenuComponent";
import axios from "axios";

interface DataMenu {
  menuName: string;
  harga: number;
  stokHarian: number;
  defaultStokHarian: number;
  menuImage: string;
  idMenu: string;
  isDefaultStokActive: boolean;
}

interface ResponseMenu {
  currentPage: number;
  data: DataMenu[];
  limit: number;
  totalElement: number;
  totalPage: number;
}

function MenuView() {
  const [allMenu, setAllMenu] = useState<ResponseMenu | undefined>();
  const [singleMenu, setSingleMenu] = useState<DataMenu | undefined>(undefined);
  const [isReload, setIsReload] = useState<boolean>(false);

  const removeDataEditMenu = () => {
    setSingleMenu(undefined);
  };

  useEffect(() => {
    axios
      .get("http://localhost:1010/menu?page=1&limit=100")
      .then(function (response) {
        setAllMenu(response.data);
        setIsReload(false);
      })
      .catch(function (error) {
        console.log(error);
        setIsReload(false);
      });
  }, [isReload]);

  function handleChangeList(querySearch?: string) {
    setIsReload(true);

    if (querySearch) {
      axios
        .get(
          `http://localhost:1010/menu?page=1&limit=100&seacrhMenu=${querySearch}`
        )
        .then(function (response) {
          setAllMenu(response.data);
          setIsReload(false);
        })
        .catch(function (error) {
          console.log(error);
          setIsReload(false);
        });
    }
  }

  const handleEditMenu = (idMenu: string) => {
    const dataMenu = allMenu?.data.filter((element) => {
      return element.idMenu === idMenu;
    });

    dataMenu && setSingleMenu(dataMenu[0]);
  };

  return (
    <div className="grid grid-cols-4 gap-5">
      <FormMenuComponent
        changeList={() => setIsReload(true)}
        dataMenu={singleMenu}
        removeDataMenu={removeDataEditMenu}
      />
      <ListMenuComponent
        responseMenu={allMenu}
        changeList={(query) => {
          handleChangeList(query);
        }}
        editList={(idMenu) => {
          handleEditMenu(idMenu);
        }}
      />
    </div>
  );
}

export default MenuView;
