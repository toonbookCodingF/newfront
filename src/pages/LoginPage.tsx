import React from 'react';
import { AuthTemplate } from '../templates/AuthTemplate';
import { LoginForm } from '../organisms/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <AuthTemplate>
      <LoginForm />
    </AuthTemplate>
  );
}; 