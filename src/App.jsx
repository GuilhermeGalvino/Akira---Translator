import { Box } from "@mui/material";
import React, { useState } from "react";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false; 
recognition.interimResults = false;

const languages = {
  "pt-BR": "Português",
  "en": "Inglês",
  "es": "Espanhol",
  "fr": "Francês",
  "de": "Alemão",
  "zh-CN":"Chinês",
  "it":"Italiano",
  "ru":"Russo",
  "ja": "Japonês"
};

const Translator = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("en");
  const [isConversing, setIsConversing] = useState(false);

  recognition.lang = sourceLang;

  const startListening = () => {
    recognition.start();
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      translateText(spokenText);
    };
  };

  const startConversation = () => {
    setIsConversing(true);
    recognition.continuous = true; 
    recognition.start();
    recognition.onresult = (event) => {
      const spokenText = event.results[event.results.length - 1][0].transcript;
      setText(spokenText);
      translateText(spokenText);
    };
  };

  const stopConversation = () => {
    setIsConversing(false);
    recognition.stop();
    recognition.continuous = false; 
  };

  const translateText = async (inputText) => {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURI(inputText)}`
    );
    const result = await response.json();
    setTranslatedText(result[0][0][0]);
  };

  const speakText = () => {
    if (translatedText) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      speechSynthesis.speak(utterance);
      setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh"
    >
      <div id = "div1" className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Akira Translator</h1>
        
        <div className="mb-4">
          <label className="mr-2">Idioma de origem:</label>
          <select 
            value={sourceLang} 
            onChange={(e) => setSourceLang(e.target.value)} 
            className="p-2 border rounded-lg"
          >
            <option value="auto">Detectar automaticamente</option>
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="mr-2">Idioma de Tradução:</label>
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)} 
            className="p-2 border rounded-lg"
          >
            {Object.entries(languages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={startListening}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          🎙️ Falar
        </button>
        
        <button
          onClick={startConversation}
          className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-600"
        >
          💬 Iniciar Conversa
        </button>

        <button
          onClick={stopConversation}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          🛑 Parar Conversa
        </button>
        
        <p className="mt-4 text-lg font-semibold">Texto reconhecido:</p>
        <p className="bg-white shadow-md p-4 rounded-lg w-80 text-center">{text}</p>
        
        <p className="mt-4 text-lg font-semibold">Tradução:</p>
        <p className="bg-white shadow-md p-4 rounded-lg w-80 text-center">{translatedText}</p>
        
        <button
          onClick={speakText}
          disabled={!translatedText || speaking}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400"
        >
          🔊 Ouvir Tradução
        </button>
      </div>
    </Box>
  );
};

export default Translator;
