import { useState, useEffect } from "react";
import FormMejaComponent from "../components/FormMejaComponent";
import ListMejaComponent from "../components/ListMejaComponent";
import axios from "axios";

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

function MejaView() {
  const [allMeja, setAllMeja] = useState<ResponseMeja | undefined>();
  const [isReload, setIsReload] = useState<boolean>(false);

  useEffect(() => {
    axios
      .get("http://localhost:1010/meja")
      .then(function (response) {
        setAllMeja(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    setIsReload(false);
  }, [isReload]);

  return (
    <div className="grid grid-cols-4 gap-5">
      <FormMejaComponent changeList={() => setIsReload(true)} />
      <ListMejaComponent
        responseMeja={allMeja}
        changeList={() => setIsReload(true)}
      />
    </div>
  );
}

export default MejaView;
