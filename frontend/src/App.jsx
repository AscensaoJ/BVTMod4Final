import { useState, useEffect } from 'react';
import Login from './Login.jsx';
import QueSetup from './QueSetup.jsx';
import Nav from './Nav.jsx';
import Categories from './Categories.jsx';
import Loading from './Loading.jsx';
import Quiz from './Quiz.jsx';
import FinalScore from './FinalScore.jsx';
import Register from './Register.jsx';
import About from './About.jsx';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { loadStats, updateUser } from './api/apiAuth.jsx';

function App() {
  const [page, setPage] = useState(0);
  const [setup, setSetup] = useState(0);
  const [ques, setQues] = useState([]); // Holds raw quiz
  //const [token, setToken] = useState('');
  const [category, setCategory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [final, setFinal] = useState(false);
  const [score, setScore] = useState([]);
  const [queNum, setQueNum] = useState(0);
  const [userData, setUserData] = useState({
    username: 'Guest',
    loggedIn: false,
    correct: 0,
    total: 0
  });

  useEffect(() => {
    if(localStorage.getItem('quizappjwt') != undefined){
      loadStats();
    }
    //getToken();
  }, []);

  useEffect(() => {
    if(queNum >= 1) {
      getQuiz();
    }
  }, [queNum]);

  // Fetch quiz from OpenTDB
  function getQuiz() {
    let str = 'https://opentdb.com/api.php?amount=' + queNum + '&category=' + category + '&type=multiple'; //&token=' + token;
    fetch(str)
      .then((res) => res.json())
      .then(((data) => setQues(data.results)))
      .then(() => setLoading(false));
    console.log(str);
  }

  function handler(value, source) {
    if(source == 'final') {
      setFinal(value);
    }
  }

  // Updates local user data. If logged in, updates database user data
  function updateUserData(correct, total) {

    setScore([correct, total]);
    const tot = userData.total + total;
    const cor = userData.correct +correct;
    setUserData(oldData => {
      return {
        ...oldData,
        correct: (oldData.correct + correct),
        total: (oldData.total + total)
      }
    });
    if(userData.loggedIn) {
      updateUser(userData.username, tot, cor)
    }
  }

  /* function getToken() {
    if(token != ''){
      fetch('https://opentdb.com/api_token.php?command=request')
        .then((res) => res.json())
        .then(data => setToken(data.token))  
    }
  } */

  return (
    <>
      <Router>
        <Nav page={page} userData={userData} setUserData={setUserData}/>
        <Routes>
          <Route index element={<Categories setLoading={setLoading} setCat={setCategory} resetNum={setQueNum} />} />
          <Route path='/que' element={<QueSetup setQueNum={setQueNum}/>} />
          <Route path='/login' element={<Login setUserData={setUserData} />} />
          <Route path='/login/register' element={<Register />} />
          <Route path='/quiz/loading' element={<Loading loading={loading} />} />
          <Route path='/quiz' element={<Quiz quiz={ques} isLoaded={!loading} setFinal={setFinal} updater={updateUserData} />} />
          <Route path='/final' element={<FinalScore score={score} />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Router>
      <Outlet />
    </>
  );
}

export default App;
