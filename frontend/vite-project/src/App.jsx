import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StressTester from "./components/test";
import MetricsDisplay from "./components/graph";
import { Activity, Moon, Sun } from "lucide-react";

const App = () => {
  const [result, setResult] = useState(null);
  const [liveData, setLiveData] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <nav className={`${darkMode ? 'bg-gray-800' : 'bg-gray-900'} border-b border-opacity-20 border-gray-600 sticky top-0 z-10`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
                  <Activity className="h-6 w-6 text-blue-400" />
                  <span className="hidden sm:inline">API Stress Tester</span>
                </Link>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
                  type="button"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-blue-300" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="space-y-8">
                    <StressTester
                      onTestComplete={setResult}
                      setLiveData={setLiveData}
                      darkMode={darkMode}
                    />
                    {(result || liveData) && (
                      <MetricsDisplay result={result} liveData={liveData} darkMode={darkMode} />
                    )}
                  </div>
                }
              />
            </Routes>
          </div>
        </main>
        
        <footer className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} py-4 mt-10`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm opacity-70">API Stress Tester © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;