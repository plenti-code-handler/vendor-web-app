"use client";
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, CloudIcon } from '@heroicons/react/24/outline';

const GreetingBanner = ({ 
  userName, 
  className = "", 
  variant = "default",
  showIcon = true,
  showWelcome = false 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: "Good Morning", icon: SunIcon };
    } else if (hour >= 12 && hour < 17) {
      return { text: "Good Afternoon", icon: CloudIcon };
    } else if (hour >= 17 && hour < 21) {
      return { text: "Good Evening", icon: SunIcon };
    } else {
      return { text: "Good Night", icon: MoonIcon };
    }
  };

  // ✅ Don't render until client-side
  if (!mounted) {
    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-sm ${className}`}>
        <div className="w-4 h-4 bg-purple-200 rounded animate-pulse mr-2"></div>
        <div className="w-24 h-4 bg-purple-200 rounded animate-pulse"></div>
      </div>
    );
  }

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const getVariantStyles = () => {
    switch (variant) {
      case "minimal":
        return "bg-white border border-gray-200 shadow-sm";
      case "gradient":
        return "bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-sm";
      case "solid":
        return "bg-purple-600 text-white";
      default:
        return "bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-sm";
    }
  };

  return (
    <div className={`inline-flex items-center px-4 py-2 rounded-lg ${getVariantStyles()} ${className}`}>
      {showIcon && (
        <GreetingIcon className="w-4 h-4 mr-2 text-purple-600" />
      )}
      <span className="text-sm font-medium text-gray-700">
        {greeting.text}
        {showWelcome && userName && (
          <span className="ml-1 text-purple-600">, {userName}</span>
        )}
      </span>
    </div>
  );
};

export default GreetingBanner;