import React from 'react';
import Buttons from '../Button/Buttons';

const WhatsAppContact = ({ 
  phoneNumber,
  message = "Hi! I'm interested in your listing on Buckler Investments.",
  listing = null,
  className = "",
  buttonText = "Message Host",
  size = "md",
  style = "outline" // "fill" or "outline"
}) => {
  // Format phone number for WhatsApp (remove any non-digits and ensure it starts with country code)
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 0, replace with 254 (Kenya country code)
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    
    // If it doesn't start with 254, add it
    if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return cleaned;
  };

  // Generate WhatsApp message with listing details
  const generateMessage = () => {
    let whatsappMessage = message;
    
    if (listing) {
      whatsappMessage += `\n\n📍 Property: ${listing.title || 'Listing'}`;
      if (listing.location) {
        whatsappMessage += `\n🏠 Location: ${listing.location}`;
      }
      if (listing.price_per_night || listing.nightly_price) {
        whatsappMessage += `\n💰 Price: KES ${(listing.price_per_night || listing.nightly_price).toLocaleString()}/night`;
      }
      
      // Add link to the listing if available
      if (typeof window !== 'undefined') {
        whatsappMessage += `\n🔗 Link: ${window.location.href}`;
      }
    }
    
    return whatsappMessage;
  };

  // Create WhatsApp URL
  const createWhatsAppUrl = () => {
    const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
    
    if (!formattedPhone) {
      console.warn('WhatsApp: Invalid phone number provided');
      return '#';
    }
    
    const encodedMessage = encodeURIComponent(generateMessage());
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  };

  const handleWhatsAppClick = () => {
    const whatsappUrl = createWhatsAppUrl();
    
    if (whatsappUrl === '#') {
      alert('Host contact information is not available. Please try again later.');
      return;
    }
    
    // Open WhatsApp in new tab/window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Don't render if no phone number
  if (!phoneNumber) {
    return (
      <div className={className}>
        <Buttons
          className="font-medium font-serif rounded-none uppercase w-full btn-fancy btn-outline"
          themeColor="#ccc"
          color="#999"
          title="📞 Contact information not available"
          size={size}
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Buttons
        className={`font-medium font-serif rounded-none uppercase w-full ${
          style === 'fill' 
            ? 'btn-fancy btn-fill' 
            : 'btn-fancy btn-outline'
        }`}
        themeColor="#25D366" // WhatsApp green
        color={style === 'fill' ? "#fff" : "#25D366"}
        title={
          <>
            <i className="fab fa-whatsapp mr-2"></i>
            {buttonText}
          </>
        }
        size={size}
        onClick={handleWhatsAppClick}
      />
    </div>
  );
};

// Default export for easy importing
export default WhatsAppContact;

// Call button component
export const CallHostButton = ({ listing, className = "" }) => {
  const phoneNumber = listing?.host?.phone_number || listing?.contact_phone;
  
  const handleCall = () => {
    if (phoneNumber) {
      // Create tel: link to initiate phone call
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  // Don't render if no phone number
  if (!phoneNumber) {
    return (
      <div className={className}>
        <Buttons
          className="font-medium font-serif rounded-none uppercase w-full btn-fancy btn-outline"
          themeColor="#ccc"
          color="#999"
          title="📞 Phone not available"
          disabled={true}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <Buttons
        className="font-medium font-serif rounded-none uppercase w-full btn-fancy btn-outline"
        themeColor="#007bff" // Blue for call button
        color="#007bff"
        title={
          <>
            <i className="fas fa-phone mr-2"></i>
            Call Host
          </>
        }
        onClick={handleCall}
      />
    </div>
  );
};

// Combined host contact component with both call and WhatsApp
export const HostContactButtons = ({ listing, className = "" }) => {
  // Debug logging
  console.log('HostContactButtons - listing:', listing);
  console.log('HostContactButtons - host info:', listing?.host);
  console.log('HostContactButtons - phone_number:', listing?.host?.phone_number);
  
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Call Button */}
      <CallHostButton listing={listing} />
      
      {/* WhatsApp Button */}
      <WhatsAppContact
        phoneNumber={listing?.host?.phone_number || listing?.contact_phone || "+254700000000"} // Fallback for testing
        listing={listing}
        buttonText="Message Host"
        message="Hi! I'm interested in your listing and would like to know more details."
      />
    </div>
  );
};

// Named export for specific use cases (kept for backward compatibility)
export const WhatsAppHostContact = ({ listing, className = "" }) => {
  // Debug logging
  console.log('WhatsAppHostContact - listing:', listing);
  console.log('WhatsAppHostContact - host info:', listing?.host);
  console.log('WhatsAppHostContact - phone_number:', listing?.host?.phone_number);
  
  return (
    <WhatsAppContact
      phoneNumber={listing?.host?.phone_number || listing?.contact_phone || "+254700000000"} // Fallback for testing
      listing={listing}
      className={className}
      buttonText="Message Host"
      message="Hi! I'm interested in your listing and would like to know more details."
    />
  );
};

// For property inquiries
export const WhatsAppPropertyContact = ({ property, className = "" }) => {
  return (
    <WhatsAppContact
      phoneNumber={property?.agent?.phone || property?.contact_phone}
      listing={property}
      className={className}
      buttonText="Contact Agent"
      message="Hi! I'm interested in this property and would like to schedule a viewing."
    />
  );
};

// Call support button
export const CallSupportButton = ({ className = "" }) => {
  // Support phone number
  const supportPhoneNumber = "+254700000000";
  
  const handleCall = () => {
    window.location.href = `tel:${supportPhoneNumber}`;
  };

  return (
    <div className={className}>
      <Buttons
        className="font-medium font-serif rounded-none uppercase w-full btn-fancy btn-outline"
        themeColor="#007bff" // Blue for call button
        color="#007bff"
        title={
          <>
            <i className="fas fa-phone mr-2"></i>
            Call Support
          </>
        }
        onClick={handleCall}
      />
    </div>
  );
};

// Combined support contact with both call and WhatsApp
export const SupportContactButtons = ({ className = "" }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Call Button */}
      <CallSupportButton />
      
      {/* WhatsApp Button */}
      <WhatsAppSupportContact />
    </div>
  );
};

// For general support (kept for backward compatibility)
export const WhatsAppSupportContact = ({ className = "" }) => {
  return (
    <WhatsAppContact
      phoneNumber="+254700000000" // Replace with your support number
      className={className}
      buttonText="WhatsApp Support"
      message="Hi! I need help with the Buckler Investments platform."
      style="fill"
    />
  );
};
