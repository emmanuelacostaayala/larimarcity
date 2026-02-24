'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PartyForm } from '@/components/forms/PartyForm';
import { PropertyForm } from '@/components/forms/PropertyForm';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { ClausesForm } from '@/components/forms/ClausesForm';
import { ContractPayload } from '@/types/contract';

const STEPS = [
    { id: 'client', title: 'Client Details' },
    { id: 'property', title: 'Property Data' },
    { id: 'payment', title: 'Payment Plan' },
    { id: 'clauses', title: 'Special Clauses' },
];

export default function NewContractPage() {
    const [currentStep, setCurrentStep] = useState(0);

    // Define initial state for payload (simplified for UI demonstration)
    const [payload, setPayload] = useState<Partial<ContractPayload>>({
        date: new Date().toISOString(),
        client: { type: 'Fisica', documentType: 'Pasaporte', documentNumber: '', civilStatus: 'Soltero', nationality: '', name: '', address: '' },
        property: { project: 'Prime Towers', unitNumber: '', level: 1, squareMeters: 0, rooms: 1, bathrooms: 1 },
        paymentPlan: {
            currency: 'USD',
            totalPrice: 0,
            isCash: false,
            reservationAmount: 0,
            reservationDate: '',
            downPaymentAmount: 0,
            downPaymentDate: '',
            constructionInstallments: 10,
            constructionStartDate: '',
            installments: [],
            deliveryAmount: 0
        },
        clauses: { earlyPaymentInterest: false, golfMembership: false, qualityMemory: true, vacationRental: false }
    });

    const [isLoading, setIsLoading] = useState(false);

    const validateStep = () => {
        if (currentStep === 0) {
            const client = payload.client;
            if (!client?.name || !client?.address) {
                alert('Please fill in Name and Address.');
                return false;
            }
            if (client.type === 'Fisica') {
                if (!client.documentNumber || !client.nationality) {
                    alert('Please fill in Document Number and Nationality for Physical Person.');
                    return false;
                }
            } else if (client.type === 'Sociedad') {
                if (!client.rncCif) {
                    alert('Please fill in RNC / CIF for Company.');
                    return false;
                }
            }
        }
        if (currentStep === 1) {
            const { project, unitNumber, squareMeters } = payload.property || {};
            if (!project || !unitNumber || !squareMeters) {
                alert('Please fill in all required property fields: Project, Unit Number, and Square Meters.');
                return false;
            }
        }
        if (currentStep === 2) {
            const { totalPrice } = payload.paymentPlan || {};
            if (!totalPrice || totalPrice <= 0) {
                alert('Please enter a valid Total Price.');
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleGenerate = async (format: 'pdf' | 'docx') => {
        if (!validateStep()) return;
        setIsLoading(true);
        try {
            const endpoint = format === 'pdf' ? '/api/contracts/generate/pdf' : '/api/contracts/generate/docx';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('API Error');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            // Sync with strict nomenclature format
            const { getDocumentFilename } = await import('@/utils/documentName');
            a.download = getDocumentFilename(payload as ContractPayload, format);

            a.click();
        } catch (err) {
            console.error(err);
            alert(`Failed to generate ${format.toUpperCase()}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Draft New Contract</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Fill in the client and property details to generate the required PDF contract dynamically.
                </p>
            </div>

            {/* Stepper Header */}
            <nav aria-label="Progress" className="mb-12">
                <ol role="list" className="flex items-center">
                    {STEPS.map((step, index) => {
                        const isCurrent = currentStep === index;
                        const isCompleted = currentStep > index;

                        return (
                            <li key={step.id} className={`relative ${index !== STEPS.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                <div className="flex items-center">
                                    <div
                                        className={`${isCompleted
                                            ? 'bg-primary'
                                            : isCurrent
                                                ? 'border-2 border-primary bg-background'
                                                : 'border-2 border-border bg-background'
                                            } flex h-8 w-8 items-center justify-center rounded-full transition-colors`}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5 text-primary-foreground" />
                                        ) : (
                                            <span
                                                className={`${isCurrent ? 'text-primary' : 'text-muted-foreground'
                                                    } text-sm font-medium`}
                                            >
                                                {index + 1}
                                            </span>
                                        )}
                                    </div>
                                    <div className="ml-4 hidden sm:block font-medium">
                                        <span
                                            className={`${isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'} text-sm`}
                                        >
                                            {step.title}
                                        </span>
                                    </div>
                                    {index !== STEPS.length - 1 && (
                                        <div className="absolute top-4 left-8 right-0 -m-px hidden w-full h-0.5 bg-border sm:block" />
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            </nav>

            {/* Form Area */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {currentStep === 0 && <PartyForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 1 && <PropertyForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 2 && <PaymentForm payload={payload} setPayload={setPayload} />}
                        {currentStep === 3 && <ClausesForm payload={payload} setPayload={setPayload} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Controls */}
            <div className="mt-8 flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>

                {currentStep === STEPS.length - 1 ? (
                    <div className="flex gap-4">
                        <Button
                            onClick={() => handleGenerate('pdf')}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? 'Generating...' : 'Generate PDF'}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => handleGenerate('docx')}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isLoading ? 'Generating...' : 'Generate DOCX'}
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={handleNext}
                        className="gap-2"
                    >
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
