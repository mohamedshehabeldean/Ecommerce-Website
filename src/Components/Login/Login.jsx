import { useFormik, validateYupSchema } from 'formik';
import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../../Context/AuthContext';
import toast from 'react-hot-toast';




// const mySchema=Yup.object({
//     name:Yup.string().required('name must be required').min(4,'at least 3 char').max(8,'at most 8 char'),
//     email:Yup.string().email(),
//     password:Yup.string().required().min(6).max(12),
//     rePassword:Yup.string().required().min(6).max(12),
//     phone:Yup.string().required().matches(/^01[0125][0-9]{8}$/)
// })

function Login() {

    var obj = {
        email: '',
        password: ''
    };

    const [isLoading, setisLoading] = useState(false);
    const [isSuccess, setisSuccess] = useState(false);
    const [errorMessage, seterrorMessage] = useState(undefined);
    const navigate = useNavigate();
    const { setToken, getUserData } = useContext(authContext)

    async function sendUserData(userdata) {
        setisLoading(true);
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signin', userdata)
            // console.log("Token:", data.token);
            localStorage.setItem('tkn', data.token);
            setToken(data.token);
            // to get userdata from token when login
            getUserData();
            setisSuccess(true);
            setTimeout(function () { setisSuccess(false); navigate('/home') }, 2000);
            setisLoading(false);


        }
        catch (x) {
            console.log("in case fail", x.response?.data.message);
            seterrorMessage(x.response?.data.message);
            setTimeout(function () {
                seterrorMessage(undefined);

            }, 2000);
            setisLoading(false);



        }



    }
    function sub(value) {
        console.log("hello sabry", value);
        sendUserData(value);

    }


    const myFormik = useFormik({
        initialValues: obj,
        onSubmit: sub,
        validate: function (values) {
            const errors = {};

            if (!values.email.includes('@') || !values.email.includes('.')) {
                errors.email = "email must be in format";
            }
            if (values.password.length < 6 || values.password.length > 12) {
                errors.password = "password must be from 6 to 12 character";
            }

            console.log(errors);

            return errors;


        }
        // validationSchema:mySchema

    });


    // 
    useEffect(() => {
        if (isSuccess) {
            toast.success("Welcome back", { duration: 2000, position: 'top-center' });
        }
        if (errorMessage) {
            toast.error(`${errorMessage}`, { duration: 2000, position: 'top-center' });
        }
    }, [isSuccess, errorMessage]); // Triggers only when isSuccess or errorMessage changes


    return (
        <>


                <h2 className='m-5 text-dark fw-bold'>Login Now</h2>
            <div className="w-75 p-5 m-auto">

                <form onSubmit={myFormik.handleSubmit} >

                    <div className="input2 mt-2">
                        <label htmlFor="inp2">Email</label>
                        <input name='email' onChange={myFormik.handleChange} onBlur={myFormik.handleBlur} value={myFormik.values.email} type="email" id='inp2' className='form-control' placeholder='ex@gmail.com' />
                        {myFormik.errors.email && myFormik.touched.email ? <div className="alert alert-danger mt-2 p-2">{myFormik.errors.email}</div> : ''}

                    </div>
                    <div className="input3 mt-2">
                        <label htmlFor="inp3">Password</label>
                        <input name='password' onChange={myFormik.handleChange} onBlur={myFormik.handleBlur} value={myFormik.values.password} type="password" id='inp3' className='form-control' placeholder='********' />
                        {myFormik.errors.password && myFormik.touched.password ? <div className="alert alert-danger mt-2 p-2">{myFormik.errors.password}</div> : ''}

                    </div>

                    <div className="reg mt-2 d-flex justify-content-center ">
                        <button type='submit' className='bg-main btn text-white mt-4'>

                            {isLoading ? <ColorRing
                                visible={true}
                                height="30"
                                width="30"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                            /> : "Login"}


                        </button>

                    </div>



                </form>
            </div>
            <div class="text-center mt-2 d-flex justify-content-center ">
                <div style={{ "width": "25px", "height": "25px", "borderRadius": "12.5px", "border": "1px solid grey,", "fontSize": "17px", "fontWeight": "bold" }} className='text-dark me-2 '>
                    <p>i</p>
                </div>
                <p style={{ "textAlign": "center" }} class="mb-2">
                    Don't have an account?
                    <Link style={{ "fontSize": "17px" }} to="/register" class="text-decoration-none text-primary font-weight-bold ms-2">
                        Register Now
                    </Link>
                </p>
            </div>
            <div class="text-center mt-2 d-flex justify-content-center">
                <div style={{ "width": "25px", "height": "25px", "borderRadius": "12.5px", "border": "1px solid grey,", "fontSize": "17px", "fontWeight": "bold" }} className='text-dark me-2'>
                    i
                </div>
                <p class="mb-2">
                    <Link style={{ "fontSize": "17px" }} to="/forget" class="text-decoration-none text-primary font-weight-bold">
                        Forget password?
                    </Link>
                </p>
            </div>

        </>
    )
}

export default Login
