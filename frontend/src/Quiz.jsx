import React, { useState, useEffect } from 'react';
import Question from './Question.jsx';
import Next from './Next.jsx';
import { useNavigate, useNavigation } from 'react-router-dom';
import Loading from './Loading.jsx';

// Quiz environment
export default function Quiz(props){
    const [queNum, setQueNum] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [gotCor, setGotCor] = useState(false);
    const [que, setQue] = useState('');
    const [answers, setAnswers] = useState([])
    const [corAns, setCorAns] = useState(0);
    const convert = document.getElementById('converter'); // Exists outside of root
    const [queNext, setQueNext] = useState(false);
    const navigate = useNavigate();

    // Convert HTML text to plaintext
    function convertHTML(str) {
        convert.innerHTML = str;
        return convert.innerText;
    }

    // Preps quiz
    useEffect(() => {
            setQueNum(0);
            setQue(convertHTML(props.quiz[queNum].question));
            answerSetup(props.quiz[queNum].incorrect_answers.slice());
    }, [props.isLoaded])

    function checkAnswer(value) {
        setQueNext(true);
        setQueNum(oldVal => ++oldVal);
        if(corAns == value) {
            setCorrect(oldVal => ++oldVal);
            setGotCor(true);
        }
    }

    // Handles end of quiz
    function finish() {
        props.updater(correct, props.quiz.length);
        return navigate('/final');
    }

    // Randomizes placement of answers
    function answerSetup(incorAns) {
        setAnswers([]);

        const arr = [];
        const arr2 = incorAns.slice();
        
        setCorAns(convertHTML(props.quiz[queNum].correct_answer));
        arr2.push(props.quiz[queNum].correct_answer)
        for(let i = 0; i < arr2.length; i++) {
            arr2[i] = convertHTML(arr2[i]);
        }
        const lens = arr2.length;
        const pos3 = arr2[3];
        for(let i = 0; i < lens; i++){
            let pos = Math.floor(Math.random() * (arr2.length));
            if(arr2[pos] === pos3){
                setCorAns(i);
            }
            arr.push(arr2[pos]);
            arr2.splice(pos, 1);
        }
        setAnswers(arr);
    }

    // Preps question for load
    function writeQuestion() {
        setQueNext(false);
        setGotCor(false);
        answerSetup(props.quiz[queNum].incorrect_answers.slice());
        setQue(convertHTML(props.quiz[queNum].question));
    }

    return (
        <>
            {props.isLoaded && !queNext && <Question question={que} answers={answers} checkAnswer={checkAnswer} />}
            {props.isLoaded && queNext && <Next nextQue={writeQuestion} question={que} answer={answers[corAns]} correct={gotCor} queNum={queNum} finish={finish} quiz={props.quiz}/>}
        </>
    );
}
