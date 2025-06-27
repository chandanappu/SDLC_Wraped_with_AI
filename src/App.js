import React, { useState, useEffect } from "react";
import { HiOutlineClipboardList } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";
import "./App.css";

export default function App() {
  const [screen, setScreen] = useState("calculator");
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(24); // Default font size
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("calc-history");
    return saved ? JSON.parse(saved) : [];
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem("calc-history", JSON.stringify(history));
  }, [history]);

  const renderScreen = () => {
    switch (screen) {
      case "calculator":
        return (
          <CalculatorScreen
            onNavigate={setScreen}
            theme={theme}
            setTheme={setTheme}
            history={history}
            setHistory={setHistory}
            soundEnabled={soundEnabled}
            fontSize={fontSize}
          />
        );
      case "history":
        return (
          <HistoryScreen
            onBack={() => setScreen("calculator")}
            history={history}
            setHistory={setHistory}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            onBack={() => setScreen("calculator")}
            theme={theme}
            setTheme={setTheme}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            setHistory={setHistory}
            fontSize={fontSize}
            setFontSize={setFontSize}
            onViewHistory={() => setScreen("history")}
          />
        );
      default:
        return null;
    }
  };

  return <div className={`app-container ${theme}`}>{renderScreen()}</div>;
}

function CalculatorScreen({
  onNavigate,
  theme,
  setTheme,
  history,
  setHistory,
  soundEnabled,
  fontSize,
}) {
  const [input, setInput] = useState("");

  const playSound = () => {
    if (soundEnabled) {
      const audio = new Audio(process.env.PUBLIC_URL + "/click.mp3");
      audio.addEventListener("error", () => {
        console.warn("Click sound file not found or unsupported format.");
      });
      audio.play().catch((e) => {
        console.warn("Audio play failed: ", e.message);
      });
    }
  };
  

  const handleClick = (value) => {
    playSound();
    if (value === "C") {
      setInput("");
    } else if (value === "=") {
      if (!input || /[+\-×÷.]$/.test(input)) {
        setInput("Error");
        return;
      }
      try {
        const result = eval(input.replace(/÷/g, "/").replace(/×/g, "*"));
        const rounded = Number.isFinite(result) ? Number(result.toFixed(6)) : result;
        const full = `${input} = ${rounded}`;
        setInput(String(rounded));  // Start fresh from result
        setHistory([full, ...history]);
      } catch {
        setInput("Error");
      }
    } else {
      // If previous input was a result (number only), and user presses operator -> continue
      if (/^[0-9.]+$/.test(input) && /[+\-×÷]/.test(value)) {
        setInput(input + value);
      }
      // If previous input was result and user presses digit -> start new
      else if (/^[0-9.]+$/.test(input) && /[0-9.]/.test(value)) {
        setInput(value);
      } 
      else {
        setInput(prev => prev + value);
      }
    }
  };
  
  

  return (
    <div className="calculator">
      <div className="header">
        <h1>SimpelCalc</h1>
        <div className="nav-buttons">
          <button onClick={() => onNavigate("history")} className="nav-icon">
            <HiOutlineClipboardList size={24} color="#267cf3" />
          </button>
          <button onClick={() => onNavigate("settings")} className="nav-icon">
            <FiSettings size={24} color="#267cf3" />
          </button>
        </div>
      </div>
      <div className="display" style={{ fontSize: `${fontSize}px` }}>
        {input}
      </div>
      <div className="keypad grid grid-cols-4 gap-2 p-2">
        {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "-", "0",".", "C", "+", "="].map(
          (btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className="bg-blue-500 text-white py-3 rounded"
            >
              {btn}
            </button>
          )
        )}
      </div>
    </div>
  );
}

function HistoryScreen({ onBack, history, setHistory }) {
  return (
    <div className="history-screen">
      <div className="history-header">
        <h2 className="history-title">Calculation History</h2>
        <div className="history-buttons">
          <button onClick={() => setHistory([])} className="clear-history">
            Clear History
          </button>
          <button onClick={onBack} className="back-btn">
          <FiArrowLeft size={20} />
          </button>
        </div>
      </div>
      <ul className="history-list">
        {history.map((item, index) => {
          const [expression, result] = item.split("=");
          return (
            <li key={index} className="history-item">
              <span className="expression">{expression.trim()}</span>
              <span className="result">= {result.trim()}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SettingsScreen({
  onBack,
  theme,
  setTheme,
  fontSize,
  setFontSize,
  soundEnabled,
  setSoundEnabled,
  setHistory,
  onViewHistory,
}) {
  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
      </div>

      <div className="setting-section">
        <label className="setting-label">Font Size</label>
        <input
          type="range"
          min="16"
          max="40"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="slider-input"
        />
      </div>

      <div className="setting-section">
        <label className="setting-label">Color Theme</label>
        <div className="theme-options">
          <button
            className={`theme-circle light ${theme === "light" ? "selected" : ""}`}
            onClick={() => setTheme("light")}
          />
          <button
            className={`theme-circle dark ${theme === "dark" ? "selected" : ""}`}
            onClick={() => setTheme("dark")}
          />
        </div>
      </div>

      <div className="setting-section">
        <label className="setting-label">Sound Effects</label>
        <label className="switch">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          <span className="slider-toggle"></span>
        </label>
      </div>

      <div className="setting-section">
        <button className="reset-btn" onClick={() => setHistory([])}>
          Reset Calculation History
        </button>
      </div>

      <div className="footer-nav">
        <button className="footer-btn" onClick={onBack}>
          🔙 Back to Calculator
        </button>
        <button className="footer-btn" onClick={onViewHistory}>
          🕘 View History
        </button>
      </div>
    </div>
  );
}
