import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToRegister = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  if (isLogin) {
    return <Login onSwitchToRegister={switchToRegister} />;
  }

  return <Register onSwitchToLogin={switchToLogin} />;
};

export default Auth;