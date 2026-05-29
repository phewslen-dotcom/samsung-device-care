import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
// Verify process.env.GEMINI_API_KEY environment variable is present or substitute placeholder safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Repair & bypass diagnostics assistant endpoint using Gemini AI
app.post("/api/diagnose-repair", async (req, res) => {
  try {
    if (!ai) {
      // Provide high quality mock fallback response if API key is not ready
      return res.json({
        diagnosticAnalysis: "Note: Gemini API Key is not set. Showing simulation analysis. Based on your inputs, the battery health shows typical wear. For Samsung devices, we recommend recalibrating the battery stats using dials or toggling 'Battery Protection' in One UI settings.",
        recommendedSettingsChanges: [
          "Settings > Battery > Battery protection > Maximum (Limit charge to 80%)",
          "Settings > Battery > Background usage limits > Put unused apps to sleep",
          "Settings > Display > Eye comfort shield > Turn on Adaptive mode"
        ],
        bypassMethodDetailed: {
          "title": "Pause USB Power Delivery (Gaming Power Bypass)",
          "instructions": "1. Connect a USB PD PPS compatible charger (25W+).\n2. Launch Samsung Gaming Hub.\n3. Open Game Booster Settings > Toggle ON 'Pause USB Power Delivery'.\n4. Power will now flow directly into the AP, bypassing battery charge loops to eliminate thermal degradation."
        },
        repairSteps: [
          "Phase 1: Diagnosis & Safe Shut Down: Switch off device, inspect for battery swelling.",
          "Phase 2: Recovery Bypass Partition Clear: Enter Android Recovery (Hold Power key + Volume Up while plugged to computer) and select 'Wipe cache partition' to bypass system lag caused by OTA compilation.",
          "Phase 3: Battery Recalibration: Open Dialer and type *#0228#. Tap 'Quick Start' to calibrate gauge fuel parameters. Charge fully to 100%."
        ],
        isRecommendedForSelfRepair: true,
        estimatedTimeMinutes: 15
      });
    }

    const { deviceModel, symptom, batteryCycleCount, batteryHealth } = req.body;

    const promptMessage = `Deliver an expert Samsung Mobile (One UI 6.0/One UI 6.1) diagnostic analysis & device troubleshooting guide.
The user is facing: "${symptom}"
Device model: "${deviceModel || "Samsung Galaxy S24 Ultra"}"
Current state metrics: Battery Health: ${batteryHealth}%, Battery Cycle Count: ${batteryCycleCount} cycles.

Draft an interactive, structural diagnostic summary with a strict educational layout of actions an official Samsung Repair Center or an authorized self-repair technician should perform.

Rules:
1. Ground suggestions based on official Samsung One UI options (e.g., Settings > Battery > Battery protection, Device Care diagnostics).
2. Incorporate troubleshooting for hardware, firmware bugs (e.g., cache partition wipes under recovery mode), or authorized parts replacement instructions.
3. List any official and safe bypass methods, such as: how to bypass charger restrictions using Samsung's "Power Delivery (PD) Bypass / Pause USB Power Delivery" gaming option (Battery bypass for direct power).
4. Provide official guidelines on Factory Reset Protection (FRP) safe account recovery and Find My Mobile bypass recovery for lockouts, stating factory resets, flashing with Samsung Odin, or recovery menus clearly. DO NOT generate harmful instructions, hacks, or cracked exploits.

Respond with ONLY valid JSON following this format:
{
  "diagnosticAnalysis": "Comprehensive professional clinical explanation of the symptoms, referencing Samsung specifications and standards.",
  "recommendedSettingsChanges": [
    "Step-by-step path: One UI Settings details.",
    "Step-by-step path: Custom setting to alleviate strain."
  ],
  "bypassMethodDetailed": {
    "title": "Bypass / Power Delivery Bypass Mode Information",
    "instructions": "Detailed instructions on enabling Samsung 'Pause USB Power Delivery' or related authorized custom bypass mechanics."
  },
  "repairSteps": [
    "Dialer Code Calibration or Partition Wipe instructions.",
    "Hardware assembly check if needed.",
    "Calibration phase."
  ],
  "isRecommendedForSelfRepair": true,
  "estimatedTimeMinutes": 20
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptMessage,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    res.json(JSON.parse(text));
  } catch (error: any) {
    console.error("Gemini diagnosis error:", error);
    res.status(500).json({
      error: "Failed to generate diagnostic and repair guide. Please ensure a valid API key is set.",
      message: error.message,
    });
  }
});

// Setup Vite Dev Server / Static Asset Handler
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Samsung Device Care server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
