import React, { useState, useEffect, forwardRef } from 'react';
import ReviewsList from './ReviewsList.jsx'
import ReviewsOverview from './ReviewsOverview.jsx'
import ReviewsNew from './ReviewsNew.jsx'
import axios from 'axios';
import calculateAverage from '../lib/averageCalc.jsx';
import calcTotal from '../lib/totalCalc.jsx';
import calcRel from '../lib/relevanceCalc.jsx';
import {differenceInSeconds} from 'date-fns';

const Reviews = (props, ref) => {

  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(2);
  const [meta, setMeta] = useState({});
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [sort, setSort] = useState('relevance');
  const [filters, setFilters] = useState([]);
  const [showMore, setMore] = useState(true);
  const [adding, setAdding] = useState(false);
  const [keyword, setKeyword] = useState('');

  const currentDate = new Date();

  const options = [
    { value: 'relevance', label: 'relevance' },
    { value: 'helpfulness', label: 'helpfulness' },
    { value: 'newest', label: 'newest' }
  ]

  const getReviews = (params) => {

    let options = {
      'url': '/reviews',
      'params': params,
      'method': 'get'
    }

    axios.request(options).then((result) => {
      setReviews(result.data.results);
    })
    .catch(err => {
      console.log('error getting reviews: ', err);
    });

  };


  const getMeta = () => {
    axios.get(`/reviewsMeta/?product_id=${props.id}`).then((result) => {
      setMeta(result.data);
      setTotal(calcTotal(result));
    });
  }

  const addReviews = () => {
    setCount(total);

    setMore(false);
  };

  const addHelpful = (id) => {
    axios.put(`/reviewsHelpful?reviewID=${id}`).then(() => {
      getReviews({product_id: props.id, count, sort});
    });
  }

  const reportReview = (id) => {
    axios.put(`/reviewsReport?reviewID=${id}`).then(() => {
      getReviews({product_id: props.id, count, sort});
    });
  }

  const changeSort = (event) => {
    setSort(event.target.value);
    sortReviews(event.target.value);
  };

  const filterByStar = (star) => {
    addReviews();
    if (filters.includes(Number(star))) {
      setFilters((prevFilters) => {
        var newFilters = [...prevFilters];
        newFilters.splice(newFilters.indexOf(Number(star)), 1);
        return newFilters;
      });
    } else {
      setFilters((prevFilters) => {
        var newFilters = [...prevFilters];
        newFilters.push(Number(star));
        return newFilters;
      });
    }
  }

  useEffect(() => {
    if (props.id) {
      getMeta(props.id);
    }
  }, [props.id]);

  useEffect(() => {
    if (props.id) {
      if (total < 3) {
        setMore(false);
      }
      setAverage(calculateAverage(total, meta));
      getReviews({product_id: props.id, count: total});
    }
  }, [total]);

  useEffect(() => {
    props.setAv(average);
  }, [average]);


  const sortReviews = (s) => {

    if (s === 'relevance') {
      setReviews(reviews.sort((a, b) => {
        const [aVal, bVal] = calcRel(a, b);
        if (aVal < bVal) {
          return 1;
        } else if (aVal > bVal) {
          return -1;
        } else {
          return 0;
        }
      }));
    } else if (s === 'newest') {
      setReviews(reviews.sort((a, b) => {
        var first = differenceInSeconds(currentDate, new Date(a.date));
        var second = differenceInSeconds(currentDate, new Date(b.date));
        if (first > second) {
          return 1;
        } else if (first < second) {
          return -1;
        } else {
          return 0;
        }
      }));
    } else if (s === 'helpfulness') {
      setReviews(reviews.sort((a, b) => {
        if (a.helpfulness < b.helpfulness) {
          return 1;
        } else if (a.helpfulness > b.helpfulness) {
          return -1;
        } else {
          return 0;
        }
      }));
    }
  }

  const addReview = () => {
    setAdding(true);
  }

  const doneAdding = () => {
    setAdding(false);
    axios.post('/deleteImages').then(() => {
      console.log('Images folder emptied');
    }).catch(() => {
      console.log('Error deleting images');
    })
  }


  return (
    <div ref={ref} className="reviews" onClick={(event) => {
      props.clickTrack('re', event);
    }}>
      <aside className="reviewsOver">
        {total > 0 ? <ReviewsOverview data={meta} total={total} average={average} filterFunc={filterByStar}/>
        : ''}
      </aside>
      {!adding ?
        <div>
          <div className='flexcolumn'>
            <div className='totalDescript'>
              <div className='flexrow'>
                {total + ' reviews, sorted by '}
                <select value={sort} onChange={changeSort} className='sortDrop'>
                  <option value='relevance'>relevance</option>
                  <option value='newest'>newest</option>
                  <option value='helpfulness'>helpfulness</option>
                </select>
              </div>
            </div>
            <div className="reviewsList">

              {reviews ? <ReviewsList reviews={reviews.slice(0, count)} moreFunc={addReviews} addHelpful={addHelpful} reportFunc={reportReview} filters={filters} keyFilter={keyword} showMore={showMore}/>
              : ''}
            </div>
          </div>

        </div>

        : <ReviewsNew name={props.name} id={props.id} chars={meta.characteristics} finished={doneAdding}/>}
        <div className='flexcolumn'>
          {!adding ?
            <button className='addReviewBtn' onClick={addReview}>
              Add a Review +
            </button>
            : <></>}
          <label className='searchReviews flexrow'>
            Search Reviews
            <input style={{marginLeft: '3px', height: '10px'}} type='text' onChange={(event) => {setKeyword(event.target.value.toLowerCase())}}>
            </input>
          </label>
        </div>

    </div>
  )
}

export default forwardRef(Reviews);
