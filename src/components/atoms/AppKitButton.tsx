// src/components/AppKitButton.tsx
import React from 'react';

type AppKitButtonProps = React.HTMLAttributes<HTMLElement> & {
  namespace?: 'solana';
  size?: 'sm' | 'md' | 'lg';
  balance?: 'hide' | 'show';
};

export const AppKitButton: React.FC<AppKitButtonProps> = (props) =>
  React.createElement('appkit-button' as any, props);
