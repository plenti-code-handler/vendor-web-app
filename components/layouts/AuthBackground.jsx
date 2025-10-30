import React from "react";

const AuthBackground = () => {
  return (
    <div 
      className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/Background.png')"
      }}
    />
  );
};

export default AuthBackground;
