import React from "react";
import { Outlet } from "react-router-dom";
import menu, { filterMenuByRole } from "./sidebar/MenuData";
import Sidebar from "./sidebar/Sidebar";
import Head from "./head/Head";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import AppRoot from "./global/AppRoot";
import AppMain from "./global/AppMain";
import AppWrap from "./global/AppWrap";
// import { useAuth } from "./provider/Auth";

import FileManagerProvider from "@/pages/app/file-manager/components/Context";

const Layout = ({title, ...props}) => {
  // Auth temporarily disabled for development - show all menu items
  // const { role, loading } = useAuth();

  // Use full menu for development (auth disabled)
  const menuData = menu; // filterMenuByRole(menu, role) disabled

  return (
    <FileManagerProvider>
      <Head title={!title && 'Loading'} />
      <AppRoot>
        <AppMain>
          <Sidebar menuData={menuData} fixed />
          <AppWrap>
            <Header fixed />
              <Outlet />
            <Footer />
          </AppWrap>
        </AppMain>
      </AppRoot>
    </FileManagerProvider>
  );
};
export default Layout;
