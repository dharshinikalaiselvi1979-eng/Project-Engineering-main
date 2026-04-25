import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import ProductList from './features/products/ProductList';
import CartSummary from './features/cart/CartSummary';
import Dashboard from './Dashboard'; 
import LoginForm from './features/auth/LoginForm';
import Navbar from './components/Navbar';

import { useCart } from './features/cart/useCart';
import { logoutUser } from './services/loginService';