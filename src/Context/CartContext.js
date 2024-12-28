import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authContext } from './AuthContext';

export const cartContext = createContext()

function CartContextProvider({ children }) {

    // all states
    const [numOfCartItems, setNumOfCartItems] = useState(0);
    const [totalCartPrice, settotalCartPrice] = useState(0);
    const [allProducts, setallProducts] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [cartOwner, setCartOwner] = useState(null);
    const { myToken } = useContext(authContext);

    async function addProductToCart(id) {
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/cart', {
                "productId": id

            }, {
                headers: {
                    token: localStorage.getItem('tkn')
                },
            });
            getUserCart();
            return data;
        }
        catch (e) {
            console.log(e);


        }

    }

    async function getUserCart() {
        await axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
            headers: {
                token: localStorage.getItem('tkn')
            },
        }).then((res) => {
            console.log("resssssssss yaa", res.data);
            localStorage.setItem('cartOwner',res?.data.data.cartOwner);
            setCartId(res.data.data._id);
            setallProducts(res.data.data.products);
            setNumOfCartItems(res.data.numOfCartItems);
            settotalCartPrice(res.data.data.totalCartPrice);

        }
        ).catch((err) => console.log("err :", err)
        );
    }

    async function updateCount(id, newCount) {
        const boolFlag = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {

            "count": newCount


        }, {
            headers: {
                token: localStorage.getItem('tkn'),

            }
        }).then((res) => {
            console.log("res of updateCounter", res.data);
            setNumOfCartItems(res.data.numOfCartItems);
            settotalCartPrice(res.data.data.totalCartPrice);
            setallProducts(res.data.data.products);
            return true;
        }).catch((err) => { console.log("res of updateCounter",); return false; });
        return boolFlag;
    }

    async function deleteProduct(id) {
        const boolflg = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {
            headers: {
                token: localStorage.getItem('tkn')
            }
        }).then((res) => {
            console.log("res of delete :", res.data);
            setNumOfCartItems(res.data.numOfCartItems);
            settotalCartPrice(res.data.data.totalCartPrice);
            setallProducts(res.data.data.products);
            return true;
        }).catch((err) => {
            console.log("the error of delete :", err);
            return false;
        });
        return boolflg;
    };


    async function deleteAllItems() {
        const boolflg = await axios.delete('https://ecommerce.routemisr.com/api/v1/cart', {
            headers: {
                token: localStorage.getItem('tkn')
            }
        }).then((res) => {
            console.log("res of deleteAllProducts :", res.data);
            setNumOfCartItems(0);
            settotalCartPrice(0);
            setallProducts([]);
            return true;
        }).catch((err) => {
            console.log("the error of delete :", err);
            return false;
        });
        return boolflg;
    }


    

    useEffect(() => {
        getUserCart()
    }, [myToken]);

    return <cartContext.Provider value={{
        addProductToCart,
        numOfCartItems,
        totalCartPrice,
        allProducts,
        updateCount,
        deleteProduct,
        deleteAllItems,
        cartId,
        getUserCart,
        cartOwner
    }}>
        {children}

    </cartContext.Provider>
}

export default CartContextProvider;
