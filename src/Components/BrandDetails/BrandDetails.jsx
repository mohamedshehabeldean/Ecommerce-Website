import axios from 'axios';
import React from 'react'
import {RotatingLines } from 'react-loader-spinner';
import { useQuery } from 'react-query';
import { Navigate, useParams } from 'react-router-dom';

function BrandDetails() {
    const { id } = useParams();



    function getBrandDetails() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/brands/${id}`);
    }
    const { data, isLoading, isError } = useQuery(`getBrandDetails-${id}`, getBrandDetails);
    // console.log(data?.data.data.name);

    if (isLoading) {
        return <div className="d-flex vh-100  bg-opacity-50 justify-content-center align-items-center">
            <RotatingLines
                visible={true}
                height="96"
                width="96"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    }
    if (isError) {
        return <Navigate to='/products' />
    }

    const BrandDetails = data?.data.data;

    return <>
        <div className='mt-5 container '>
            <div className="row justify-content-center">
                <div className="col-lg-3 col-md-6 col-sm-8 col-8">
                    <p style={{ "fontSize": "20px" }} className='text-center  fw-bold'>{BrandDetails.name}</p>
                    <img className='w-100' src={BrandDetails.image} alt={BrandDetails.name} />
                </div>
            </div>


        </div>

    </>
}

export default BrandDetails
