import { Outlet } from 'react-router-dom';
import SideNav from './components/SideNav';

function App() {
  return (
    <>
      <SideNav />
      <Outlet/>
    </>
  );
}

export default App;
