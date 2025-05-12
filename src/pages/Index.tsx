
import React from "react";
import { Navigate } from "react-router-dom";

// This file now just redirects to the home page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
