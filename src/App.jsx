import React from 'react'
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Products from './Components/Products/Products';
import Error from './Components/Error/Error';
import Test from './Components/Test/test';
import AuthContextProvider from './Context/AuthContext';
import CartContextProvider from './Context/CartContext';
import Cart from './Components/Cart/Cart';
import Categories from './Components/Categories/Categories';
import ProtectedRoute from './Components/Gaurd/Gaurd';
import Brands from './Components/Brands/Brands';
import { QueryClient, QueryClientProvider } from 'react-query';
import ProductDetails from './Components/ProductDetails/ProductDetails';
import toast, { Toaster } from 'react-hot-toast';
import Payment from './Components/Payment/Payment';
import Allorders from './Components/AllOrders/Allorders';
import Profile from './Components/Profile/Profile';
import { Offline } from 'react-detect-offline';
import { RiWifiOffLine } from 'react-icons/ri';
import BrandDetails from './Components/BrandDetails/BrandDetails';
import Product from './Components/Product/Product';
import Wishlist from './Components/Wishlist/Wishlist';
import WishlistProvider, { wishlistContext } from './Context/wishlist';

// some websites doesn't support createBrowserRouter >>createHashRouter
// createBrowserRouter>>client side   >>>"/"
// createHashRouter>>server side      >>>"./"
//    "homepage": "./",



const myRouter = createBrowserRouter([
  {
    path: '/', element: <Layout />, children: [
      { index: true, element: <Register /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'test', element: <Test /> },
      {
        path: 'Cart', element: <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      },
      {
        path: 'Categories', element: <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      },
      {
        path: 'Brands', element: <ProtectedRoute>
          <Brands />
        </ProtectedRoute>
      },
      {
        path: 'home', element: <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      },
      {
        path: 'products', element: <ProtectedRoute>
          <Product />
        </ProtectedRoute>
      },
      {
        path: 'wishlist', element: <ProtectedRoute>
          <Wishlist />
        </ProtectedRoute>
      },
      {
        path: 'productdetails/:id', element: <ProtectedRoute>
          <ProductDetails />
        </ProtectedRoute>
      },
      {
        path: 'branddetails/:id', element: <ProtectedRoute>
          <BrandDetails />
        </ProtectedRoute>
      },
      {
        path: 'payment', element: <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      },
      {
        path: 'AllOrders', element: <ProtectedRoute>
          <Allorders />
        </ProtectedRoute>
      },
      // {
      //   path: 'Profile', element: <ProtectedRoute>
      //     <Profile />
      //   </ProtectedRoute>
      // },
      { path: '*', element: <Error /> }
    ]
  },
])


function App() {
  const myClient = new QueryClient();

  return <>
    <QueryClientProvider client={myClient}>


      <AuthContextProvider>
        <CartContextProvider>
          <WishlistProvider>
            <RouterProvider router={myRouter} />

          </WishlistProvider>


        </CartContextProvider>
      </AuthContextProvider>



    </QueryClientProvider>

    <Toaster />
    <Offline>
      <div className='father'>

        <div class="wrapper">
          <div class="toast">
            <div class="contentt">
              <div class="icon"><RiWifiOffLine /></div>
              <div class="details">
                <span>You're offline now</span>
                <p>Oops! Internet is disconnected.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Offline>





  </>
}

export default App
