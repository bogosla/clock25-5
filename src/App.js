import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import './App.css';




const App = () => {
    const [running, setRunning] = useState(false);
    const [breakLength, setBreakLength] = useState(5);
    const [sessionLength, setSessionLength] = useState(25);
    const [sessionBreak, setSessionBreak] = useState(true);
    const [timeLeft, setTimeLeft] = useState(25 * 60);

    const idRef = useRef(0);
    const audioRef = useRef();


    useEffect(() => {
        if (running) idRef.current = setInterval(() => updateTime(), 1000);
        return () => clearInterval(idRef.current);
    }, [running, timeLeft]);


    const startStopHandler = () => {
        if (!running)
            setRunning(true);
        else
            setRunning(false);
    };

    const formatToTime = (v) => {
        let min = parseInt(v / 60);
        let sec = parseInt(v % 60);
        if (min < 10) min = "0" + min;
        if (sec < 10) sec = "0" + sec;
        return min + ":" + sec;
    };

    const updateTime = () => {
        setTimeLeft(old => Math.max(0, old - 1));
        console.log(sessionBreak, breakLength);
        if (timeLeft === 0) {
            setSessionBreak(old => {
                let newSB = !old;
                let currentTime = newSB? sessionLength : breakLength;
                setTimeLeft(currentTime * 60);
                audioRef.current.play();
                return newSB;
            });
        }
    };

    const resetHandler = (ev) => {
        setRunning(false);
        setBreakLength(5);
        setSessionLength(25);
        setTimeLeft(25 * 60);
        setSessionBreak(true);
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
    };

    const decrementHandler = (t) => {
        if (running) return;
        if (t === "break")
            setBreakLength(old => Math.max(1, old - 1));
        else
            setSessionLength(old => {
                let curr = Math.max(1, old - 1)
                setTimeLeft(curr * 60);
                return curr;
            });
    };

    const incrementHandler = (t) => {
        if (running) return;
        if (t === "break")
            setBreakLength(old => Math.min(60, old + 1));
        else
            setSessionLength(old => {
                let curr = Math.min(60, old + 1)
                setTimeLeft(curr * 60);
                return curr;
            });
    };

  return (
    <>
    <header>
        <h1>5 + 5 Clock</h1>
    </header>

    <main>
        <div className="set">
            <div>
                <div>
                    <h3 id="break-label">Break Length</h3>
                    <div>
                        <button id="break-increment" onClick={ev => incrementHandler("break")}>+</button>
                        <button id="break-decrement" onClick={ev => decrementHandler("break")}>-</button>
                    </div>
                </div>
                <p id="break-length">{breakLength}</p>
            </div>

            <div>
                <h4 id="timer-label">{sessionBreak ? "Session" : "Break"}</h4>
                <span id="time-left">{formatToTime(timeLeft)}</span>
            </div>


            <div>
                <div >
                    <h3 id="session-label">Session Length</h3>
                    <div>
                        <button id="session-increment" onClick={ev => incrementHandler("session")}>+</button>
                        <button id="session-decrement" onClick={ev => decrementHandler("session")}>-</button>
                    </div>
                </div>
                <p id="session-length">{sessionLength}</p>
            </div>
        </div>

        <div className="controls">
            <button id="start_stop" onClick={startStopHandler}>Start / Stop</button>
            <button id="reset" onClick={resetHandler}>Reset</button>
        </div>
        <audio id="beep" src="https://dl.sndup.net/mvtx/negative_beeps-6008.mp3" ref={audioRef} />
    </main>
    </>
  );
};


export default App;
