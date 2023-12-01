import { Link } from "react-router-dom";

function SideNav() {
  return (
    <>
      <div className="py-6 px-4 bg-primary-color fixed left-0 right-0 z-10 flex gap-8 shadow border-b">
        <Link to="/" className="text-lg font-roboto hover:text-gray-700">
          Report
        </Link>

        <Link to="/meja" className="text-lg font-roboto hover:text-gray-700">
          Data Meja
        </Link>

        <Link to="/menu" className="text-lg font-roboto hover:text-gray-700">
          Data Menu
        </Link>

        <Link
          to="/transaksi"
          className="text-lg font-roboto hover:text-gray-700"
        >
          Transaksi
        </Link>
      </div>
    </>
  );
}

export default SideNav;
