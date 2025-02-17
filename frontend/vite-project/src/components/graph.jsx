import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";
import { BarChart3, TrendingUp, AlertTriangle, Clock } from "lucide-react";

const GraphCard = ({ title, icon, children, darkMode }) => (
    <div className={`p-6 rounded-lg shadow-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-6">
            {icon}
            <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {children}
    </div>
);

const CustomTooltip = ({ active, payload, label, darkMode }) => {
    if (active && payload && payload.length) {
        return (
            <div className={`p-3 rounded shadow-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                <p className="font-medium">{label}</p>
                {payload.map((entry, index) => (
                    <p key={entry.name} style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const Graphs = ({ result, liveData, darkMode }) => {
    if (!result && !liveData) {
        return (
            <div className={`p-6 rounded-lg shadow-lg transition-colors duration-200 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                    <p className="font-medium">No data available. Please run a stress test first.</p>
                </div>
            </div>
        );
    }

    const data = liveData || result;

    // Calculate requests per second (RPS)
    const calculateRPS = (resourceUsage) => {
        if (!resourceUsage || !Array.isArray(resourceUsage)) return [];
        
        const rpsMap = new Map();
        for (const usage of resourceUsage) {
            const second = Math.floor(new Date(usage.timestamp).getTime() / 1000);
            rpsMap.set(second, (rpsMap.get(second) || 0) + 1);
        }

        return Array.from(rpsMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([second, count]) => ({
                name: `Second ${second % 60}`,
                requests: count,
            }));
    };

    // Calculate error rate over time
    const calculateErrorRate = (resourceUsage, failures, totalRequests) => {
        if (!resourceUsage || !Array.isArray(resourceUsage)) return [];
        
        const errorRateMap = new Map();
        for (const usage of resourceUsage) {
            const second = Math.floor(new Date(usage.timestamp).getTime() / 1000);
            const errorRate = (failures / (totalRequests || 1)) * 100;
            errorRateMap.set(second, errorRate);
        }

        return Array.from(errorRateMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([second, errorRate]) => ({
                name: `Second ${second % 60}`,
                errorRate: errorRate.toFixed(2),
            }));
    };

    // Format response time data
    const formatResponseTimeData = (resourceUsage) => {
        if (!resourceUsage || !Array.isArray(resourceUsage)) return [];
        
        return resourceUsage.map((usage, index) => ({
            name: `Request ${index + 1}`,
            responseTime: usage.response_time ? Number.parseFloat(usage.response_time.toFixed(3)) : 0,
        }));
    };

    const requestData = [
        { name: "Total Requests", value: (data.success || 0) + (data.failures || 0) },
        { name: "Success", value: data.success || 0, fill: darkMode ? "#4ade80" : "#22c55e" },
        { name: "Failures", value: data.failures || 0, fill: darkMode ? "#f87171" : "#ef4444" },
    ];

    const responseTimeData = formatResponseTimeData(data.resource_usage || []);
    const throughputData = calculateRPS(data.resource_usage || []);
    const errorRateData = calculateErrorRate(
        data.resource_usage || [],
        data.failures || 0,
        data.totalRequests || (data.success || 0) + (data.failures || 0)
    );

    const chartColors = {
        bar: darkMode ? "#60a5fa" : "#3b82f6",
        responseLine: darkMode ? "#4ade80" : "#22c55e",
        throughputLine: darkMode ? "#fb923c" : "#f97316", 
        errorLine: darkMode ? "#f87171" : "#ef4444",
        cartesianGrid: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        textColor: darkMode ? "#f9fafb" : "#111827"
    };

    // Common chart props
    const getChartProps = () => ({
        width: 500,
        height: 300
    });

    // Common axis props
    const getAxisProps = () => ({
        stroke: chartColors.textColor,
        style: { fontSize: '0.8rem' }
    });

    return (
        <div className="space-y-8">
            <GraphCard title="Requests Summary" 
                       icon={<BarChart3 className={darkMode ? "text-blue-400" : "text-blue-600"} />}
                       darkMode={darkMode}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={requestData} {...getChartProps()}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.cartesianGrid} />
                        <XAxis dataKey="name" {...getAxisProps()} />
                        <YAxis {...getAxisProps()} />
                        <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                        <Legend wrapperStyle={{ color: chartColors.textColor }} />
                        <Bar dataKey="value" fill={(entry) => entry.fill || chartColors.bar} name="Requests" />
                    </BarChart>
                </ResponsiveContainer>
            </GraphCard>

            {responseTimeData.length > 0 && (
                <GraphCard title="Response Time Distribution" 
                           icon={<Clock className={darkMode ? "text-green-400" : "text-green-600"} />}
                           darkMode={darkMode}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={responseTimeData} {...getChartProps()}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.cartesianGrid} />
                            <XAxis dataKey="name" {...getAxisProps()} />
                            <YAxis {...getAxisProps()} />
                            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                            <Legend wrapperStyle={{ color: chartColors.textColor }} />
                            <Line 
                                type="monotone" 
                                dataKey="responseTime" 
                                stroke={chartColors.responseLine} 
                                name="Response Time (s)"
                                dot={{ stroke: chartColors.responseLine, strokeWidth: 1, r: 2 }}
                                activeDot={{ stroke: chartColors.responseLine, strokeWidth: 1, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </GraphCard>
            )}

            {throughputData.length > 0 && (
                <GraphCard title="Requests per Second" 
                           icon={<TrendingUp className={darkMode ? "text-orange-400" : "text-orange-600"} />}
                           darkMode={darkMode}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={throughputData} {...getChartProps()}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.cartesianGrid} />
                            <XAxis dataKey="name" {...getAxisProps()} />
                            <YAxis {...getAxisProps()} />
                            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                            <Legend wrapperStyle={{ color: chartColors.textColor }} />
                            <Line 
                                type="monotone" 
                                dataKey="requests" 
                                stroke={chartColors.throughputLine} 
                                name="Requests/Second"
                                dot={{ stroke: chartColors.throughputLine, strokeWidth: 1, r: 2 }}
                                activeDot={{ stroke: chartColors.throughputLine, strokeWidth: 1, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </GraphCard>
            )}

            {errorRateData.length > 0 && (
                <GraphCard title="Error Rate Over Time" 
                           icon={<AlertTriangle className={darkMode ? "text-red-400" : "text-red-600"} />}
                           darkMode={darkMode}>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={errorRateData} {...getChartProps()}>
                            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.cartesianGrid} />
                            <XAxis dataKey="name" {...getAxisProps()} />
                            <YAxis {...getAxisProps()} />
                            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                            <Legend wrapperStyle={{ color: chartColors.textColor }} />
                            <Line 
                                type="monotone" 
                                dataKey="errorRate" 
                                stroke={chartColors.errorLine} 
                                name="Error Rate (%)"
                                dot={{ stroke: chartColors.errorLine, strokeWidth: 1, r: 2 }}
                                activeDot={{ stroke: chartColors.errorLine, strokeWidth: 1, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </GraphCard>
            )}
        </div>
    );
};

export default Graphs;