import React, { useEffect, useState, useRef } from "react";
import Particles from "@tsparticles/react";
import eatSound from "../assets/sounds/eat.mp3";
import gameOverSound from "../assets/sounds/gameover.mp3";
import bgMusic from "../assets/sounds/bgmusic.mp3";
const boardSize = 20;

const SnakeGame = () => {
  const [snake, setSnake] = useState([[8, 8]]);
  const [food, setFood] = useState([5, 5]);
  // const [powerFood, setPowerFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
  localStorage.getItem("highScore") || 0
);
const [floatingText, setFloatingText] = useState("");
const [time, setTime] = useState(0);
const [explode, setExplode] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [theme, setTheme] = useState("neon");
  const [speed, setSpeed] = useState(150);
  const [obstacles] = useState([
  [10, 10],
  [12, 12],
  [6, 15]
]);
  // Audio Refs
  const eatAudio = useRef(new Audio(eatSound));
  const gameOverAudio = useRef(new Audio(gameOverSound));
  const backgroundMusic = useRef(new Audio(bgMusic));

  backgroundMusic.current.loop = true;

  // Keyboard + Swipe Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection([-1, 0]);
          break;

        case "ArrowDown":
          setDirection([1, 0]);
          break;

        case "ArrowLeft":
          setDirection([0, -1]);
          break;

        case "ArrowRight":
          setDirection([0, 1]);
          break;

        case " ":
          setPaused((prev) => !prev);
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Swipe Controls
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;

      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          setDirection([0, 1]);
        } else {
          setDirection([0, -1]);
        }
      } else {
        if (dy > 0) {
          setDirection([1, 0]);
        } else {
          setDirection([-1, 0]);
        }
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Game Loop
  useEffect(() => {
    if (!started || paused || gameOver) return;

    const moveSnake = setInterval(() => {
      updateSnake();
    }, speed);

    return () => clearInterval(moveSnake);
  });

  useEffect(() => {

  if (!started || paused || gameOver) return;

  const timer = setInterval(() => {

    setTime((prev) => prev + 1);

  }, 1000);

  return () => clearInterval(timer);

}, [started, paused, gameOver]);

  // Update Snake
  const updateSnake = () => {
    const newSnake = [...snake];

    const head = [
      newSnake[newSnake.length - 1][0] + direction[0],
      newSnake[newSnake.length - 1][1] + direction[1]
    ];

    // Wall Collision
    if (
      head[0] < 0 ||
      head[0] >= boardSize ||
      head[1] < 0 ||
      head[1] >= boardSize
    ) {
      endGame();
      return;
    }

    // Self Collision
    for (let segment of snake) {
      if (
        segment[0] === head[0] &&
        segment[1] === head[1]
      ) {
        endGame();
        return;
      }
    }

    newSnake.push(head);

    // Obstacle Collision
for (let obstacle of obstacles) {
  if (
    obstacle[0] === head[0] &&
    obstacle[1] === head[1]
  ) {
    endGame();
    return;
  }
}

    // Eat Food
if (head[0] === food[0] && head[1] === food[1]) {

  eatAudio.current.currentTime = 0;
  eatAudio.current.play();
  setFloatingText("+1");

setTimeout(() => {
  setFloatingText("");
}, 800);
  setFloatingText("+1");

setTimeout(() => {
  setFloatingText("");
}, 800);

  setFood([
    Math.floor(Math.random() * boardSize),
    Math.floor(Math.random() * boardSize)
  ]);

  setScore((prev) => {

  const newScore = prev + 1;

  if (newScore > highScore) {

    setHighScore(newScore);

    localStorage.setItem(
      "highScore",
      newScore
    );
  }

  return newScore;
});

} else {
  newSnake.shift();
}


setSnake(newSnake);
  };

  // End Game
  const endGame = () => {
    
    setGameOver(true);
    setExplode(true);

setTimeout(() => {
  setExplode(false);
}, 700);

    gameOverAudio.current.play();

    backgroundMusic.current.pause();
  };

  // Restart Game
  const restartGame = () => {
    setTime(0);
    setSnake([[8, 8]]);
    setFood([5, 5]);
    setDirection([0, 1]);
    setGameOver(false);
    setScore(0);
    setPaused(false);
    setStarted(true);

    backgroundMusic.current.currentTime = 0;
    backgroundMusic.current.play();
  };

  // Start Game
  const startGame = () => {
    setStarted(true);

    backgroundMusic.current.play();
  };

  // Mobile Buttons
  const moveUp = () => setDirection([-1, 0]);
  const moveDown = () => setDirection([1, 0]);
  const moveLeft = () => setDirection([0, -1]);
  const moveRight = () => setDirection([0, 1]);

  return (
  <div className={`container ${theme} ${explode ? "explode" : ""}`}>

    <Particles
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },

        fpsLimit: 60,

        particles: {
          color: {
            value: "#38bdf8",
          },

          links: {
            color: "#38bdf8",
            distance: 150,
            enable: true,
            opacity: 0.3,
            width: 1,
          },

          move: {
            enable: true,
            speed: 2,
          },

          number: {
            value: 40,
          },

          opacity: {
            value: 0.5,
          },

          size: {
            value: { min: 1, max: 5 },
          },
        },
      }}

      className="particles"
    />

    {!started ? (

      <div className="start-screen">

        <h1 className="title">
          🐍 Snake Arena
        </h1>

        <div className="top-controls">

          

          <div className="theme-buttons">

            <button onClick={() => setTheme("neon")}>
              Neon
            </button>

            <button onClick={() => setTheme("retro")}>
              Retro
            </button>

            <button onClick={() => setTheme("cyber")}>
              Cyber
            </button>

            <button onClick={() => setTheme("red")}>
              Red
            </button>

          </div>

        </div>

        <button
          className="start-btn"
          onClick={startGame}
        >
          ▶ Start Game
        </button>

      </div>

    ) : (

      <>

        <div className="score-board">

          {floatingText && (
            <div className="floating-score">
              {floatingText}
            </div>
          )}

          <h2>Score: {score}</h2>

          <h2>🏆 High Score: {highScore}</h2>

          <h2>⏳ Time: {time}s</h2>

        </div>

        <div className="board">

          {Array.from({ length: boardSize }).map((_, row) =>

            Array.from({ length: boardSize }).map((_, col) => {

              const isSnake = snake.some(
                (segment) =>
                  segment[0] === row &&
                  segment[1] === col
              );

              const isObstacle = obstacles.some(
                (obstacle) =>
                  obstacle[0] === row &&
                  obstacle[1] === col
              );

              const isFood =
                food[0] === row &&
                food[1] === col;

              return (
                <div
                  key={`${row}-${col}`}
                  className={`cell
                  ${isSnake ? "snake" : ""}
                  ${isFood ? "food" : ""}
                  ${isObstacle ? "obstacle" : ""}
                  `}
                ></div>
              );
            })

          )}

        </div>

        <div className="pause-buttons">

          <button
            onClick={() => setPaused(!paused)}
          >
            {paused ? "▶ Resume" : "⏸ Pause"}
          </button>

        </div>

        <div className="mobile-controls">

          <button onClick={moveUp}>⬆️</button>

          <div className="middle-buttons">
            <button onClick={moveLeft}>⬅️</button>
            <button onClick={moveRight}>➡️</button>
          </div>

          <button onClick={moveDown}>⬇️</button>

        </div>

        {paused && (
          <h2 className="pause-text">
            ⏸️ Paused
          </h2>
        )}

        {gameOver && (
          <div className="game-over">

            <h2>💀 Game Over</h2>

            <button onClick={restartGame}>
              Restart
            </button>

          </div>
        )}

      </>
    )}

  </div>
);
};
export default SnakeGame;