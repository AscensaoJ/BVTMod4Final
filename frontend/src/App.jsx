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
import Profile from './Profile.jsx';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { checkJWT, loadStats, updateUser } from './api/apiAuth.jsx';

function App() {
  const [login, setLogin] = useState(false);
  const [ques, setQues] = useState([]); // Holds raw quiz
  //const [token, setToken] = useState('');
  const [category, setCategory] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState([]);
  const [queNum, setQueNum] = useState(0);

  useEffect(() => {
    setStats();
    //getToken();
  }, []);

  // Fetches stored user's data on site load
  async function setStats() {
    if(localStorage.getItem('quizappjwt') != null){
      let res = await checkJWT();
        if (res === true){
          await loadStats();
          setLogin(true);
        } else {
          localStorage.removeItem('quizappjwt')
          alert('Username not found!');
        }
    } else {
      sessionStorage.setItem('quizapptotal', 0);
      sessionStorage.setItem('quizappcorrect', 0);
      sessionStorage.setItem('quizappuser', 'Guest');
    }
  }

  useEffect(() => {
    if(queNum >= 1) {
      getQuiz();
    }
  }, [queNum])

  // useEffect(() => {
  //   console.log(token);
  // }, [token])

  // Fetch quiz from OpenTDB
  function getQuiz() {
    let str = 'https://opentdb.com/api.php?amount=' + queNum + '&category=' + category + '&type=multiple'; //&token=' + token;
    fetch(str)
      .then((res) => res.json())
      .then(((data) => setQues(data.results)))
      .then(() => setLoading(false));
  }

  // Updates local user data. If logged in, updates database user data
  function updateUserData(correct, total) {
    setScore([correct, total]);
    const tot = Number(sessionStorage.getItem('quizapptotal')) + total;
    const cor = Number(sessionStorage.getItem('quizappcorrect')) + correct;
    sessionStorage.setItem('quizapptotal', tot);
    sessionStorage.setItem('quizappcorrect', cor);
    if(login) {
      updateUser(sessionStorage.getItem('quizappuser'), tot, cor)
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
        <Nav login={login} setLogin={setLogin}/>
        <Routes>
          <Route index element={<Categories setCat={setCategory} setLoading={setLoading} resetNum={setQueNum} />} />
          <Route path='/que' element={<QueSetup setNum={setQueNum} />} />
          <Route path='/login' element={<Login setLogin={setLogin} />} />
          <Route path='/login/register' element={<Register setLogin={setLogin} />} />
          <Route path='/quiz/loading' element={<Loading loading={loading} />} />
          <Route path='/quiz' element={<Quiz quiz={ques} isLoaded={!loading} updater={updateUserData} />} />
          <Route path='/final' element={<FinalScore score={score} />} />
          <Route path='/about' element={<About />} />
          <Route path='/profile' element={<Profile setLogin={setLogin} />} />
        </Routes>
      </Router>
      <Outlet />
    </>
  );
}

export default App;
