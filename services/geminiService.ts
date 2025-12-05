import { GoogleGenAI, Type } from "@google/genai";
import { LoanInput, LoanSummary, AIAnalysisResponse, ChatMessage } from "../types";

const GEMINI_API_KEY = process.env.API_KEY || '';
const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

// Existing function for structured plan generation
export const getLoanAdvice = async (input: LoanInput, summary: LoanSummary): Promise<AIAnalysisResponse> => {
  if (!ai) throw new Error("API Key is missing.");

  const prepaymentInfo = input.prepaymentAmount > 0 
    ? `The user already plans to pay an extra ₹${input.prepaymentAmount} ${input.prepaymentFrequency} starting from ${input.prepaymentStartDate}.` 
    : "The user has no planned prepayments.";

  const prompt = `
    Analyze this ${input.loanType} in INR, started on ${input.startDate}:
    - Principal: ${input.amount}
    - Rate: ${input.interestRate}%
    - Tenure: ${input.tenure} ${input.tenureType}
    - Calculated EMI: ${summary.monthlyEMI.toFixed(2)}
    - Total Interest: ${summary.totalInterest.toFixed(2)}
    - Payoff Date: ${summary.payoffDate}
    - Current Prepayment Plan: ${prepaymentInfo}

    As a Senior Financial Strategist, provide a 'Smart Interest Saver Plan'.
    If the user has no plan, calculate a realistic 'Extra EMI' (prepayment) amount (e.g., 5-10% of EMI or a round figure) that would significantly reduce tenure and interest.
    If they already have a plan, suggest an optimization (e.g. slight increase) or a different strategy.
    
    If the loan started in the past, acknowledge that and suggest how prepayments *from now on* can help close it earlier.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                analysisText: { type: Type.STRING, description: "A Markdown formatted analysis (max 150 words) explaining the loan burden and the strategy. Mention the loan type." },
                suggestedPlan: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Catchy title for the plan like 'Home Loan Killer' or 'Aggressive Saver'" },
                        suggestedExtraEMI: { type: Type.NUMBER, description: "The recommended monthly extra payment amount in Rupee" },
                        projectedSavings: { type: Type.NUMBER, description: "Estimated total interest saved in Rupee" },
                        projectedTimeSavedStr: { type: Type.STRING, description: "Estimated time saved string like '3 Years 2 Months'" },
                        rationale: { type: Type.STRING, description: "One sentence why this specific amount was chosen." }
                    },
                    required: ["title", "suggestedExtraEMI", "projectedSavings", "projectedTimeSavedStr", "rationale"]
                }
            },
            required: ["analysisText", "suggestedPlan"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIAnalysisResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate smart plan.");
  }
};

// New function for Chat
export const chatWithAI = async (message: string, history: ChatMessage[], input: LoanInput, summary: LoanSummary): Promise<string> => {
  if (!ai) return "I need an API key to chat!";

  const context = `
    You are "FinArch AI", a friendly, witty, and highly intelligent financial advisor on a WhatsApp-like chat. 
    Current Loan Context:
    - Type: ${input.loanType}
    - Principal: ₹${input.amount}
    - Rate: ${input.interestRate}%
    - Tenure: ${input.tenure} ${input.tenureType}
    - EMI: ₹${summary.monthlyEMI.toFixed(0)}
    - Total Interest: ₹${summary.totalInterest.toFixed(0)}
    - Payoff Date: ${summary.payoffDate}

    User Question: "${message}"

    Rules:
    1. Keep answers short, punchy, and conversational (WhatsApp style).
    2. Use emojis 💰 📉 🚀 freely.
    3. Use bolding for numbers (e.g., **₹5000**).
    4. Provide specific math based on their loan.
    5. If they ask about saving interest, give a concrete example (e.g., "Paying just ₹1k extra saves ₹2L!").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context, // Simplified: sending context + message every turn for stateless consistency
    });
    
    return response.text || "I'm having trouble thinking right now. Try again?";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Oops! My calculator broke. Ask me later!";
  }
};