import { ThumbsUp, Lightbulb, ArrowLeft, Download } from 'lucide-react'; // Import new icons
import { Button } from "@/components/ui/button"; // Import Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { downloadReportPDF } from "@/lib/pdfGenerator";

// Update the component to accept the onGoBack prop
export function ReportView({ data, onGoBack }) {
    if (!data) return null;

    const handleDownloadPdf = () => {
        try {
            downloadReportPDF(data);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full animate-in fade-in-50 duration-500">

            {/* This is the new header section that was missing */}
            <div className="w-full max-w-4xl flex justify-between items-center">
                <Button variant="ghost" size="icon" onClick={onGoBack} aria-label="Go back">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-2xl font-semibold text-neutral-800">Your Clario Report is Ready</h2>
                <Button variant="outline" onClick={handleDownloadPdf}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            </div>

            {/* The rest of the report content remains the same */}
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                <OverallPerformanceCard score={data.conversionPerformance} />
                <PageStrengthsCard strengths={data.pageStrengths} />
            </div>

            <div className="w-full max-w-4xl">
                <h3 className="text-3xl font-semibold text-neutral-800 text-center md:text-left mb-8">
                    Improvement Hypotheses
                </h3>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {data.croHypotheses.map((hypothesis, index) => (
                        <HypothesisItem key={index} item={hypothesis} />
                    ))}
                </Accordion>
            </div>
        </div>
    );
}

// --- Sub-Components (These are unchanged) ---

function OverallPerformanceCard({ score }) {
    const [value, total] = score.split('/').map(Number);
    const percentage = (value / total) * 100;
    return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader><CardTitle className="text-base font-medium text-zinc-600">Overall Conversion Performance</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p className="text-4xl font-bold text-yellow-500">{score}</p>
                <div className="w-full bg-neutral-200 rounded-full h-2.5"><div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div></div>
            </CardContent>
        </Card>
    );
}

function PageStrengthsCard({ strengths }) {
    return (
        <Card className="shadow-lg rounded-xl">
            <CardHeader><CardTitle className="flex items-center gap-2 text-base font-medium text-zinc-600"><ThumbsUp className="text-emerald-500" size={20} />Page Strengths</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {strengths.map((strength, index) => (
                    <Badge key={index} className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-medium rounded-full">{strength}</Badge>
                ))}
            </CardContent>
        </Card>
    );
}

function HypothesisItem({ item }) {
    return (
        <AccordionItem value={item.title} className="border-b-0">
            <AccordionTrigger className="bg-neutral-700 text-white data-[state=open]:bg-neutral-800 hover:bg-neutral-800/90 rounded-lg p-4 text-left hover:no-underline">
                <div className="flex items-center gap-3"><Lightbulb className="text-yellow-400" /><span className="font-semibold text-lg">{item.title}</span></div>
            </AccordionTrigger>
            <AccordionContent className="bg-white rounded-b-lg p-6 text-base shadow-inner">
                <div className="space-y-4 text-left">
                    <p><strong className="font-semibold text-neutral-800">Projected Impact:</strong> <span className="text-neutral-600">{item.projectedImpact}</span></p>
                    {item.suggestions.map((suggestion, i) => (
                        <div key={i}><strong className="font-semibold text-neutral-800">{suggestion.type}:</strong><p className="text-neutral-600 mt-1">{suggestion.proposed}</p></div>
                    ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}