import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import {RotatingLines } from "react-loader-spinner";
import { useQuery } from "react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import { cartContext } from "../../Context/CartContext";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { easeInOut, motion } from "framer-motion";
import { wishlistContext } from "../../Context/wishlist";

function ProductDetails() {
    const { addProductToCart } = useContext(cartContext);
    const [allProducts, setAllProducts] = useState([]);
    const { addProductToWishlist, deleteProductFromWishlist } = useContext(wishlistContext); // Get context functions
    // Initialize wishlist state from localStorage on first load
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : {};
    });

    // Sync wishlist with localStorage when wishlist changes
    useEffect(() => {
        // Only sync if wishlist changes to avoid unnecessary writes
        if (Object.keys(wishlist).length) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist]);

    // Memoize toggleWishlist for performance optimization
    const toggleWishlist = useCallback((productId) => {
        setWishlist((prevWishlist) => {
            const updatedWishlist = { ...prevWishlist };

            if (updatedWishlist[productId]) {
                // Product exists in wishlist, remove it
                deleteProductFromWishlist(productId);
                delete updatedWishlist[productId];
                // toast.success("Product removed from wishlist.", { position: 'top-center', duration: 2000 });
            } else {
                // Product doesn't exist in wishlist, add it
                addProductToWishlist(productId);
                updatedWishlist[productId] = true; // Add to wishlist
                // toast.success("Product added to wishlist.", { position: 'top-center', duration: 2000 });
            }

            return updatedWishlist;
        });
    }, []);

    const { id } = useParams();

    // Function to add product to the cart
    const handleAddToCart = async (productId) => {
        const response = await addProductToCart(productId);
        if (response?.status === "success") {
            toast.success("Product added successfully to your cart", {
                duration: 2000,
                position: "top-center",
            });
        } else {
            toast.error("Error occurred while adding product to cart", {
                duration: 2000,
                position: "top-center",
            });
        }
    };

    const fetchProductDetails = () =>
        axios.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);

    // Fetch product details
    const { data, isLoading, isError } = useQuery(`getProductDetails-${id}`, fetchProductDetails);

    // Extract category ID when product details are available
    const categoryId = data?.data?.data?.category?._id;

    // Fetch related products based on category ID
    const fetchRelatedProducts = () =>
        axios.get(`https://ecommerce.routemisr.com/api/v1/products?category[_id]=${categoryId}`);

    const { data: relatedProductsData, isLoading: isRelatedProductsLoading } = useQuery(
        `getProductsByCategory-${id}`,
        fetchRelatedProducts,
        {
            enabled: !!categoryId, // Ensure this query only runs when categoryId is available
        }
    );

    // Extract related products from query response
    const relatedProducts = relatedProductsData?.data?.data;






    // Handle loading state
    if (isLoading) {
        return (
            <div className="d-flex vh-100  bg-opacity-50 justify-content-center align-items-center">
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
        );
    }

    // Handle error state
    if (isError || !data?.data?.data) {
        return <Navigate to="/products" />;
    }

    const productDetails = data.data.data;

    return (
        <>
            <Helmet>
                <title>{productDetails.title}</title>
            </Helmet>
            <div className="container">
                <div className="row align-items-center mt-3">
                    {/* Image Gallery Section */}
                    <ImageGallery images={productDetails.images} mainImage={productDetails.imageCover} />

                    {/* Product Details Section */}
                    <div className="col-md-8 col-sm-12">
                        <article>
                            <h1>{productDetails.title}</h1>
                            <p>{productDetails.description}</p>
                            <h4 className="h6 text-main">{productDetails.category.name}</h4>
                            <div className="d-flex justify-content-between">
                                {productDetails.priceAfterDiscount ? (
                                    <p>
                                        <del>{productDetails.price}</del> - {productDetails.priceAfterDiscount} EGP
                                    </p>
                                ) : (
                                    <p>{productDetails.price} EGP</p>
                                )}
                                <p>
                                    <span>
                                        <i
                                            style={{ color: "yellowgreen" }}
                                            className="fa-solid fa-star"
                                        ></i>
                                    </span>
                                    {productDetails.ratingsAverage}
                                </p>
                            </div>
                            <div
                                onClick={() => handleAddToCart(productDetails.id)}
                                className="btn bg-main text-white w-100"
                            >
                                <span>
                                    <i className="fa-solid fa-add fa-sm"></i>
                                </span>{" "}
                                Add to cart
                            </div>
                        </article>
                    </div>
                </div>
                <div className="row">
                    <div className="gy-5 mt-5">
                        <h4 className="mt-4 text-main fw-bold">Items that may interest you:</h4>
                    </div>

                </div>
                <div className="products row gy-3 mt-3">
                    {isRelatedProductsLoading ? (
                        <p>Loading related products...</p>
                    ) : (
                        relatedProducts?.map((product, idx) => (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.5, ease: easeInOut }}
                                key={idx}
                                className="col-lg-2 col-md-3 col-sm-4 col-6 overflow-hidden product"
                            >

                                <span
                                    role="button"
                                    onClick={() => toggleWishlist(product.id)}
                                    style={{ position: "relative", top: "4px", left: "80%" }}
                                >
                                    <i
                                        className="fa-solid fa-heart"
                                        style={{ color: wishlist[product.id] ? "#f00000" : "#808080" }}
                                    ></i>
                                </span>
                                <Link to={`/productdetails/${product.id}`}>
                                    <div
                                        style={{ height: "350px", display: "flex", flexDirection: "column" }}
                                        className="mt-3"
                                    >
                                        <img src={product.imageCover} alt="" className="w-100" />
                                        <h4 className="h6 text-main">{product.category.name}</h4>
                                        <h2 className="h5">
                                            {product.title.split(" ").slice(0, 2).join(" ")}
                                        </h2>
                                        <div className="d-flex justify-content-between">
                                            {product.priceAfterDiscount ? (
                                                <p>
                                                    <del>{product.price}</del> {product.priceAfterDiscount} EGP
                                                </p>
                                            ) : (
                                                <p>{product.price} EGP</p>
                                            )}
                                            <p>
                                                <span>
                                                    <i
                                                        style={{ color: "gold" }}
                                                        className="fa-solid fa-star"
                                                    ></i>
                                                </span>
                                                {product.ratingsAverage}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={() => handleAddToCart(product.id)}
                                    className="btn bg-main text-white m-auto d-block add"
                                >
                                    <span>
                                        <i className="fa-solid fa-cart-shopping"></i>
                                    </span>{" "}
                                    Add to cart
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>



            </div>
        </>
    );
}

// ImageGallery Component
const ImageGallery = ({ images, mainImage }) => {
    const [selectedImage, setSelectedImage] = useState(mainImage);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    return (
        <div className="col-md-4 col-sm-12">
            <img className="w-100 mb-3" src={selectedImage} alt="Selected product" />
            <div className="d-flex gap-1 mt-2">
                {images.map((image, index) => (
                    <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5, ease: easeInOut }}
                        role="button"
                        key={index}
                        onClick={() => handleImageClick(image)}
                        className="thumbnail"
                    >
                        <img
                            className="w-100"
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ProductDetails;
