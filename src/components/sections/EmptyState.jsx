import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function EmptyState({ inputValue, setInputValue, handleAnalyzeClick, isLoading }) {
    return (
        <div className="flex flex-col items-center gap-12 md:gap-16">

            {/* In the div below, we change max-w-5xl to max-w-3xl to match the input section */}
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

            {/* This section already has the correct max-width */}
            <div className="w-full max-w-3xl text-center flex flex-col items-center">
                <Textarea
                    id="page-text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add your web content here to get your free report."
                    className="min-h-[160px] bg-white border-neutral-200 rounded-2xl shadow-sm text-base placeholder:text-neutral-400 p-4"
                />
                <Button
                    onClick={handleAnalyzeClick}
                    disabled={!inputValue || isLoading}
                    className="mt-8 bg-yellow-300 rounded-lg inline-flex justify-center items-center gap-2 min-h-10 px-6 py-2.5 text-neutral-800 text-sm font-semibold hover:bg-yellow-500"
                >
                    Get My Free Analysis
                </Button>
            </div>

        </div>
    );
}