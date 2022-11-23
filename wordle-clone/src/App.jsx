import { useState, useEffect } from "react";
import "./App.css";
import { arrayOfWords } from "./data";
import Header from "./Header";

const API_URL = "https://api.frontendexpert.io/api/fe/wordle-words";
const WORD_LENGTH = 5;

function App() {
  const [solution, setSolution] = useState("table");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [trials, setTrials] = useState(0)

  useEffect(() => {
    console.log("useEffect just fired");
    const getWord = () => {
      const randomWord =
        arrayOfWords[Math.floor(Math.random() * arrayOfWords.length)];
      setSolution(randomWord.toLowerCase());
    };

    getWord();
  }, []);

  useEffect(() => {
    const handleType = (event) => {
      if (isGameOver) return;
      
      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      const isCorrect = solution === currentGuess;
      const newGuesses = [...guesses];

      if (event.key === "Enter") {
        console.log(trials)
        if (currentGuess.length !== 5) return;
        setTrials(prevTry => prevTry + 1)
        
        newGuesses[guesses.findIndex(val => val === null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");
        
        console.log(isCorrect, solution, currentGuess, newGuesses)

        if (isCorrect) {
          setIsGameOver(true);
          setTimeout(() => {
            alert('You have guessed correctly. Refresh to play again')
          }, 500)
        }

        isGameOver ? setTrials(0) : setTrials(prevTry => prevTry)

      }
      
      if (currentGuess.length >= 5) {
        console.log(guesses.length, guesses)
        return;
      }
      
      if (trials >= 6 && !isCorrect) {
        alert('Sorry you failed refresh to play again')
      }


      setCurrentGuess((oldGuess) => oldGuess + event.key);
    };
    window.addEventListener("keydown", handleType);

    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess, isGameOver, solution]);

  return (
    <>
    <Header />
    <div className="flex flex-col gap-2 justify-center items-center bg-black h-screen ">
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
          key={i}
          guess={isCurrentGuess ? currentGuess : guess ?? ""}
          isFinal={!isCurrentGuess && guess != null}
          solution={solution}
          />
          );
        })}
    </div>
        </>
  );
}

function Line({ guess, isFinal, solution }) {
  const tiles = [];
  // let className
  let classNames

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    // console.log(char, solution[i], guess)
    // className =
    //   `w-14 h-14 ${char ? 'border-white border-2' : 'border-gray-500'} transition-all border text-3xl text-transform: uppercase flex justify-center text-white font-semibold items-center`;

 classNames = [
      "w-14",
      "h-14",
      `${char ? "border-white border-2" : "border-gray-500"}`,
      "transition-all",
      "border",
      "text-3xl",
      "text-transform: uppercase",
      "flex",
      "justify-center",
      "text-white",
      "font-semibold",
      "items-center",
    ];

    // if (isFinal) {
    //   if (char === solution[i]) {
    //     // console.log(isFinal, 'true')
    //     className += `${' '} ${'bg-green-500'}`;
    //   } else if (solution.includes(char)) {
    //     className += `${' '} ${'bg-yellow-500'}`;
    //   } else {
    //     className += `${' '} ${'bg-red-600'}`;
    //   }
    // }

    if (isFinal) {
      if (char === solution[i]) classNames.push('bg-green-500')
      else if (solution.includes(char)) classNames.push('bg-yellow-500')
      else classNames.push('bg-red-600')
    }

    tiles.push(
      <div key={i} className={classNames.join(' ')}>
        {char}
      </div>
    );
  }
  return <div className="flex gap-2 text-white">
    {tiles}
    </div>;

}
export default App;
