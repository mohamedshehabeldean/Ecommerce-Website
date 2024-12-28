import React, { useContext } from 'react';
import navbarstyle from './navbar.module.css';

import logo from '../../images/freshcart-logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../../Context/AuthContext';
import { cartContext } from '../../Context/CartContext';
function Navbar() {
    const { token, setToken } = useContext(authContext);
    const navigate = useNavigate();
    const { numOfCartItems } = useContext(cartContext);
    console.log('the token in navbar is :', { token });
    function logout() {
        setToken(null);
        localStorage.removeItem('tkn');
        navigate('/login')
    }
    const { userData } = useContext(authContext);

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="fresh logo" />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {token ? <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link " aria-current="page" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Products">Products</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Categories">Categories</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Brands">Brands</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/wishlist">Wish list <span><i class="fa-solid fa-heart" style={{"color": "#f00000"}}></i></span></Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/AllOrders">All Orders</Link>
                            </li>



                        </ul> : ""}
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center ">

                            

                            {token ? <>
                                <li className="nav-item position-relative">
                                    <Link className="nav-link" to="/Cart"><span><i class="fa-solid fa-cart-shopping"></i></span></Link>
                                    <span class="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">
                                        {numOfCartItems ? numOfCartItems : ""}
                                        {/* {numOfCartItems??""} */}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <span style={{ "color": "green" }} className="nav-link fw-bold " >hi ,{userData.name}</span>
                                </li>
                               
                                <li className="nav-item">
                                    <span onClick={logout} role='button' className="nav-link fw-bold text-danger" >logout</span>
                                </li>
                            </> : <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>}




                        </ul>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
