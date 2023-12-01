import BayarModal from "./components/BayarModal";
import FormEditOrder from "./components/FormEditOrder";
import FormOrder from "./components/FormOrder";
import ListOrder from "./components/ListOrder";
import useOrderStore from "./store/OrderStore";

function App() {
  const selectedOrder = useOrderStore((state) => state.order);
  const bayarModal = useOrderStore((state) => state.stateBayar);

  return (
    <>
      {bayarModal && <BayarModal />}
      <div className="grid grid-cols-2 gap-6 relative">
        {!selectedOrder ? <FormOrder /> : <FormEditOrder />}
        <div className="fixed -z-10 left-0 right-0 top-0 bottom-0 flex justify-center">
          <div className="h-screen w-[0.1rem] bg-gray-200"></div>
        </div>
        <ListOrder />
      </div>
    </>
  );
}

export default App;
