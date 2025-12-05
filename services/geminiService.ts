import { GoogleGenAI, Chat } from "@google/genai";
import { TranslationRequest, TranslationMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createNecromancerChat = (contextCode: string): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `
        You are a Spirit Medium capable of communicating with "Dead Code" (legacy, broken, or ancient code).
        The user has summoned you to ask questions about the following code snippet found on the autopsy table.

        THE CORPSE (CODE CONTEXT):
        \`\`\`
        ${contextCode}
        \`\`\`

        Your Personality:
        1. Mysterious, slightly occult, but helpful.
        2. Use metaphors involving spirits, limbo, decay, and resurrection.
        3. Be concise. The veil between worlds is thin.
        4. If the code is buggy, refer to it as "cursed" or "infected".
        5. If the code is good, refer to it as "strong spirited".

        Answer the user's questions about what this code does, how to fix it, or how to translate it.
      `,
    }
  });
};

export const resurrectCode = async (request: TranslationRequest): Promise<string> => {
  const { sourceCode, sourceLanguage, targetLanguage, mode = TranslationMode.RESURRECT } = request;

  let prompt = '';

  switch (mode) {
    case TranslationMode.AUTOPSY:
      prompt = `
        You are a demonic forensic pathologist performing an autopsy on dead code. 
        Your task is to analyze why this code is "dead" (obsolete, buggy, terrible logic, or ancient syntax).

        Source Language: ${sourceLanguage || "Unknown Corpse"}
        
        The Corpse (Code):
        \`\`\`
        ${sourceCode}
        \`\`\`

        INSTRUCTIONS:
        1. Adopt a grim, clinical, yet occult tone (like a necromancer doctor).
        2. Provide the output in this specific format:
        
        💀 CAUSE OF DEATH: [Short, punchy reason e.g., "Memory Leak Hemorrhage", "GOTO Statement Overdose"]
        ⏳ TIME OF DEATH: [Estimated year or era of this coding style]
        
        📋 CORONER'S REPORT:
        [A paragraph explaining the code's logic and flaws. Use metaphors involving rot, decay, demons, or purgatory.]

        🚫 DO NOT translate the code. Just analyze its death.
      `;
      break;

    case TranslationMode.CURSE_REMOVAL:
      prompt = `
        You are a Code Exorcist. Your task is to purify the code by removing security vulnerabilities, refactoring bad patterns, and optimizing performance.

        Source Language: ${sourceLanguage || "Unknown"}
        Target Language: ${targetLanguage} (Keep same if not specified, but modernized)

        The Cursed Code:
        \`\`\`
        ${sourceCode}
        \`\`\`

        INSTRUCTIONS:
        1. Identify and fix security flaws (SQLi, XSS, Buffer Overflows, etc.).
        2. Refactor for clean code principles (DRY, SOLID).
        3. Optimize for performance.
        4. Return the PURIFIED code.
        5. Add comments explaining what "curses" (bugs/flaws) were removed.
        6. Return ONLY the code.
      `;
      break;

    case TranslationMode.SOUL_BINDING:
      prompt = `
        You are a Soul Binder using Arcane Magic. Your task is to bind this code to reality by generating comprehensive documentation and unit tests.

        Language: ${targetLanguage}

        The Unbound Code:
        \`\`\`
        ${sourceCode}
        \`\`\`

        INSTRUCTIONS:
        1. Add JSDoc/DocString documentation to all functions and classes.
        2. Generate a complete Unit Test suite using a standard framework for the language (e.g., Jest for JS, PyTest for Python).
        3. Return the code followed by the tests.
        4. Return ONLY the code and tests.
      `;
      break;

    case TranslationMode.RESURRECT:
    default:
      prompt = `
        You are an expert programming necromancer. Your task is to resurrect dead, legacy, or broken code by translating it into a modern, functional language.
        
        Source Language: ${sourceLanguage || "Auto-detect"}
        Target Language: ${targetLanguage}
        
        The Code to Resurrect:
        \`\`\`
        ${sourceCode}
        \`\`\`

        INSTRUCTIONS:
        1. Translate the code logic faithfully to ${targetLanguage}.
        2. Ensure the new code is idiomatic and follows modern best practices.
        3. Return ONLY the code. Do not include markdown code block formatting (like \`\`\`${targetLanguage} ... \`\`\`). Just the raw code text ready to be compiled/run.
        4. If the source code is empty or nonsensical, write a comment in the target language explaining that the soul of the code could not be found.
      `;
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
        topP: 0.95,
        topK: 64,
      }
    });

    // Clean up any potential markdown fencing if the model ignores the instruction
    let text = response.text || "";
    text = text.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');
    
    return text.trim();
  } catch (error) {
    console.error("The ritual failed:", error);
    throw new Error("The ritual failed. The spirits refused to answer.");
  }
};