import React from "react";

const DietIcon = ({ diet, size = "sm" }) => {
  const isVeg = diet?.toLowerCase() === "veg";
  
  // Size configurations
  const sizeConfig = {
    xs: {
      container: "w-3 h-3 p-0.5",
      icon: "w-1 h-1"
    },
    sm: {
      container: "w-4 h-4 p-0.5",
      icon: "w-2 h-2"
    },
    md: {
      container: "w-5 h-5 p-1",
      icon: "w-2.5 h-2.5"
    },
    lg: {
      container: "w-6 h-6 p-1",
      icon: "w-3 h-3"
    }
  };

  const config = sizeConfig[size] || sizeConfig.sm;

  return (
    <div 
      className={`
        ${config.container}
        border 
        ${isVeg ? 'border-green-600' : 'border-red-600'}
        rounded 
        flex 
        items-center 
        justify-center
        flex-shrink-0
      `}
    >
      {isVeg ? (
        // Green circle for veg
        <div 
          className={`
            ${config.icon}
            rounded-full 
            bg-green-600
          `}
        />
      ) : (
        // Red triangle for non-veg
        <div 
          className="relative"
          style={{
            width: 0,
            height: 0,
            borderLeft: size === 'xs' ? '0.2rem solid transparent' : '0.28rem solid transparent',
            borderRight: size === 'xs' ? '0.2rem solid transparent' : '0.28rem solid transparent',
            borderBottom: size === 'xs' ? '0.35rem solid #DC2626' : '0.4rem solid #DC2626',
          }}
        />
      )}
    </div>
  );
};

export default DietIcon;
