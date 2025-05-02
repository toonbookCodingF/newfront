import React from 'react';
import { AuthTemplate } from '../templates/AuthTemplate';
import { RegisterForm } from '../organisms/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <AuthTemplate>
      <RegisterForm />
    </AuthTemplate>
  );
}; 