import { useFormik, validateYupSchema } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { ColorRing } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';




const mySchema = Yup.object({
    name: Yup.string().required('name must be required').min(4, 'at least 3 char').max(8, 'at most 8 char'),
    email: Yup.string().email(),
    password: Yup.string().required().min(6).max(12),
    rePassword: Yup.string().oneOf([Yup.ref("password")]),
    phone: Yup.string().required().matches(/^01[0125][0-9]{8}$/)
})

function Register() {

    var obj = {
        name: '',
        email: '',
        password: '',
        rePassword: '',
        phone: ''
    };

    const [isLoading, setisLoading] = useState(false);
    const [isSuccess, setisSuccess] = useState(false);
    const [errorMessage, seterrorMessage] = useState(undefined);
    const navigate = useNavigate();

    async function sendUserData(userdata) {
        setisLoading(true);
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/auth/signup', userdata)
            console.log(data);
            setisSuccess(true);
            setTimeout(function () { setisSuccess(false); navigate('/login') }, 2000);
            setisLoading(false);


        }
        catch (x) {
            console.log("in case fail", x.response.data.message);
            seterrorMessage(x.response.data.message);
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
            const nameregex = /^[A-Z][a-z]{3,7}$/;
            const phoneregex = /^01[0125][0-9]{8}$/;
            if (nameregex.test(values.name) === false) {
                errors.name = "the name must be from 4 to 8 char and must start with capital letter "
            }
            if (!values.email.includes('@') || !values.email.includes('.')) {
                errors.email = "email must be in format";
            }

            if (phoneregex.test(values.phone) === false) {
                errors.phone = "phone must be an egyptian number ";
            }
            if (values.password.length < 6 || values.password.length > 12) {
                errors.password = "password must be from 6 to 12 character";
            }
            if (values.rePassword !== values.password) {
                errors.rePassword = "password and rePassword doesn't match";
            }
            console.log(errors);

            return errors;


        }
        // validationSchema:mySchema

    });
    useEffect(() => {
        if (isSuccess) {
            toast.success("Congratulations, your account has been successfully created", { duration: 2000, position: 'top-center' });
        }
        if (errorMessage) {
            toast.error(`${errorMessage}`, { duration: 2000, position: 'top-center' });
        }
    }, [isSuccess, errorMessage]); // Triggers only when isSuccess or errorMessage changes


    return (
        <>

            <h2 className='ms-5 mt-5 mb-4 text-dark fw-bold'>Register Now</h2>

            <div className="w-75 p-5 m-auto">
                {/* {isSuccess ? toast.success("Congratulations, your account has been successfully created", { duration: 2000, position: 'top-center' })
                    : ""}
                {errorMessage ? toast.error(`${errorMessage}`, { duration: 2000, position: 'top-center' })
                    : ""} */}
                <form onSubmit={myFormik.handleSubmit} >
                    <div className="input1">
                        <label htmlFor="inp1">First name</label>
                        <input name='name' value={myFormik.values.name} onBlur={myFormik.handleBlur} onChange={myFormik.handleChange} type="text" id='inp1' className='form-control' placeholder='name' />
                        {myFormik.errors.name && myFormik.touched.name ? <div style={{ "fontSize": "17px", "fontWeight": "500" }} className="text-danger pl-2  ">{myFormik.errors.name}</div> : ''}
                    </div>
                    <div className="input2 mt-2">
                        <label htmlFor="inp2">Email</label>
                        <input name='email' onChange={myFormik.handleChange} onBlur={myFormik.handleBlur} value={myFormik.values.email} type="email" id='inp2' className='form-control' placeholder='ex@gmail.com' />
                        {myFormik.errors.email && myFormik.touched.email ? <div style={{ "fontSize": "17px", "fontWeight": "500" }} className="text-danger pl-2  ">{myFormik.errors.email}</div> : ''}

                    </div>
                    <div className="input3 mt-2">
                        <label htmlFor="inp3">Password</label>
                        <input name='password' onChange={myFormik.handleChange} onBlur={myFormik.handleBlur} value={myFormik.values.password} type="password" id='inp3' className='form-control' placeholder='********' />
                        {myFormik.errors.password && myFormik.touched.password ? <div style={{ "fontSize": "17px", "fontWeight": "500" }} className="text-danger pl-2  ">{myFormik.errors.password}</div> : ''}

                    </div>
                    <div className="input4 mt-2">
                        <label htmlFor="inp4">Repassword</label>
                        <input name='rePassword' onChange={myFormik.handleChange} onBlur={myFormik.handleBlur} value={myFormik.values.rePassword} type="password" id='inp4' className='form-control' placeholder='********' />
                        {myFormik.errors.rePassword && myFormik.touched.rePassword ? <div style={{ "fontSize": "17px", "fontWeight": "500" }} className="text-danger pl-2  ">{myFormik.errors.rePassword}</div> : ''}

                    </div>
                    <div className="input5 mt-2">
                        <label htmlFor="inp5">Phone numuber</label>
                        <input name='phone' onChange={myFormik.handleChange} onBlur={myFormik.handleBlur} value={myFormik.values.phone} type="tel" id='inp5' className='form-control' placeholder='010********' />
                        {myFormik.errors.phone && myFormik.touched.phone ? <div style={{ "fontSize": "17px", "fontWeight": "500" }} className="text-danger pl-2  ">{myFormik.errors.phone}</div> : ''}

                    </div>
                    <div className="reg mt-2 d-flex justify-content-end">
                        <button type='submit' className='bg-main btn text-white'>

                            {isLoading ? <ColorRing
                                visible={true}
                                height="30"
                                width="30"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                            /> : "Register"}


                        </button>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Register
