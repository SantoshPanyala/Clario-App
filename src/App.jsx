import React, { useState } from 'react';
import { Header } from './components/sections/Header';
import { EmptyState } from './components/sections/EmptyState';
import { LoadingState } from './components/sections/LoadingState';
import { ErrorState } from './components/sections/ErrorState';
import { ReportView } from './components/sections/ReportView';



const mockReportData = {
    conversionPerformance: "6/10",
    pageStrengths: ["Clear Brand Identity", "Strong Social Proof"],
    croHypotheses: [
        {
            title: "Clarify Headline for Immediate Value Proposition",
            projectedImpact: "High",
            category: "Headline & Copy",
            suggestions: [
                { type: "Headline", current: "Your Free Website Analyzer", proposed: "Get an Instant, AI-Powered CRO Report for Your Website Copy" },
                { type: "Opening Paragraph", current: "Clario uses AI...", proposed: "Paste your landing page copy and our AI will analyze it for conversion opportunities, providing a detailed report in seconds." }
            ]
        },
        {
            title: "Strengthen Call-to-Action (CTA) Urgency",
            projectedImpact: "Medium",
            category: "Call-to-Action",
            suggestions: [
                { type: "Button Text", current: "Get My Free Analysis", proposed: "Generate My Free Report Now" }
            ]
        }
    ]
};
function App() {
    const [status, setStatus] = useState('idle');
    const [inputValue, setInputValue] = useState('');
    const [reportData, setReportData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleGoBack = () => {
        setStatus('idle');
        setInputValue(''); // Optional: Clear the input on go back
        setReportData(null);
    };

    const handleAnalyzeClick = async () => {
        if (!inputValue.trim()) return;
        setStatus('loading');
        setReportData(null);
        setErrorMessage('');

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ textToAnalyze: inputValue }),
            });

            if (!response.ok) {
                // If the server returns an error status (e.g., 4xx or 5xx),
                // we assume it sends back JSON with an error message
                const errorData = await response.json();
                throw new Error(errorData.message || 'An unknown server error occurred.');
            }

            // CRITICAL CHANGE: Server sends a RAW JSON STRING, so use .text() then JSON.parse()
            const rawJson = await response.text();
            const report = JSON.parse(rawJson); // Explicitly parse the string content

            setReportData(report);
            setStatus('success');


        } catch (err) {
            console.error("Analysis failed:", err);
            setErrorMessage(err.message);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 font-sans">
            <Header />
            <main className="container mx-auto mt-20 md:mt-24 px-4 pb-20">
                {/* We no longer show the empty state on success */}
                {status !== 'success' && (
                    <EmptyState
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleAnalyzeClick={handleAnalyzeClick}
                        isLoading={status === 'loading'}
                    />
                )}
                {status === 'loading' && <LoadingState />}
                {status === 'error' && <ErrorState message={errorMessage} />}

                {/* 4. Conditionally render the ReportView component */}
                {status === 'success' && <ReportView data={reportData} onGoBack={handleGoBack} />}
            </main>
        </div>
    );
}

export default App;