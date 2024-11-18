import { memo } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
import Headers from "../../components/Headers";
interface Props {
  children?: React.ReactNode;
}

function MainLayoutInner({ children }: Props) {
  return (
    <div>
      <div>
        <Headers />
        {children}
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
