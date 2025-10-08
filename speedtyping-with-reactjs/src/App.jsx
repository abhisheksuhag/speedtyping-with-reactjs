import React ,{ useEffect, useRef, useState } from "react";

const RANDOM_QUOTE_API_URL= "https://thequoteshub.com/api/random-quote";

function App() {
  const [quote ,setQuote] = useState("");
  const [input, setInput] = useState("")
  const [timer, setTimer] = useState("")
  const startTimeRef = useRef(null)
  const intervalRef = useRef(null)

  const getNewQuote = async(signal)=>{
    const res= await fetch(RANDOM_QUOTE_API_URL, {signal});
    const data = await res.json();
    setQuote(data.text);
    setInput("");
  };

  const startTimer = () => {
    setTimer(0);
    startTimeRef.current = Date.now();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  useEffect(()=>{
    const abortController = new AbortController()

    getNewQuote(abortController.signal);
    return ()=> {
      clearInterval(intervalRef.current);
    abortController.abort()}
  }, []);

  const handleInputChange = (e) =>{
    const value = e.target.value;
    if (input.length === 0 && value.length === 1) {
      startTimer();
    }
    setInput(value);

    if(value == quote){
      clearInterval(intervalRef.current);
    }
    }
return (
    <div className="max-w-3xl mx-auto font-sans p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">Speed Typing</h1>
      <div className="text-3xl font-extrabold text-yellow-400 text-center mb-1">Time: {timer}s</div>
      <div className="bg-yellow-400 rounded-lg p-6 shadow-md">
        <QuoteDisplay quote={quote} input={input} />
        <textarea
          value={input}
          onChange={handleInputChange}
          rows={5}
          className="w-full p-4 mt-4 rounded-md border-2 border-yellow-700 focus:border-yellow-900 bg-transparent text-black text-lg outline-none resize-none"
          autoFocus
          placeholder="Start typing the quote here..."
        />
      </div>
    </div>
  );
}

function QuoteDisplay({ quote, input }) {
  if (!quote) {
    return <div className="mb-4 text-xl leading-relaxed px-2 select-none">Loading...</div>;
  }

  return (
    <div className="mb-4 text-xl leading-relaxed px-2 select-none">
      {quote.split('').map((char, index) => {
        let colorClass = '';
        if (index < input.length) {
          colorClass = input[index] === char ? 'text-green-600' : 'text-red-600 underline';
        }
        return (
          <span key={index} className={colorClass}>
            {char}
          </span>
        );
      })}
    </div>
  );
}


export default App;
