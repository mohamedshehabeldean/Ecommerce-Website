import axios from 'axios';
import React from 'react'
import { Helmet } from 'react-helmet';
import {RotatingLines } from 'react-loader-spinner';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

function Brands() {

    async function getAllBrands() {
        return await axios.get('https://ecommerce.routemisr.com/api/v1/brands');
    }
    const x = useQuery('getAllBrands', getAllBrands, {});
    const Brands = x?.data?.data.data;
    console.log("data of Brands", Brands);

    if (x?.isLoading) {
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

    return <>

        <Helmet>
            <title>Brands</title>
        </Helmet>

        <div className="container">
            <div className="row mt-3 gy-5">
                {Brands.map((brand, idx) => {

                    return <div className="col-lg-2 col-md-3 col-sm-4 col-6">
                        <Link className='' to={`/branddetails/${brand._id}`}>

                            <div style={{ "height": "150px" }} className="brand">
                                <img className='w-100 h-100' src={brand.image} alt={brand.name} />
                            </div>
                        </Link>
                    </div>
                })}

            </div>
        </div>
    </>
}

export default Brands
