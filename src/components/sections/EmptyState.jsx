import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Globe, FileText } from "lucide-react";

export function EmptyState({ inputValue, setInputValue, handleAnalyzeClick, isLoading }) {
    const [inputMode, setInputMode] = useState('text'); // 'text' or 'url'

    const isUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleInputChange = (value) => {
        setInputValue(value);
        // Auto-detect if input is a URL
        if (value.trim() && isUrl(value.trim())) {
            setInputMode('url');
        } else if (value.trim()) {
            setInputMode('text');
        }
    };

    return (
        <div className="flex flex-col items-center gap-12 md:gap-16">

            {/* Header Section */}
            <div className="grid md:grid-cols-2 gap-8 items-center w-full max-w-3xl">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl lg:text-[38px] font-semibold leading-tight text-neutral-800">
                        Your Free
                        <br />
                        <span className="text-yellow-600">Website Analyzer</span>
                    </h1>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-lg text-neutral-800 ">
                        <span className="font-medium">Clario uses AI to provide an</span>
                        <br />
                        <span className="font-semibold">instant conversion analysis.</span>
                    </p>
                </div>
            </div>

            {/* Input Mode Toggle */}
            <div className="w-full max-w-3xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-neutral-100 rounded-lg p-1 flex">
                        <Button
                            variant={inputMode === 'text' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setInputMode('text')}
                            className={`flex items-center gap-2 ${inputMode === 'text' ? 'bg-white shadow-sm' : 'text-neutral-600'}`}
                        >
                            <FileText className="h-4 w-4" />
                            Paste Content
                        </Button>
                        <Button
                            variant={inputMode === 'url' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setInputMode('url')}
                            className={`flex items-center gap-2 ${inputMode === 'url' ? 'bg-white shadow-sm' : 'text-neutral-600'}`}
                        >
                            <Globe className="h-4 w-4" />
                            Enter URL
                        </Button>
                    </div>
                </div>

                {/* Input Section */}
                <div className="text-center flex flex-col items-center">
                    <Textarea
                        id="page-input"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder={
                            inputMode === 'url' 
                                ? "Paste your website URL here (e.g., https://example.com)" 
                                : "Paste your landing page content here to get your free report."
                        }
                        className="min-h-[160px] bg-white border-neutral-200 rounded-2xl shadow-sm text-base placeholder:text-neutral-400 p-4"
                    />
                    
                    {/* Mode indicator */}
                    <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                        {inputMode === 'url' ? (
                            <>
                                <Globe className="h-4 w-4" />
                                <span>We'll analyze your website automatically</span>
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4" />
                                <span>Analyze your copied content</span>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handleAnalyzeClick}
                        disabled={!inputValue || isLoading}
                        className="mt-8 bg-yellow-300 rounded-lg inline-flex justify-center items-center gap-2 min-h-10 px-6 py-2.5 text-neutral-800 text-sm font-semibold hover:bg-yellow-500"
                    >
                        {isLoading ? 'Analyzing...' : 'Get My Free Analysis'}
                    </Button>
                </div>
            </div>

        </div>
    );
}