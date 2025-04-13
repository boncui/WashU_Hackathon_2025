// src/components/ClientOnly.tsx
'use client';

import React from 'react';

const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default ClientOnly;
