const menu = [
  {
    icon: "dashlite",
    text: "Main Dashboard",
    link: "/",
    roles: ["ADMIN", "SUPER_ADMIN"], // Only admins see main overview
  },
  {
    heading: "Business Domains",
    roles: ["ADMIN", "SUPER_ADMIN"], // Only admins see this heading
  },
  // BnB Section
  {
    icon: "home",
    text: "BnB",
    roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Dashboard",
        link: "/bnb-dashboard",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "My Listings",
        link: "/bnb/my-listings",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Create Listing",
        link: "/bnb/create-listing",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Bookings",
        link: "/bnb/bookings",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Earnings",
        link: "/bnb/earnings",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Payouts",
        link: "/bnb/payouts",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Reviews",
        link: "/bnb/reviews",
        roles: ["HOST", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  // Tours Section
  {
    icon: "map",
    text: "Tours",
    roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Dashboard",
        link: "/tours-dashboard",
        roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "My Tours",
        link: "/tours/my-tours",
        roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Create Tour",
        link: "/tours/create-tour",
        roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Bookings",
        link: "/tours/bookings",
        roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Earnings",
        link: "/tours/earnings",
        roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Reviews",
        link: "/tours/reviews",
        roles: ["TOUR_OPERATOR", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  // Properties Section
  {
    icon: "building",
    text: "Properties",
    roles: ["AGENT", "ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Dashboard",
        link: "/properties-dashboard",
        roles: ["AGENT", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "My Properties",
        link: "/properties/my-properties",
        roles: ["AGENT", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Add Property",
        link: "/properties/add-property",
        roles: ["AGENT", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Inquiries",
        link: "/properties/inquiries",
        roles: ["AGENT", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Analytics",
        link: "/properties/analytics",
        roles: ["AGENT", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  // Cars Section
  {
    icon: "truck",
    text: "Cars",
    roles: ["VEHICLE_OWNER", "ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Dashboard",
        link: "/cars-dashboard",
        roles: ["VEHICLE_OWNER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "My Vehicles",
        link: "/cars/my-vehicles",
        roles: ["VEHICLE_OWNER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Add Vehicle",
        link: "/cars/add-vehicle",
        roles: ["VEHICLE_OWNER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Rentals",
        link: "/cars/rentals",
        roles: ["VEHICLE_OWNER", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Earnings",
        link: "/cars/earnings",
        roles: ["VEHICLE_OWNER", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  // Investments Section
  {
    icon: "coins",
    text: "Investments",
    roles: ["ADMIN", "SUPER_ADMIN"], // Investment platform is admin-managed
    subMenu: [
      {
        text: "Dashboard",
        link: "/investments-dashboard",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Products",
        link: "/investments/products",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Orders",
        link: "/investments/orders",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Analytics",
        link: "/investments/analytics",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    heading: "System Analytics",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "bitcoin-cash",
    text: "Crypto Dashboard",
    link: "/crypto",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "growth",
    text: "Analytics Dashboard",
    link: "/analytics",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "coins",
    text: "Invest Dashboard",
    link: "/invest",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    heading: "Account & Profile",
    roles: ["HOST", "TOUR_OPERATOR", "VEHICLE_OWNER", "AGENT", "ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "users",
    text: "My Profile",
    roles: ["HOST", "TOUR_OPERATOR", "VEHICLE_OWNER", "AGENT", "ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Profile Settings",
        link: "/user-profile-regular",
        roles: ["HOST", "TOUR_OPERATOR", "VEHICLE_OWNER", "AGENT", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Notifications",
        link: "/user-profile-notification",
        roles: ["HOST", "TOUR_OPERATOR", "VEHICLE_OWNER", "AGENT", "ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Activity Log",
        link: "/user-profile-activity",
        roles: ["HOST", "TOUR_OPERATOR", "VEHICLE_OWNER", "AGENT", "ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    heading: "Admin Tools",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "users",
    text: "User Management",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "User List - Regular",
        link: "/user-list-regular",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "User List - Compact",
        link: "/user-list-compact",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "User Details",
        link: "/user-details-regular/1",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "User Contact Cards",
        link: "/user-contact-card",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    icon: "file-docs",
    text: "AML / KYCs",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "KYC List - Regular",
        link: "/kyc-list-regular",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "KYC Details - Regular",
        link: "/kyc-details-regular/UD01544",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    icon: "tranx",
    text: "Transactions",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Transaction List - Basic",
        link: "/transaction-basic",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Transaction List - Crypto",
        link: "/transaction-crypto",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    icon: "grid-alt",
    text: "Applications",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Messages",
        link: "/app-messages",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Chats / Messenger",
        link: "/app-chat",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Inbox / Mail",
        link: "/app-inbox",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Calendar",
        link: "/app-calender",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "File Manager",
        link: "/app-file-manager",
        badge: "new",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
      {
        text: "Kanban Board",
        link: "/app-kanban",
        roles: ["ADMIN", "SUPER_ADMIN"],
      },
    ],
  },
  {
    icon: "card-view",
    text: "Products",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Product List",
        link: "/product-list",
      },
      {
        text: "Product Card",
        link: "/product-card",
      },
      {
        text: "Product Details",
        link: "/product-details/0",
      },
    ],
  },
  {
    icon: "file-docs",
    text: "Invoice",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Invoice List",
        link: "/invoice-list",
      },
      {
        text: "Invoice Details",
        link: "/invoice-details/1",
      },
    ],
  },
  {
    icon: "view-col",
    text: "Pricing Table",
    link: "/pricing-table",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "img",
    text: "Image Gallery",
    link: "/image-gallery",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    heading: "Misc Pages",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "signin",
    text: "Auth Pages",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Login / Signin",
        link: "/auth-login",
        newTab: true,
      },
      {
        text: "Register / Signup",
        link: "/auth-register",
        newTab: true,
      },
      {
        text: "Forgot Password",
        link: "/auth-reset",
        newTab: true,
      },
      {
        text: "Success / Confirm",
        link: "/auth-success",
        newTab: true,
      },
    ],
  },
  {
    icon: "files",
    text: "Error Pages",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "404 Classic",
        link: "/errors/404-classic",
        newTab: true,
      },
      {
        text: "504 Classic",
        link: "/errors/504-classic",
        newTab: true,
      },
      {
        text: "404 Modern",
        link: "/errors/404-modern",
        newTab: true,
      },
      {
        text: "504 Modern",
        link: "/errors/504-modern",
        newTab: true,
      },
    ],
  },
  {
    icon: "files",
    text: "Other Pages",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Blank / Startup",
        link: "/_blank",
      },
      {
        text: "Faqs / Help",
        link: "/pages/faq",
      },
      {
        text: "Terms / Policy",
        link: "/pages/terms-policy",
      },
      {
        text: "Regular Page - v1",
        link: "/pages/regular-v1",
      },
      {
        text: "Regular Page - v2",
        link: "/pages/regular-v2",
      },
    ],
  },
  {
    heading: "Components",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
  {
    icon: "layers",
    text: "Ui Elements",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Alerts",
        link: "/components/alerts",
      },
      {
        text: "Accordions",
        link: "/components/accordions",
      },
      {
        text: "Avatar",
        link: "/components/avatar",
      },
      {
        text: "Badges",
        link: "/components/badges",
      },
      {
        text: "Buttons",
        link: "/components/buttons",
      },
      {
        text: "Button Group",
        link: "/components/button-group",
      },
      {
        text: "Breadcrumbs",
        link: "/components/breadcrumbs",
      },
      {
        text: "Cards",
        link: "/components/cards",
      },
      {
        text: "Carousel",
        link: "/components/carousel",
      },
      {
        text: "Dropdowns",
        link: "/components/dropdowns",
      },
      {
        text: "Modals",
        link: "/components/modals",
      },
      {
        text: "Pagination",
        link: "/components/pagination",
      },
      {
        text: "Popovers",
        link: "/components/popovers",
      },
      {
        text: "Progress",
        link: "/components/progress",
      },
      {
        text: "Spinner",
        link: "/components/spinner",
      },
      {
        text: "Tabs",
        link: "/components/tabs",
      },
      {
        text: "Toast",
        link: "/components/toast",
      },
      {
        text: "Typography",
        link: "/components/typography",
      },
      {
        text: "Tooltips",
        link: "/components/tooltips",
      },
      {
        text: "Utilities",
        subMenu: [
          {
            text: "Borders",
            link: "/components/util-border",
          },
          {
            text: "Colors",
            link: "/components/util-colors",
          },
          {
            text: "Display",
            link: "/components/util-display",
          },
          {
            text: "Embeded",
            link: "/components/util-embeded",
          },
          {
            text: "Flex",
            link: "/components/util-flex",
          },
          {
            text: "Text",
            link: "/components/util-text",
          },
          {
            text: "Sizing",
            link: "/components/util-sizing",
          },
          {
            text: "Spacing",
            link: "/components/util-spacing",
          },
          {
            text: "Others",
            link: "/components/util-others",
          },
        ],
      },
    ],
  },
  {
    icon: "dot-box",
    text: "Crafted Icons",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "SVG Icon-Exclusive",
        link: "/svg-icons",
      },
      {
        text: "Nioicon - HandCrafted",
        link: "/nioicon",
      },
    ],
  },
  {
    icon: "table-view",
    text: "Tables",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Basic Tables",
        link: "/table-basic",
      },
      {
        text: "Special Tables",
        link: "/table-special",
      },
      {
        text: "DataTables",
        link: "/table-datatable",
      },
    ],
  },
  {
    icon: "card-view",
    text: "Forms",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Form Elements",
        link: "/components/form-elements",
      },
      {
        text: "Checkbox Radio",
        link: "/components/checkbox-radio",
      },
      {
        text: "Advanced Controls",
        link: "/components/advanced-control",
      },
      {
        text: "Input Group",
        link: "/components/input-group",
      },
      {
        text: "Form Upload",
        link: "/components/form-upload",
      },
      {
        text: "Date Time Picker",
        link: "/components/datetime-picker",
      },
      {
        text: "Number Spinner",
        link: "/components/number-spinner",
      },
      {
        text: "noUiSlider",
        link: "/components/nouislider",
      },
      {
        text: "Form Layouts",
        link: "/components/form-layouts",
      },
      {
        text: "Form Validation",
        link: "/components/form-validation",
      },
      {
        text: "Wizard Basic",
        link: "/components/wizard-basic",
      },
      {
        text: "Rich Editor",
        subMenu: [
          {
            text: "Quill",
            link: "/components/quill",
          },
          {
            text: "Tinymce",
            link: "/components/tinymce",
          },
        ],
      },
    ],
  },
  {
    icon: "pie",
    text: "Charts",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Chart Js",
        link: "/charts/chartjs",
      },
      {
        text: "Knobs",
        link: "/charts/knobs",
      },
    ],
  },
  {
    icon: "puzzle",
    text: "Widgets",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Card Widgets",
        link: "/components/widgets/cards",
      },
      {
        text: "Chart Widgets",
        link: "/components/widgets/charts",
      },
      {
        text: "Rating Widgets",
        link: "/components/widgets/rating",
      },
    ],
  },
  {
    icon: "block-over",
    text: "Miscellaneous",
    roles: ["ADMIN", "SUPER_ADMIN"],
    subMenu: [
      {
        text: "Slick Sliders",
        link: "/components/misc/slick-slider",
      },
      {
        text: "Tree View",
        link: "/components/misc/tree-view",
      },
      {
        text: "React Toastify",
        link: "/components/misc/toastify",
      },
      {
        text: "Sweet Alert",
        link: "/components/misc/sweet-alert",
      },
      {
        text: "React DualListBox",
        link: "/components/misc/dual-list",
      },
      {
        text: "React Beautiful Dnd",
        link: "/components/misc/beautiful-dnd",
      },
      {
        text: "Google Map",
        link: "/components/misc/map",
      },
    ],
  },
  {
    icon: "text-rich",
    text: "Email Template",
    link: "/email-template",
    roles: ["ADMIN", "SUPER_ADMIN"],
  },
];

// Utility function to filter menu based on user role
export const filterMenuByRole = (menuItems, userRole) => {
  if (!userRole) return [];
  
  return menuItems.filter(item => {
    // If no roles specified, show to all authenticated users
    if (!item.roles) return true;
    // Check if user role is in allowed roles
    if (!item.roles.includes(userRole)) return false;
    
    // Filter submenus recursively
    if (item.subMenu) {
      item.subMenu = item.subMenu.filter(subItem => {
        if (!subItem.roles) return true;
        return subItem.roles.includes(userRole);
      });
      // Don't show parent menu if all submenus are filtered out
      if (item.subMenu.length === 0) return false;
    }
    
    return true;
  });
};

export default menu;
