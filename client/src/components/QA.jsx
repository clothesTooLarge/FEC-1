import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import QACard from './QACard.jsx';
import AddQuestion from './AddQuestion.jsx';
import AddAnswer from './AddAnswer.jsx';
import QASearchBar from './QASearchBar.jsx';
import getImagePath from '../lib/fileReader.js';
import missing from '../lib/filterMissing.js';

const QA = ({ id, product_name, clickTrack }) => {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [questionText, setQuestionText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [photos, setPhotos] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [moreQuestions, setMoreQuestions] = useState(false);
  const [search, setSearch] = useState('');

  async function fetchQuestions() {
    try {
      let options = {
        'url': '/questions',
        'params': {product_id: id}, //, //place the id prop here,
        'method': 'get'
      }
      let result = await axios.request(options);
      setQuestions(result.data);
    } catch(err) {
      console.log(err);
    }
  };

  useEffect((() => {
    fetchQuestions();
  }), [id]);

  const onSubmitQuestion = async (e) => {
    e.preventDefault();
    let body = {
      'question': questionText,
      'nickname': nickname,
      'email': email,
      'product_id': id
    }

    if (questionText === '' || nickname === '' || email === '') {
      alert(`You must enter the following: ${missing(body)}`);
      return;
    }

    try {
      await axios.post('/questions/add', body);
      alert(`Thank you for submitting your question: ${body.question}`);
      toggleShowQuestionModal();
      await fetchQuestions();
    } catch (err) {
      alert('Your question was not submitted due to some internal error. Please try again shortly');
    }
  };

  const onSubmitAnswer = async (e) => {
    e.preventDefault();
    let body = {
      'answer': answerText,
      'nickname': nickname,
      'email': email,
      'photos': photos,
      'question_id': question.question_id
    }
    console.log(photos);
    if (answerText === '' || nickname === '' || email === '') {
      alert(`You must enter the following: ${missing(body)}`);
      return;
    }

    try {
      await axios.post('/answer/add', body);
      alert(`Thank you for submitting your answer: ${body.answer}`);
      toggleShowAnswerModal();
      fetchQuestions();
    } catch (err) {
      alert('Your answer was not submitted due to some internal error. Please try again shortly');
    }
  };

  const onClickQuestionHelpful = async (e, id) => {
    await axios.put('/questions/helpful', {'question_id': id });
  };

  const onChangeQuestion = (e) => {
    setQuestionText(e.target.value);
  };

  const onChangeAnswer = (e) => {
    setAnswerText(e.target.value);
  };

  const onChangeNickname = (e) => {
    setNickname(e.target.value);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
  };

  const onInputPhoto = async (e) => {
    let photo = await getImagePath(e.target.files[0]);

    if (thumbnail === '') {setThumbnail(photo)};
    setPhotos([...photos, photo]);
  };

  const toggleShowQuestionModal =  (e) => {
    setShowQuestionModal(!showQuestionModal);
  };

  const toggleShowAnswerModal = (e, question, id) => {
    setShowAnswerModal(!showAnswerModal);
    setThumbnail('');
    setQuestion({'question_id': id, 'question': question});
  };

  const toggleMoreQuestions = (e) => {
    setMoreQuestions(!moreQuestions);
  };

  let sortedAndFilteredQuestions = [...questions].filter((question) => {
   return question.question_body.toLowerCase().includes(search.toLowerCase());
  })
  .sort((a, b) => {
    return b['question_helpfulness'] - a['question_helpfulness'];
  }).map((question) =>
      <QACard
        key={question.question_id}
        id={question.question_id}
        question={question.question_body}
        helpfulness={question.question_helpfulness}
        isHelpful={onClickQuestionHelpful}
        reported={question.reported}
        answers={question.answers}
        toggleShowAnswerModal={toggleShowAnswerModal}
      />
  );

  return (
    <>
      <div className='QA' onClick={(event) => {
            clickTrack('qa', event);
        }}>
        <h3>QUESTIONS & ANSWERS</h3>
        <QASearchBar onSearch={onSearch} search={search}/>
        <div className='QA-List'>
          {!moreQuestions ? sortedAndFilteredQuestions[0] : sortedAndFilteredQuestions}
          {!moreQuestions && sortedAndFilteredQuestions[1]}
        </div>
        <div className='QA-Buttons'>
          {moreQuestions && <button className='QA-More-Questions' onClick={toggleMoreQuestions}>Less Answered Questions</button>}
          {
          !moreQuestions && sortedAndFilteredQuestions.length > 2
          && <button className='QA-More-Questions' onClick={toggleMoreQuestions}>More Answered Questions</button>
          }
          <button className='QA-Ask-Question'onClick={toggleShowQuestionModal}>Ask a question</button>
        </div>
        {showQuestionModal && createPortal(
          <AddQuestion
            product_id={id}
            product_name={product_name}
            onChangeQuestion={onChangeQuestion}
            onChangeNickname={onChangeNickname}
            onChangeEmail={onChangeEmail}
            onSubmitQuestion={onSubmitQuestion}
            toggleShowQuestionModal={toggleShowQuestionModal}
          />
          ,document.body
        )}
        {/* Do I need product_id in Answer Modal */}
        {showAnswerModal && createPortal(
          <AddAnswer
            product_name={product_name}
            question_body={question.question}
            id={question.question_id}
            thumbnail={thumbnail}
            length={photos.length}
            onChangeAnswer={onChangeAnswer}
            onChangeNickname={onChangeNickname}
            onChangeEmail={onChangeEmail}
            onInputPhoto={onInputPhoto}
            onSubmitAnswer={onSubmitAnswer}
            toggleShowAnswerModal={toggleShowAnswerModal}
         />
         , document.body
        )}
      </div>
    </>
  );
}

export default QA