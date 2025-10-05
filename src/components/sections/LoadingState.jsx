import React, { useState, useEffect } from 'react';

// An array of tips to be displayed randomly.
const uxTips = [
    "Did you know? Pages with a single, clear call-to-action can increase leads by over 200%.",
    "A/B testing your headline is one of the highest-impact changes you can make.",
    "Users form a first impression in 50 milliseconds. Visual appeal matters!",
    "Using testimonials and trust signals can boost conversion rates by up to 34%.",
    "Page load speed is critical. A 1-second delay can reduce conversions by 7%."
];

export function LoadingState() {
    // State to hold the randomly selected tip.
    const [randomTip, setRandomTip] = useState('');

    // This effect runs once when the component is first rendered.
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * uxTips.length);
        setRandomTip(uxTips[randomIndex]);
    }, []); // The empty array ensures this runs only once per render.

    return (
        <div className="text-center mt-16 flex flex-col items-center gap-2 animate-pulse">
            <p className="text-neutral-800 text-xl font-semibold">
                Clario is analyzing your copy...
            </p>
            <p className="text-zinc-600 text-sm font-medium">
                {randomTip}
            </p>
        </div>
    );
}