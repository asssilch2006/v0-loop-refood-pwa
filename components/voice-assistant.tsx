"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/lib/app-state";
import { generateVoiceGuidance, generateWebSpeech } from "@/lib/services/groq-voice";
import { cn } from "@/lib/utils";

interface VoiceAssistantProps {
  content: string;
  title?: string;
  isListening?: boolean;
}

export function VoiceAssistant({ content, title, isListening = false }: VoiceAssistantProps) {
  const { accessibilityMode, speak } = useAppState();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!accessibilityMode) {
    return null;
  }

  const handleSpeak = async () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    try {
      setIsLoading(true);
      setIsSpeaking(true);

      // First try Groq for better quality, fallback to Web Speech
      try {
        await generateVoiceGuidance(content);
      } catch (err) {
        console.log('[v0] Groq fallback to Web Speech');
        await generateWebSpeech(content);
      }
    } catch (error) {
      console.error('[v0] Voice assistant error:', error);
      speak("Failed to generate voice guidance");
    } finally {
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  return (
    <AnimatePresence>
      {accessibilityMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="flex items-center gap-2"
        >
          <Button
            size="sm"
            variant="outline"
            onClick={handleSpeak}
            disabled={isLoading}
            className={cn(
              "rounded-full h-9 w-9 p-0",
              isSpeaking && "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
            )}
            aria-label={isSpeaking ? "Stop reading" : "Read aloud"}
            title={isSpeaking ? "Stop reading" : "Read content aloud (Groq AI)"}
          >
            {isLoading ? (
              <Mic className="h-4 w-4 text-blue-600 animate-pulse" />
            ) : isSpeaking ? (
              <VolumeX className="h-4 w-4 text-blue-600" />
            ) : (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {isListening && (
            <motion.span
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="text-xs text-muted-foreground"
            >
              {title && `Listening: ${title}`}
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick voice announcement component
export function VoiceAnnouncement({ text }: { text: string }) {
  const { accessibilityMode, speak } = useAppState();

  useEffect(() => {
    if (accessibilityMode && text) {
      speak(text);
    }
  }, [accessibilityMode, text, speak]);

  return null;
}

// Voice-guided form input
export interface FormFieldConfig {
  label: string;
  type: "text" | "email" | "password" | "number";
  placeholder?: string;
  required?: boolean;
}

export function VoiceGuidedForm({
  fields,
  onSubmit,
  submitLabel = "Submit",
}: {
  fields: FormFieldConfig[];
  onSubmit: (data: Record<string, string>) => void;
  submitLabel?: string;
}) {
  const { accessibilityMode, speak } = useAppState();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [currentField, setCurrentField] = useState(0);

  useEffect(() => {
    if (accessibilityMode && fields[currentField]) {
      const field = fields[currentField];
      speak(`Enter ${field.label}${field.required ? ", required" : ""}`);
    }
  }, [currentField, accessibilityMode, fields, speak]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentField < fields.length - 1) {
      setCurrentField(currentField + 1);
    }
  };

  const handleSubmit = () => {
    if (accessibilityMode) {
      speak("Form submitted successfully");
    }
    onSubmit(formData);
  };

  if (!accessibilityMode) {
    return null;
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <motion.div
          key={field.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: index === currentField ? 1 : 0.5,
            y: 0,
          }}
          className={cn(
            "p-4 rounded-lg border transition-colors",
            index === currentField
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30"
          )}
        >
          <label className="text-sm font-medium text-foreground block mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <input
            type={field.type}
            name={field.label}
            placeholder={field.placeholder}
            value={formData[field.label] || ""}
            onChange={handleChange}
            disabled={index !== currentField}
            className="w-full px-3 py-2 rounded-md border border-input disabled:opacity-50"
            autoFocus={index === currentField}
          />
        </motion.div>
      ))}

      <Button
        onClick={currentField < fields.length - 1 ? handleNext : handleSubmit}
        className="w-full"
      >
        {currentField < fields.length - 1 ? "Next" : submitLabel}
      </Button>
    </div>
  );
}
