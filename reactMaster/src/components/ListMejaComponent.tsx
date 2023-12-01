import axios from "axios";
import { TiDelete } from "react-icons/ti";

interface ResponseMeja {
  data: {
    idMeja: string;
    namaMeja: string;
  }[];
  totalElement: number;
}

interface PropsListMeja {
  responseMeja: ResponseMeja | undefined;
  changeList: () => void;
}

function ListMejaComponent({ responseMeja, changeList }: PropsListMeja) {
  const removeElement = (idElement: string) => {
    axios
      .delete(`http://localhost:1010/meja/${idElement}`)
      .then(() => {
        changeList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full h-screen pt-32 pb-20 col-span-3 overflow-auto">
      <div className="grid lg:grid-cols-3 xl:grid-cols-4 w-full gap-6">
        {responseMeja?.data.map((element) => {
          return (
            <div
              className="w-52 p-4 relative font-medium text-lg bg-white border-2 shadow-sm rounded"
              key={element.idMeja}
            >
              <p>{element.namaMeja}</p>
              <TiDelete
                className="text-red-600 text-2xl absolute top-0 right-0 cursor-pointer"
                onClick={() => {
                  removeElement(element.idMeja);
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ListMejaComponent;
