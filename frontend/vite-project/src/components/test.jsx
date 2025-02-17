import React, { useState, useEffect } from "react";
import { Activity, AlertTriangle, Zap } from "lucide-react";

const StressTester = ({ onTestComplete, setLiveData, darkMode }) => {
    const [url, setUrl] = useState("");
    const [requests, setRequests] = useState(100);
    const [concurrency, setConcurrency] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [currentData, setCurrentData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isLoading) return;

        const ws = new WebSocket("ws://localhost:8080/stress-test");
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.total_requests) {
                    onTestComplete(data); // Final result
                    setIsLoading(false);
                } else {
                    setCurrentData(data); // Store live updates locally
                    setLiveData(data); // Send live updates to parent
                }
            } catch (err) {
                setError("Error processing server response");
                setIsLoading(false);
            }
        };

        ws.onopen = () => {
            try {
                ws.send(JSON.stringify({ url, requests, concurrency }));
            } catch (err) {
                setError("Failed to send test parameters");
                setIsLoading(false);
            }
        };

        ws.onerror = () => {
            setError("WebSocket connection error");
            setIsLoading(false);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [isLoading, url, requests, concurrency, onTestComplete, setLiveData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        
        if (!url) {
            setError("URL is required");
            return;
        }
        
        try {
            new URL(url); // Validate URL
            setIsLoading(true);
        } catch (err) {
            setError("Invalid URL format");
        }
    };

    return (
        <div className={`p-6 rounded-lg shadow-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-6">
                <Zap className={`h-6 w-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h1 className="text-2xl font-bold">API Stress Tester</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium mb-1">Target URL:</label>
                    <input
                        id="url"
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://api.example.com/endpoint"
                        className={`block w-full p-3 border rounded-md transition-colors duration-200 ${
                            darkMode 
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400' 
                                : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="requests" className="block text-sm font-medium mb-1">Total Requests:</label>
                        <input
                            id="requests"
                            type="number"
                            min="1"
                            max="10000"
                            value={requests}
                            onChange={(e) => setRequests(Number.parseInt(e.target.value || "1"))}
                            className={`block w-full p-3 border rounded-md transition-colors duration-200 ${
                                darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="concurrency" className="block text-sm font-medium mb-1">Concurrency Level:</label>
                        <input
                            id="concurrency"
                            type="number"
                            min="1"
                            max="500"
                            value={concurrency}
                            onChange={(e) => setConcurrency(Number.parseInt(e.target.value || "1"))}
                            className={`block w-full p-3 border rounded-md transition-colors duration-200 ${
                                darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-400' 
                                    : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            } focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                        />
                    </div>
                </div>
                
                {error && (
                    <div className={`flex items-center gap-2 p-3 rounded ${darkMode ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-700'}`}>
                        <AlertTriangle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}
                
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full md:w-auto px-6 py-3 text-white rounded-md transition-colors duration-200 flex items-center justify-center gap-2 ${
                        isLoading
                            ? 'bg-gray-500 cursor-not-allowed'
                            : darkMode
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <Activity className="h-5 w-5 animate-spin" />
                            <span>Running Test...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="h-5 w-5" />
                            <span>Run Stress Test</span>
                        </>
                    )}
                </button>
            </form>

            {currentData && (
                <div className={`mt-6 p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className={darkMode ? 'text-green-400' : 'text-green-600'} />
                        Live Updates
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className="text-sm opacity-70">Successful Requests</p>
                            <p className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {currentData.success || 0}
                            </p>
                        </div>
                        
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className="text-sm opacity-70">Failed Requests</p>
                            <p className={`text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                {currentData.failures || 0}
                            </p>
                        </div>
                        
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className="text-sm opacity-70">CPU Usage</p>
                            <p className="text-xl font-bold">
                                {currentData.resource_usage?.cpu_usage ? 
                                  `${Number.parseFloat(currentData.resource_usage.cpu_usage).toFixed(2)}%` : 
                                  'N/A'}
                            </p>
                        </div>
                        
                        <div className={`p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <p className="text-sm opacity-70">Memory Usage</p>
                            <p className="text-xl font-bold">
                                {currentData.resource_usage?.mem_usage ? 
                                  `${Number.parseFloat(currentData.resource_usage.mem_usage).toFixed(2)} MB` : 
                                  'N/A'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StressTester;