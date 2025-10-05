import { Button } from "@/components/ui/button";
import logo from '../../assets/logo.png';

export function Header({ isDemoButtonDisabled = false }) {
    return (
        // We've changed the background here from a transparent blur to a solid color
        <header className="border-b border-neutral-200 bg-neutral-100 sticky top-0 z-10">
            <div className="container mx-auto grid grid-cols-3 items-center h-20 px-4">

                <div></div>

                <div className="flex justify-center">
                    <img src={logo} alt="Clario Logo" className="h-9" />
                </div>

                <div className="justify-self-end">
                    <Button
                        className="bg-yellow-300 rounded-lg text-neutral-800 text-sm font-medium hover:bg-yellow-400 disabled:opacity-50"
                        disabled={isDemoButtonDisabled}
                    >
                        Book a demo
                    </Button>
                </div>
            </div>
        </header>
    );
}