import axios from "axios";
import React from "react";
import {RotatingLines } from "react-loader-spinner";
import { useQuery } from "react-query";
import Slider from "react-slick";
import Categories from './../Categories/Categories';

export default function CategorySlider() {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
  };

  function getCategories() {
    return axios.get('https://ecommerce.routemisr.com/api/v1/categories');
  }

  const { data, isLoading, isFetching } = useQuery("getCategory", getCategories);
  console.log("data is ", data?.data.data);

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
  return (
    <Slider {...settings}>


      {data.data.data.map((category, idx) => <div key={idx}>
        <img style={{ height: "200px" }} className="w-100 mt-5" src={category.image} alt={category.name} />
        <h2 className="h5">{category.name}</h2>
      </div>)}
    </Slider>
  );
}