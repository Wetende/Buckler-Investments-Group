const BnbMenuData = [
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
    link: "/host/dashboard",
    dropdown: [
      {
        title: "List your space",
        link: "/host/onboarding",
        megamenu: false
      },
      {
        title: "Host dashboard",
        link: "/host/dashboard", 
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
        link: "/host/dashboard",
        megamenu: false
      }
    ]
  }
];

export default BnbMenuData;

