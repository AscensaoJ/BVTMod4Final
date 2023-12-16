import React, { useEffect, useState } from 'react';

// Screen once quiz is done
export default function FinalScore(props) {
    const [score, setScore] = useState(0);

    useEffect(() => {
        setScore((props.score[0] / props.score[1]) * 100);
    }, [])

    return (
        <div id='finalScore'>
           <h2>Final Score:</h2>
           {score < 12.5 && <h1 className='zeroOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 12.5 && score < 25 && <h1 className='oneOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 25 && score < 37.5 && <h1 className='twoOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 37.5 && score < 50 && <h1 className='threeOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 50 && score < 62.5 && <h1 className='fourOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 62.5 && score < 75 && <h1 className='fiveOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 75 && score < 87.5 && <h1 className='sixOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score >= 87.5 && score < 100 && <h1 className='sevenOfEight'>{props.score[0]}/{props.score[1]}</h1>}
           {score == 100 && <h1 className='eightOfEight'>{props.score[0]}/{props.score[1]}</h1>}
        </div>
    )
}