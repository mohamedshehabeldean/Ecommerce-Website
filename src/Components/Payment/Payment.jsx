import axios from 'axios';
import { useFormik, validateYupSchema } from 'formik';
import React, { useContext } from 'react';
import * as Yup from 'yup';
import { cartContext } from './../../Context/CartContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';



const mySchema = Yup.object({
    city: Yup.string().required('city must be required').min(4, 'at least 4 char'),
    phone: Yup.string().required().matches(/^01[0125][0-9]{8}$/),
    details: Yup.string().required('details must be required').min(5)
})

function Payment() {

    const { cartId, getUserCart } = useContext(cartContext);
    const navigate = useNavigate();

    var obj = {
        city: '',
        phone: '',
        details: ''
    };

    function sub(value) {
        console.log("hello sabry", value);

    }

    const myFormik = useFormik({
        initialValues: obj,
        onSubmit: sub,
        validationSchema: mySchema

    });

    async function confirmCashPayment() {
        const boolFlag = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
            {
                "shippingAddress": {
                    "details": myFormik.values.details,
                    "phone": myFormik.values.phone,
                    "city": myFormik.values.city
                }
            }, {
            headers: {
                token: localStorage.getItem('tkn')
            }
        }
        ).then((res) => {
            console.log("response of cash payment :", res.data);
            getUserCart();
            setTimeout(() => {
                navigate('/products')
            }, 2000);
            return true;

        }).catch((err) => {
            console.log("error of cash payment:", err);
            return false
        });
        return boolFlag;
    }
    // console.log("cartId",cartId);
    
    async function confirmPayment() {
        const res = await confirmCashPayment();
        if (res) {
            toast.success("Payment completed successfully", { position: 'top-center', duration: 2000 })
        } else {
            toast.error("Error occurred...", { duration: 2000, position: 'top-center' })

        }

    }
    // *********************************
    async function confirmOnlinePayment() {
        const boolFlag = await axios.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}`,
            {
                "shippingAddress": {
                    "details": myFormik.values.details,
                    "phone": myFormik.values.phone,
                    "city": myFormik.values.city
                }
            }, {
            headers: {
                token: localStorage.getItem('tkn')
            },
            params:{
                url:"http://localhost:3000"//location.host
            }
        }
        ).then((res) => {
            console.log("response of cash payment :", res.data);
            // getUserCart();

            window.open(res.data.session.url,"_self");//open in the same page
            
            return true;

        }).catch((err) => {
            console.log("error of cash payment:", err);
            return false
        });
        return boolFlag;
    }

    async function confirmonlinPayment() {
        const res = await confirmOnlinePayment();
        // 
        

    }
    
    
    return <>
        <div className="w-50 m-auto py-3">
            <form onSubmit={myFormik.handleSubmit}>
                <label htmlFor="city">city</label>
                <input value={myFormik.values.city} onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} type="text" id='city' placeholder='city...' name='city' className='form-control mb-2' />
                {myFormik.errors.city && myFormik.touched.city ? <div className="alert alert-danger mt-2 p-2">{myFormik.errors.city}</div> : ''}

                <label htmlFor="city">phone</label>
                <input value={myFormik.values.phone} onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} type="tel" id='phone' placeholder='010*********' name='phone' className='form-control mb-2' />
                {myFormik.errors.phone && myFormik.touched.phone ? <div className="alert alert-danger mt-2 p-2">{myFormik.errors.phone}</div> : ''}

                <label htmlFor="details">details</label>
                <textarea value={myFormik.values.details} onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} type="text" id='details' placeholder='details...' name='details' className='form-control mb-2' >
                </textarea>
                {myFormik.errors.details && myFormik.touched.details ? <div className="alert alert-danger mt-2 p-2">{myFormik.errors.details}</div> : ''}
                <div className="row">

                <button disabled={myFormik.values.city.length==0||myFormik.values.phone.length==0||myFormik.values.details.length==0} onClick={confirmPayment} type='submit' className='col-md-5 btn btn-outline-primary m-auto d-block mt-3'>confirm cash payment</button>
                <button disabled={myFormik.values.city.length==0||myFormik.values.phone.length==0||myFormik.values.details.length==0} onClick={confirmonlinPayment}  type='submit' className='col-md-5 btn btn-outline-primary m-auto d-block mt-3 '>confirm online payment</button>
                </div>
            </form>


        </div>

    </>
}

export default Payment
