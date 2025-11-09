"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Copy, Check, Plus, Trash2 } from "lucide-react";

export default function PromptBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    requestType: "",
    description: "",
    objective: "",
    constraints: "",
    features: [""],
    technologies: "",
    outputFormat: "",
    technicalRequirements: "",
    needFakeData: false,
    examples: "",
  });

  const steps = [
    { title: "Tipo di Richiesta", subtitle: "Cosa vuoi creare?" },
    { title: "Contesto", subtitle: "Descrivi il progetto" },
    { title: "Funzionalità", subtitle: "Feature principali" },
    { title: "Aspetti Tecnici", subtitle: "Requisiti tecnici" },
    { title: "Esempi e Dati", subtitle: "Dati di esempio" },
    { title: "Prompt Generato", subtitle: "Il tuo prompt è pronto!" },
  ];

  const requestTypes = ["Applicazione Web", "Documento / Report", "Analisi Dati", "Contenuto Creativo", "Codice / Script", "Altro"];

  const updateFormData = (field: string, value: any) => {
    console.log(`########`);
    console.log(`field: ${field}`);
    console.log(`value: ${value}`);

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, features: newFeatures }));
    }
  };

  const generatePrompt = () => {
    let prompt = `Crea ${formData.requestType.toLowerCase()} con le seguenti caratteristiche:\n\n`;

    if (formData.description) {
      prompt += `DESCRIZIONE:\n${formData.description}\n\n`;
    }

    if (formData.objective) {
      prompt += `OBIETTIVO:\n${formData.objective}\n\n`;
    }

    if (formData.constraints) {
      prompt += `VINCOLI/REQUISITI:\n${formData.constraints}\n\n`;
    }

    const validFeatures = formData.features.filter((f) => f.trim() !== "");
    if (validFeatures.length > 0) {
      prompt += `FUNZIONALITÀ PRINCIPALI:\n`;
      validFeatures.forEach((feature) => {
        prompt += `- ${feature}\n`;
      });
      prompt += "\n";
    }

    if (formData.technologies || formData.outputFormat || formData.technicalRequirements) {
      prompt += `ASPETTI TECNICI:\n`;
      if (formData.technologies) {
        prompt += `- Tecnologie: ${formData.technologies}\n`;
      }
      if (formData.outputFormat) {
        prompt += `- Formato di output: ${formData.outputFormat}\n`;
      }
      if (formData.technicalRequirements) {
        prompt += `- Requisiti: ${formData.technicalRequirements}\n`;
      }
      prompt += "\n";
    }

    if (formData.needFakeData) {
      prompt += `DATI DI ESEMPIO:\nPopola l'applicazione con dati fittizi per dimostrarne il funzionamento.\n\n`;
    }

    if (formData.examples) {
      prompt += `ESEMPI/NOTE AGGIUNTIVE:\n${formData.examples}\n\n`;
    }

    prompt += `Crea tutto il codice necessario e assicurati che sia completo e funzionante.`;

    return prompt;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return formData.requestType !== "";
      case 1:
        return formData.description !== "" || formData.objective !== "";
      case 2:
        return formData.features.some((f) => f.trim() !== "");
      case 3:
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cosa vuoi creare?</h2>
            <div className="grid grid-cols-2 gap-3">
              {requestTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFormData("requestType", type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.requestType === type ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}>
                  {type}
                </button>
              ))}
            </div>
            {(formData.requestType === "Altro" || (formData.requestType && !requestTypes.includes(formData.requestType))) && (
              <input
                type="text"
                value={formData.requestType === "Altro" ? "" : formData.requestType}
                placeholder="Specifica cosa vuoi creare..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => updateFormData("requestType", e.target.value)}
              />
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Contesto e Dettagli</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione generale</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                placeholder="Descrivi brevemente cosa vuoi realizzare..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Obiettivo finale</label>
              <textarea
                value={formData.objective}
                onChange={(e) => updateFormData("objective", e.target.value)}
                placeholder="Qual è lo scopo principale di questo progetto?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vincoli o requisiti specifici (opzionale)</label>
              <textarea
                value={formData.constraints}
                onChange={(e) => updateFormData("constraints", e.target.value)}
                placeholder="Es: deve funzionare offline, deve essere mobile-friendly, ecc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Funzionalità Principali</h2>
            <p className="text-gray-600 mb-4">Elenca le feature che vuoi includere nel progetto</p>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`Funzionalità ${index + 1}`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.features.length > 1 && (
                  <button onClick={() => removeFeature(index)} className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            <button onClick={addFeature} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <Plus size={20} />
              Aggiungi funzionalità
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Aspetti Tecnici</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tecnologie preferite (opzionale)</label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => updateFormData("technologies", e.target.value)}
                placeholder="Es: React, Next.js, Python, ecc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato di output (opzionale)</label>
              <input
                type="text"
                value={formData.outputFormat}
                onChange={(e) => updateFormData("outputFormat", e.target.value)}
                placeholder="Es: File HTML singolo, applicazione React, script Python, ecc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requisiti tecnici specifici (opzionale)</label>
              <textarea
                value={formData.technicalRequirements}
                onChange={(e) => updateFormData("technicalRequirements", e.target.value)}
                placeholder="Es: responsive design, accessibilità, performance, ecc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Esempi e Dati</h2>
            <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg">
              <input
                type="checkbox"
                id="fakeData"
                checked={formData.needFakeData}
                onChange={(e) => updateFormData("needFakeData", e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="fakeData" className="text-gray-700 cursor-pointer">
                Popola con dati fittizi di esempio
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Esempi specifici o note aggiuntive (opzionale)</label>
              <textarea
                value={formData.examples}
                onChange={(e) => updateFormData("examples", e.target.value)}
                placeholder="Aggiungi esempi concreti o dettagli aggiuntivi che vuoi specificare..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Il Tuo Prompt è Pronto! 🎉</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{generatePrompt()}</pre>
            </div>
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              {copied ? (
                <>
                  <Check size={20} />
                  Copiato!
                </>
              ) : (
                <>
                  <Copy size={20} />
                  Copia negli Appunti
                </>
              )}
            </button>
            <p className="text-center text-gray-600 text-sm">Incolla questo prompt nella tua conversazione con l'LLM</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 my-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prompt Builder</h1>
            <p className="text-gray-600">Crea prompt efficaci attraverso step guidati</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={index} className={`flex-1 text-center ${index < steps.length - 1 ? "mr-2" : ""}`}>
                  <div className={`h-2 rounded-full transition-all ${index <= currentStep ? "bg-blue-600" : "bg-gray-200"}`} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">{steps[currentStep].title}</p>
              <p className="text-xs text-gray-500">{steps[currentStep].subtitle}</p>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStep()}</div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed!" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}>
              <ChevronLeft size={20} />
              Indietro
            </button>
            <button
              onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1 || !canGoNext()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === steps.length - 1 || !canGoNext()
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed!"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}>
              Avanti
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
