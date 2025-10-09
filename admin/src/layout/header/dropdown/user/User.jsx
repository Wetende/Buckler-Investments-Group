import  { useState } from "react";
import UserAvatar from "@/components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "@/components/Component";
import { LinkList, LinkItem } from "@/components/links/Links";
import { useTheme, useThemeUpdate } from "@/layout/provider/Theme";

const User = () => {
  const theme = useTheme();
  const themeUpdate = useThemeUpdate();
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="sm" />
          <div className="user-info d-none d-md-block">
            <div className="user-status">Administrator</div>
            <div className="user-name dropdown-indicator">Abu Bin Ishityak</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu end className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner py-2">
          <LinkList>
            {
              (() => {
                const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "/"));
                const params = (typeof window !== "undefined") ? new URLSearchParams(window.location.search) : null;
                let backToSiteHref = publicAppUrl;
                if (params && params.get("return_to")) {
                  const rt = decodeURIComponent(params.get("return_to"));
                  backToSiteHref = (/^https?:\/\//i.test(rt)) ? rt : `${publicAppUrl.replace(/\/$/, "")}${rt.startsWith("/") ? "" : "/"}${rt}`;
                }
                
                const handleBackToSite = (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('Back to site clicked (dropdown), redirecting to:', backToSiteHref);
                  
                  try {
                    const refreshToken = localStorage.getItem('refresh_token');
                    let targetUrl = backToSiteHref;
                    
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
                  <a href={backToSiteHref} onClick={handleBackToSite} className="link-item">
                    <em className="icon ni ni-arrow-left"></em>
                    <span>Back to site</span>
                  </a>
                );
              })()
            }
          </LinkList>
        </div>
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card sm">
            <div className="user-avatar">
              <span>AB</span>
            </div>
            <div className="user-info">
              <span className="lead-text">Abu Bin Ishtiyak</span>
              <span className="sub-text">info@softnio.com</span>
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user-profile-regular" icon="user-alt" onClick={toggle}>
              View Profile
            </LinkItem>
            <LinkItem link="/user-profile-setting" icon="setting-alt" onClick={toggle}>
              Account Setting
            </LinkItem>
            <LinkItem link="/user-profile-activity" icon="activity-alt" onClick={toggle}>
              Login Activity
            </LinkItem>
            <li>
              <a className={`dark-switch ${theme.skin === 'dark' ? 'active' : ''}`} href="#" 
              onClick={(ev) => {
                ev.preventDefault();
                themeUpdate.skin(theme.skin === 'dark' ? 'light' : 'dark');
              }}>
                {theme.skin === 'dark' ? 
                  <><em className="icon ni ni-sun"></em><span>Light Mode</span></> 
                  : 
                  <><em className="icon ni ni-moon"></em><span>Dark Mode</span></>
                }
              </a>
            </li>
          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`/auth-login`}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
