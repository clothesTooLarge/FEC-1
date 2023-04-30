import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = ({ product, outfits, setOutfits, cartSubmit, skus, currSku, size, stock, setSize, setCurrSku, setStock }) => {
    const [showSize, setShowSize] = useState('none');
    const [drop, setDrop] = useState([]);
    const [star, setStar] = useState('☆');
    const [qty, setQty] = useState(0);
    const [showQty, setShowQty] = useState('none');




    const removeOutfit = (e) => {
        var array = [...outfits]; // make a separate copy of the array
        for (var i = 0; i < array.length; i++) {
            if (array[i].id === product.id) {
                array.splice(i, 1);
                setOutfits(array);
                break;
            }
        }
    };

    const sizeDrop = (e) => {
        return (
            <div style={{ display: showSize }} className='sizeDrop'>
                {Object.keys(skus).map((key) => {
                    return (
                        <div id={key} key={Math.random() * 10000}>
                            <button id={key} value={skus[key].size} onClick={clickButtons} className='size-item'>{skus[key].size}</button>
                        </div>
                    )
                })}
            </div>
        )
    };



    const clickButtons = (e) => {
        console.log(e.target.value)
        if (e.target.className === 'QTY') {
            setShowQty('block');
        } else if (e.target.className === 'qty-item') {
            setShowQty('none');
            setQty(e.target.value);
        } else if (e.target.className === 'Size') {
            setShowSize('block');
        } else if (e.target.className === 'size-item') {
            setShowSize('none');
            setSize(e.target.value);
            setCurrSku(e.target.id);
            setStock(skus[e.target.id].quantity)
            console.log(skus[e.target.id].quantity);
        }
    }

    const addToCart = (e) => {
        let options = {
            'url': '/cart',
            'params': { 'sku_id': currSku },
            'method': 'post'
        }

        axios.request(options)
            .then((result) => {
                alert('Item in Cart')
                console.log("WE DID IT BOYS");
            })
            .catch((err) => {
                console.log('ErrorAddingToCart', err);
            });
    };


    useEffect(() => {
        var arr = [];
        for (var i = 0; i <= stock; i++) {
            arr.push(i);
        }
        setDrop(arr);

    }, [stock])



    if (stock === 0 || stock === null || skus[currSku] === undefined) {
        return (
            <h3>OUT OF STOCK</h3>
        )
    } else {
        return (
            <div className='CartButtons'>
                {/* <QTY  stock={stock} clickButtons={clickButtons} drop={drop}/> */}
                <div className='QTY'>

                    <button onClick={clickButtons} className='QTY'>Qty: {qty} </button>
                    <div style={{ display: showQty }} className='qtyDrop'>
                        {drop.map((num) => {
                            return (
                                <div key={Math.random() * 10000} className='qty-item'>
                                    <button value={num} onClick={clickButtons} className='qty-item'>{num}</button>
                                </div>
                            )
                        })}
                    </div>

                </div>
                <div className='sizeSelect'>
                    <button onClick={clickButtons} className='Size'>Size {size}</button>
                    <div >{sizeDrop()}</div>
                </div>

                <button onClick={addToCart} className='Add-to-Cart'>Add to Cart</button>

                <button className='Favorite' onClick={(e) => {
                    console.log(outfits)
                    if (!outfits.some(outfit => outfit.id === product.id)) {
                        setOutfits([...outfits, product]);
                        setStar('★');
                    } else {
                        removeOutfit(e);
                        setStar('☆');
                    }
                }}>{star}
                </button>
            </div>

        )

    }

}

export default Cart