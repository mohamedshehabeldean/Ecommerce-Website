import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authContext } from './AuthContext';

export const wishlistContext = createContext();


function WishlistProvider({ children }) {

    // states
    const [allProducts, setallProducts] = useState(null);
    const { myToken } = useContext(authContext);


    // add product to wishlist
    async function addProductToWishlist(id) {
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/wishlist', {
                "productId": id

            }, {
                headers: {
                    token: localStorage.getItem('tkn')
                },
            });
            getUserWishlist();
            return data;
        }
        catch (e) {
            console.log(e);


        }

    }

    // get all products from wishlist

    async function getUserWishlist() {
        await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
            headers: {
                token: localStorage.getItem('tkn')
            },
        }).then((res) => {
            console.log("res of getUserCart:", res.data);
            // localStorage.setItem('cartOwner', res.data.data.cartOwner);
            // setCartId(res.data.data._id);
            setallProducts(res.data.data);
            // setNumOfCartItems(res.data.numOfCartItems);
            // settotalCartPrice(res.data.data.totalCartPrice);

        }
        ).catch((err) => console.log("err :", err)
        );
    }

    // delete cart from wishlist 

    async function deleteProductFromWishlist(id) {
        const boolflg = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${id}`, {
            headers: {
                token: localStorage.getItem('tkn')
            }
        }).then((res) => {
            console.log("res of delete :", res.data);
            // setNumOfCartItems(res.data.numOfCartItems);
            // settotalCartPrice(res.data.data.totalCartPrice);
            setallProducts(res.data.data.products);
            return true;
        }).catch((err) => {
            console.log("the error of delete :", err);
            return false;
        });
        return boolflg;
    };

    useEffect(() => {
        getUserWishlist()
    }, [myToken]);

    return <wishlistContext.Provider value={{
        allProducts,
        addProductToWishlist,
        getUserWishlist,
        deleteProductFromWishlist



    }}>

        {children}


    </wishlistContext.Provider>
}

export default WishlistProvider
