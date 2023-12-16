import React, { useEffect } from 'react';
import categories from './categories.json';
import { useNavigate } from 'react-router-dom';

// Handles what category the user wants to play
export default function Categories(props) {
    const navigate = useNavigate();

    function chooseCat(value) {
        props.setCat(Object.getOwnPropertyDescriptor(categories, value).value); //Finds simple number identifier for category as used by OpenTDB
        props.setLoading(true);
        return navigate('/que');
    }

    // Resets quiz on load
    useEffect(() => {
        props.setCat(0);
        props.resetNum(0);
    }, [])

    return (
        <div id='category' className='btn-grp'>
            <p id='head'>Choose Category</p>
            <div className='quad'>
                <span className='pair'>
                    <button onClick={e => chooseCat(e.target.value)} value="general">General Knowledge</button>
                    <button onClick={e => chooseCat(e.target.value)} value="books">Books</button>
                </span>
                <span className='pair'>
                    <button onClick={e => chooseCat(e.target.value)} value="film">Film</button>
                    <button onClick={e => chooseCat(e.target.value)} value="music">Music</button>
                </span>
            </div>
            <div className='quad'>
                <span className='pair'>
                    <button onClick={e => chooseCat(e.target.value)} value="tv">Television</button>
                    <button onClick={e => chooseCat(e.target.value)} value="video games">Video Games</button>
                </span>
                <span className='pair'>
                    <button onClick={e => chooseCat(e.target.value)} value="science">Science &amp; Nature</button>
                    <button onClick={e => chooseCat(e.target.value)} value="computers">Computers</button>
                </span>
            </div>
            <div className='quad'>
                <span className='pair'>
                    <button onClick={e => chooseCat(e.target.value)} value="sports">Sports</button>
                    <button onClick={e => chooseCat(e.target.value)} value="geography">Geography</button>
                </span>
                <span className='pair'>
                    <button onClick={e => chooseCat(e.target.value)} value="history">History</button>
                    <button onClick={e => chooseCat(e.target.value)} value="anime">Anime &amp; Manga</button>
                </span>
            </div>
        </div>
    )
}