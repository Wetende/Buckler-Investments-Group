const BnbMenuData = [
  {
    title: "Stays",
    link: "#",
    submenu: [
      {
        title: "Entire places",
        link: "/bnb?type=entire",
        megamenu: false
      },
      {
        title: "Private rooms", 
        link: "/bnb?type=private",
        megamenu: false
      },
      {
        title: "Shared rooms",
        link: "/bnb?type=shared", 
        megamenu: false
      },
      {
        title: "Unique stays",
        link: "/bnb?category=unique",
        megamenu: false
      },
      {
        title: "Business travel",
        link: "/bnb?category=business",
        megamenu: false
      },
      {
        title: "Monthly stays",
        link: "/bnb?duration=monthly",
        megamenu: false
      }
    ]
  },
  {
    title: "Experiences",
    link: "#",
    submenu: [
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
    link: "#",
    submenu: [
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
    link: "#",
    submenu: [
      {
        title: "Nairobi",
        link: "/bnb?location=nairobi",
        megamenu: false
      },
      {
        title: "Mombasa", 
        link: "/bnb?location=mombasa",
        megamenu: false
      },
      {
        title: "Kisumu",
        link: "/bnb?location=kisumu",
        megamenu: false
      },
      {
        title: "Nakuru",
        link: "/bnb?location=nakuru",
        megamenu: false
      },
      {
        title: "Diani Beach",
        link: "/bnb?location=diani",
        megamenu: false
      },
      {
        title: "Masai Mara",
        link: "/bnb?location=masai-mara",
        megamenu: false
      }
    ]
  }
];

export default BnbMenuData;
