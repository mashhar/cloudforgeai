"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface TourStep {
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    title: "Welcome to CloudForge AI! 🎉",
    description:
      "Generate production-ready cloud architectures in seconds using AI. Let's show you around!",
  },
  {
    title: "Generate Architectures",
    description:
      "Describe your infrastructure needs in plain English. Our AI will create a complete architecture diagram with services, connections, and deployment guides.",
  },
  {
    title: "Use Templates",
    description:
      "Browse our template gallery for common architectures like e-commerce platforms, streaming services, SaaS applications, and more. Just click to customize!",
  },
  {
    title: "Review Mode",
    description:
      "Already have an architecture? Upload diagrams, JSON, or Terraform files for AI-powered analysis. Get security recommendations, scalability insights, and cost optimization tips.",
  },
  {
    title: "Command Palette",
    description:
      "Press ⌘K (or Ctrl+K) anywhere to open the command palette. Quickly navigate, create new architectures, or access any feature without touching your mouse.",
  },
  {
    title: "Export & Share",
    description:
      "Export your architectures as PNG diagrams, PDF reports, Terraform code, or JSON. Share them with your team or use them as documentation.",
  },
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem("cloudforge.tour.completed");
    if (!seen) {
      setHasSeenTour(false);
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  const completeTour = () => {
    localStorage.setItem("cloudforge.tour.completed", "true");
    setIsActive(false);
    setHasSeenTour(true);
  };

  const skipTour = () => {
    completeTour();
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Tour Button (when not active) */}
      {!isActive && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => {
            setCurrentStep(0);
            setIsActive(true);
          }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Start Tour</span>
        </motion.button>
      )}

      {/* Tour Overlay */}
      <AnimatePresence>
        {isActive && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Tour Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <button
                    onClick={skipTour}
                    className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-6 w-6" />
                    <span className="text-sm font-medium">
                      {currentStep + 1} of {tourSteps.length}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{step.title}</h2>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <button
                    onClick={skipTour}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Skip tour
                  </button>

                  <div className="flex items-center gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={prevStep}
                        className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    )}

                    <button
                      onClick={nextStep}
                      className="px-6 py-2 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      {currentStep < tourSteps.length - 1 ? "Next" : "Get Started"}
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 pb-4">
                  {tourSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentStep
                          ? "w-8 bg-blue-600"
                          : "w-2 bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
