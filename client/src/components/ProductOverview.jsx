import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductImages from './ProductImages.jsx';
import Styles from './ProductStyles.jsx';
import Cart from './Cart.jsx';
import ShadedStar from './ShadedStar.jsx'
import calcTotal from '../lib/totalCalc.jsx';
import calculateAverage from '../lib/averageCalc.jsx';
import Outfits from './Outfits.jsx';

const ProductOverview = ({ product, productID, clickTrack, seeReviewsClick, outfits, setOutfits }) => {
    const [styles, setStyles] = useState([]);
    const [style, setStyle] = useState({});
    const [images, setImages] = useState([]);
    const [image, setImage] = useState([]);
    const [skus, setSkus] = useState([]);
    const [currSku, setCurrSku] = useState({});
    const [size, setSize] = useState('');
    const [stock, setStock] = useState(0);
    //review stuff 
    const [stars, setStars] = useState(0);
    const [meta, setMeta] = useState({});
    const [total, setTotal] = useState(0);
    const [avg, setAvg] = useState(0);






    const getStyles = async () => {
        let options = {
            'url': '/styles',
            'params': { 'product_id': productID },
            'method': 'get'
        }

        await axios.request(options)
            .then((result) => {
                setStyles(result.data);
                setStyle(result.data[0]);
                setImages(result.data[0].photos)
                setImage(result.data[0].photos[0])
                setSkus(result.data[0].skus)
                setCurrSku(Object.keys(result.data[0].skus)[0]);
                setSize(result.data[0].skus[Object.keys(result.data[0].skus)[0]].size);
                setStock(result.data[0].skus[Object.keys(result.data[0].skus)[0]].quantity);

            })
            .catch((err) => {
                console.log('ErrgettingStyles', err);
            });
    }

    //will return sale info if item is on sale
    const onSale = () => {
        if (style.sale_price !== null) {
            return (
                <p>was: ${style.original_price} is: ${style.sale_price}</p>
            )
        } else {
            return (
                <p>${style.original_price}</p>
            )
        }
    }

    //render all the features
    const showFeatures = () => {
        if (product.features) {
            return product.features.map(ftr => {
                return `${ftr.feature}: ${ftr.value},  `
            })
        }
    }

    //will change style data when a style thumbnail is clicked
    const styleClick = (e) => {
        e.preventDefault();
        styles.forEach((indStyle) => {
            if (indStyle.style_id.toString() === e.target.id) {
                setStyle(indStyle);
                setImage(indStyle.photos[0]);
                setImages(indStyle.photos);
                setSkus(indStyle.skus);
            }
        })

    };

    //change the current image displayed when an image thumbnail is clicked
    const imageChange = (e) => {
        e.preventDefault();
        var imageIndex = images.indexOf(image);

        if(e.target.className === 'next-image') {
            if (imageIndex === images.length - 1) {
                setImage(images[0]);
            } else {
                setImage(images[imageIndex + 1]);
            }
        } else if (e.target.className === 'prev-image') {
            if (imageIndex === 0) {
                setImage(images.length - 1);
            } else {
                setImage(images[imageIndex - 1]);
            }
        }  else {
                images.forEach(img => {
                    if (img.thumbnail_url === e.target.src) {
                        setImage(img);
                    }
                })
            }
    }

    const cartSubmit = (e) => {
        // e.preventDefault();

        let options = {
            'url': '/cart',
            'params': {},
            'method': 'post'
        }

        axios.request(options)
            .then((result) => {
                alert('added to cart')
            })
            .catch((err) => {
                console.log('ErrgettingStyles', err);
            });
    }

    const getMeta = () => {
        axios.get(`/reviewsMeta/?product_id=${productID}`).then((result) => {
          setMeta(result.data);
          setTotal(calcTotal(result));
          setAvg(calculateAverage(calcTotal(result), result.data));
          setStars(((Math.round(calculateAverage(calcTotal(result), result.data) * 4) / 4).toFixed(2)));
        });
      }
    



    useEffect(() => {
        if (productID !== undefined) {
            getStyles()
        }
        getMeta();
    }, [productID, product])


    return (
        <div className="productOverview" onClick={(event) => {
            clickTrack('po', event);
        }}>


            <ProductImages images={images} image={image} imageChange={imageChange} />
            <div className='productDetails'>
                <h2>{product.name}</h2>

                <div onClick={seeReviewsClick} className='averageStars'>
                    <div className='OvAvg'>
                        {Math.round(avg * 100) / 100}
                    </div>
                    <div>
                        {'★'.repeat(Math.floor(stars))}
                    </div>
                    <ShadedStar shade={stars % 1} />
                    <div>
                        {'☆'.repeat(5 - Math.floor(stars))}
                        See all {total} Reviews
                    </div>
            </div>

                <p>{product.description}</p>
                {onSale()}
                <p>category:{product.category}</p>
                <p>features: {showFeatures()}</p>
                <div className='styles'>
                    <Styles style={style} styles={styles} styleClick={styleClick} />
                </div>
                <Cart product={product} outfits={outfits} setOutfits={setOutfits} cartSubmit={cartSubmit} skus={skus} currSku={currSku} size={size} stock={stock} setSize={setSize} setCurrSku={setCurrSku} setStock={setStock} />
            </div>
        </div>
    )

}
export default ProductOverview;


