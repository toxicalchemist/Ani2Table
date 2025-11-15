import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// About page removed; redirect to landing page about anchor
const AboutPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/#about', { replace: true });
  }, [navigate]);

  return null;
};

export default AboutPage;
