import {useEffect, useState} from "react";
import "./styles.css"

const  API_URL = 'https://api.frontendexpert.io/api/fe/wordle-words'
const WORD_LENGTH = 5


export default function App() {
  const [solution, setSolution] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(null))
  const [currntGuess, setcurrntGuess] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
 
  useEffect(()=>{
    const handleType = (event) => {
      if (isGameOver) {
        return;
      }

      if (event.key === 'Enter') {
        if (currntGuess.length !== 5) {
          return;
        }
        const newGuesses = [...guesses]
        newGuesses[guesses.findIndex(val=>val == null)]=currntGuess;
        setGuesses(newGuesses)
        setcurrntGuess('')

        const isCorrect = solution === currntGuess
        if (isCorrect) {
           setIsGameOver(true)
        }
      }

      if (event.key === 'Backspace') {
        setcurrntGuess(currntGuess.slice(0,-1));
        return;
      }


      if (currntGuess.length >=5 ) {
        return;
      }


      setcurrntGuess(oldGuess => oldGuess +event.key)
      // setcurrntGuess(currntGuess+event.key)
    }
    window.addEventListener('keydown', handleType)
    return () => window.removeEventListener('keydown', handleType)
  },[currntGuess, isGameOver, solution, guesses])


  useEffect(()=> {
    const fetchWord = async () => {
      const response = await fetch(API_URL)
      const words = await response.json()
      const randWord = words[Math.floor(Math.random()*words.length)]
      setSolution(randWord)
      console.log(randWord)
    };

    fetchWord();
    // setSolution("hello")
  },[]);

  return (
    <div className="App">
      {
        guesses.map((guess,i) => {
          const isCurrentGuess = i === guesses.findIndex(val => val == null)
          return (
            <Line 
            guess={isCurrentGuess ? currntGuess : guess ?? ""} 
            isFinal={!isCurrentGuess && guess != null}
            solution={solution}
            />
          )
        })
      }
    </div>
  )
}

function Line({guess, isFinal,solution}) {
  const tiles = []

  for (let i = 0;i<WORD_LENGTH;i++) {
    const char = guess[i]
    let className = 'tile'

    if (isFinal) {
      if (char === solution[i]) {
        className +=' correct';
      } else if (solution.includes(char)) {
        className +=' close'
      } else {
        className += ' incorrect'
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    )
  }


  return <div className="line">{tiles}</div>
}
