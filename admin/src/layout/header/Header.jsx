import "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";

import { useTheme, useThemeUpdate } from '../provider/Theme';

const Header = ({ fixed, className }) => {

  const theme = useTheme();
  const themeUpdate = useThemeUpdate();

  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme.header === "white",
    [`is-${theme.header}`]: theme.header !== "white" && theme.header !== "light",
    [`${className}`]: className,
  });
  const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "/"));
  const params = (typeof window !== "undefined") ? new URLSearchParams(window.location.search) : null;
  let backToSiteHref = publicAppUrl;
  if (params && params.get("return_to")) {
    const rt = decodeURIComponent(params.get("return_to"));
    backToSiteHref = (/^https?:\/\//i.test(rt)) ? rt : `${publicAppUrl.replace(/\/$/, "")}${rt.startsWith("/") ? "" : "/"}${rt}`;
  }
  
  // Pass tokens back to frontend when returning to site
  const handleBackToSite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Back to site clicked, redirecting to:', backToSiteHref);
    
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      let targetUrl = backToSiteHref;
      
      // Note: accessToken is in memory, we'll let frontend use its own or refresh
      if (refreshToken) {
        const tokenParams = new URLSearchParams({
          refresh_token: refreshToken,
          sync_auth: '1'
        });
        targetUrl = `${backToSiteHref}#${tokenParams.toString()}`;
      }
      
      console.log('Redirecting to:', targetUrl);
      
      // Force full page navigation
      window.location.replace(targetUrl);
    } catch (error) {
      console.error('Error during back to site:', error);
      window.location.replace(backToSiteHref);
    }
  };
  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ms-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ms-n1"
              icon="menu"
              click={themeUpdate.sidebarVisibility}
            />
          </div>
          <div className="nk-header-brand d-xl-none">
            <Logo />
          </div>
          <div className="nk-header-news d-none d-xl-block">
            <News />
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
              <li className="me-2 d-none d-md-block">
                <a href={backToSiteHref} onClick={handleBackToSite} className="btn btn-sm btn-primary">
                  Back to site
                </a>
              </li>
              <li className="user-dropdown">
                <User/>
              </li>
              <li className="notification-dropdown me-n1">
                <Notification />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
