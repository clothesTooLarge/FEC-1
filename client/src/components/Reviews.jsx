import React, { useState, useEffect } from 'react';
import ReviewsList from './ReviewsList.jsx'
import ReviewsOverview from './ReviewsOverview.jsx'
import ReviewsNew from './ReviewsNew.jsx'
import axios from 'axios';
import calculateAverage from '../lib/averageCalc.jsx';
import calcTotal from '../lib/totalCalc.jsx';
import calcRel from '../lib/relevanceCalc.jsx';
import {differenceInSeconds} from 'date-fns';

const Reviews = (props) => {

  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(2);
  const [meta, setMeta] = useState({});
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [sort, setSort] = useState('relevance');
  const [filters, setFilters] = useState([]);

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
    //Need to add functionality to stop adding to count and remove the button once count
    // gets to max value which can be obtained in meta data
    setCount(total);
    sortReviews(sort);
  };

  const addHelpful = (id) => {
    axios.put(`/reviewsHelpful?reviewID=${id}`).then(() => {
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
      setAverage(calculateAverage(total, meta));
      getReviews({product_id: props.id, count: total});
    }
  }, [total, count]);

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


  return (
    <div className="reviews">
      <aside className="reviewsOver">
        {total > 0 ? <ReviewsOverview data={meta} total={total} average={average} filterFunc={filterByStar}/>
        : ''}
      </aside>
      <div className="reviewsList">
        <div className='flexrow'>
          <div className='totalDescript'>
            {total + ' reviews, sorted by '}
          </div>
          <select value={sort} onChange={changeSort} className='sortDrop'>
            <option value='relevance'>relevance</option>
            <option value='newest'>newest</option>
            <option value='helpfulness'>helpfulness</option>
          </select>
        </div>

        {reviews ? <ReviewsList reviews={reviews.slice(0, count)} moreFunc={addReviews} addHelpful={addHelpful} filters={filters}/>
        : ''}
      </div>
    </div>
  )
}

export default Reviews;