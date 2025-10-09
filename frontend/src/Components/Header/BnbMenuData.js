import React from 'react';
import BnbServiceSelectionModal from '../HostApplication/BnbServiceSelectionModal';
import Buttons from '../Button/Buttons';

const ADMIN_BASE_URL = `${process.env.REACT_APP_ADMIN_BASE_URL || 'http://localhost:5173'}/dashboard/bnb-dashboard`

// Role-based dashboard routing
const getDashboardUrl = (userRole) => {
  const roleRoutes = {
    'USER': `${ADMIN_BASE_URL}`,
    'HOST': `${ADMIN_BASE_URL}/bnb/my-listings`,
    'TOUR_OPERATOR': `${ADMIN_BASE_URL}/tours/my-tours`, 
    'VEHICLE_OWNER': `${ADMIN_BASE_URL}/cars/my-vehicles`,
    'AGENT': `${ADMIN_BASE_URL}/properties/my-properties`,
    'ADMIN': `${ADMIN_BASE_URL}`,
    'SUPER_ADMIN': `${ADMIN_BASE_URL}`
  }
  return roleRoutes[userRole] || `${ADMIN_BASE_URL}`
}

// Export function to generate menu based on user context
const getBnbMenuData = (user = null) => [
  {
    title: "Stays",
    link: "/bnb/list",
    dropdown: [
      {
        title: "Entire places",
        link: "/bnb/list?type=entire",
        megamenu: false
      },
      {
        title: "Private rooms", 
        link: "/bnb/list?type=private",
        megamenu: false
      },
      {
        title: "Shared rooms",
        link: "/bnb/list?type=shared", 
        megamenu: false
      },
      {
        title: "Unique stays",
        link: "/bnb/list?category=unique",
        megamenu: false
      },
      {
        title: "Business travel",
        link: "/bnb/list?category=business",
        megamenu: false
      },
      {
        title: "Monthly stays",
        link: "/bnb/list?duration=monthly",
        megamenu: false
      }
    ]
  },
  {
    title: "Experiences",
    link: "/tours",
    dropdown: [
      {
        title: "Tours & Safaris",
        link: "/tours",
        megamenu: false
      },
      {
        title: "Cultural experiences",
        link: "/tours?category=cultural",
        megamenu: false
      },
      {
        title: "Adventure activities", 
        link: "/tours?category=adventure",
        megamenu: false
      },
      {
        title: "Local guides",
        link: "/tours?type=guided",
        megamenu: false
      }
    ]
  },
  {
    title: "Host",
    link: ADMIN_BASE_URL,
    dropdown: [
      {
        title: "List your space",
        link: "/host/onboarding",
        megamenu: false
      },
      {
        title: "Host dashboard",
        link: ADMIN_BASE_URL, 
        megamenu: false
      },
      {
        title: "Host resources",
        link: "/host/resources",
        megamenu: false
      },
      {
        title: "Community center",
        link: "/host/community",
        megamenu: false
      }
    ]
  },
  {
    title: "Destinations",
    link: "/bnb/list",
    dropdown: [
      {
        title: "All",
        link: "/bnb/list",
        megamenu: false
      },
      {
        title: "Nairobi",
        link: "/bnb/list?location=nairobi",
        megamenu: false
      },
      {
        title: "Mombasa", 
        link: "/bnb/list?location=mombasa",
        megamenu: false
      },
      {
        title: "Kisumu",
        link: "/bnb/list?location=kisumu",
        megamenu: false
      },
      {
        title: "Nakuru",
        link: "/bnb/list?location=nakuru",
        megamenu: false
      },
      {
        title: "Diani Beach",
        link: "/bnb/list?location=diani",
        megamenu: false
      },
      {
        title: "Masai Mara",
        link: "/bnb/list?location=masai-mara",
        megamenu: false
      }
    ]
  },
  {
    title: "Become a Host",
    component: (
      <BnbServiceSelectionModal
        triggerButton={
          <button className="bg-transparent border-0 p-0 cursor-pointer hover:text-neonorange transition-colors font-inherit text-inherit">
            Become a Host
          </button>
        }
      />
    ),
    megamenu: false
  },
  // Dashboard - only show for authenticated users, route based on role
  ...(user ? [{
    title: "Dashboard",
    link: getDashboardUrl(user.role),
    megamenu: false
  }] : []),
  {
    title: "Account",
    link: "/account",
    dropdown: [
      {
        title: "My bookings",
        link: "/account/bnb-bookings",
        megamenu: false
      },
      {
        title: "Wishlist",
        link: "/account/wishlist",
        megamenu: false
      },
      {
        title: "Host dashboard",
        link: ADMIN_BASE_URL,
        megamenu: false
      }
    ]
  }
];

// Export the function for dynamic menu generation
export default getBnbMenuData;

// Export static menu for backward compatibility 
export const BnbMenuData = getBnbMenuData();

