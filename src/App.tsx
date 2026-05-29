import React, { useState, useEffect, useRef } from 'react';
import { 
  Battery, 
  Settings, 
  Wrench, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  RotateCw, 
  Smartphone, 
  Sliders, 
  Sun, 
  Volume2, 
  Moon, 
  ShieldAlert, 
  Info, 
  HelpCircle,
  ChevronRight,
  BookOpen,
  Check,
  AlertCircle,
  Hash,
  Play,
  HeartPulse,
  RefreshCw,
  Zap,
  Lock,
  Unlock,
  Compass,
  FileText,
  Activity,
  Trash2,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BatteryDiagnosticState, SettingsState, DiagnosticsTest, BatteryUsageStat, PerformanceProfile } from './types.ts';

// Samsung device models and their physical battery profiles
const SAMSUNG_MODELS = [
  'Galaxy S24 Ultra',
  'Galaxy S24+',
  'Galaxy S24',
  'Galaxy S23 FE',
  'Galaxy Z Fold5',
  'Galaxy Z Flip5',
  'Galaxy A55 5G',
  'Galaxy A35 5G',
  'Galaxy S22 Ultra'
];

const MODEL_BATTERY_CAPACITIES: Record<string, number> = {
  'Galaxy S24 Ultra': 5.0, // 5000mAh
  'Galaxy S24+': 4.9,     // 4900mAh
  'Galaxy S24': 4.0,      // 4000mAh
  'Galaxy S23 FE': 4.5,   // 4500mAh
  'Galaxy Z Fold5': 4.4,  // 4400mAh
  'Galaxy Z Flip5': 3.7,  // 3700mAh
  'Galaxy A55 5G': 5.0,   // 5000mAh
  'Galaxy A35 5G': 5.0,   // 5000mAh
  'Galaxy S22 Ultra': 5.0  // 5000mAh
};

// Simulated default historical battery usage breakdown statistics
const DEFAULT_USAGE_STATS: BatteryUsageStat[] = [
  { appName: 'OLED Dynamic Screen Backlight (120Hz)', percentage: 36, type: 'hardware', activeTimeString: '3h 12m active' },
  { appName: 'Samsung Sound & Ambient Dolby Stream', percentage: 18, type: 'hardware', activeTimeString: '2h 45m active' },
  { appName: '5G Baseband Modem & GPS Telemeter', percentage: 15, type: 'hardware', activeTimeString: 'Continuous passive background' },
  { appName: 'Samsung Security Knox Active Guard', percentage: 12, type: 'system', activeTimeString: 'Continuous core guard' },
  { appName: 'Google Services Platform Sink', percentage: 10, type: 'system', activeTimeString: 'Underground background sync' },
  { appName: 'Camera Sensor Array & Postprocessing', percentage: 9, type: 'user', activeTimeString: '18m snapshot captures' }
];

export default function App() {
  // Device Identity
  const [selectedModel, setSelectedModel] = useState<string>('Galaxy S24 Ultra');
  const [activeTab, setActiveTab] = useState<'battery' | 'profiles' | 'diagnostics' | 'repair_bypass'>('battery');

  // Interactively adjustable charge state for realistic statistical telemetry
  const [chargeLevel, setChargeLevel] = useState<number>(84);

  // Battery State simulation
  const [batteryState, setBatteryState] = useState<BatteryDiagnosticState>({
    healthPercentage: 97,
    temperature: 31.4,
    voltage: 4.15,
    cycleCount: 182,
    chargingState: 'charging',
    timeRemaining: '1h 12m until full',
    pluggedType: 'ac',
    capacityAh: 5.0
  });

  // Settings State simulation
  const [settingsState, setSettingsState] = useState<SettingsState>({
    brightness: 65,
    volume: 50,
    darkTheme: true, // Preset modern style is dark
    powerSaving: false,
    eyeComfort: true,
    dolbyAtmos: true,
    nearShare: true
  });

  // Self Diagnostics simulation tests
  const [tests, setTests] = useState<DiagnosticsTest[]>([
    { id: '1', name: 'Battery Registry Calibration', iconName: 'Battery', status: 'untested', category: 'Hardware', description: 'Checks physical battery controller charge cycle limits, current variance and core resistance indicators.' },
    { id: '2', name: 'Ambient Luminescence Sensor', iconName: 'Sun', status: 'untested', category: 'Sensors', description: 'Diagnoses illuminance sensors and screen dynamic brightness refresh factors.' },
    { id: '3', name: 'Dolby Surround Balanced Stereo', iconName: 'Volume2', status: 'untested', category: 'Hardware', description: 'Pipes a stereo sweep signal to test secondary speakers output capability.' },
    { id: '4', name: 'Haptic Linear Acceleration', iconName: 'Smartphone', status: 'untested', category: 'Hardware', description: 'Assesses linear resonant actuator response at several haptic frequencies.' },
    { id: '5', name: 'Knox Security Chip Integration', iconName: 'Compass', status: 'untested', category: 'Connectivity', description: 'Performs cryptographic secure key handshake with the device trust core.' },
    { id: '6', name: 'PD Charge Ingress Safeguards', iconName: 'Zap', status: 'untested', category: 'Hardware', description: 'Tests voltage thresholds, current controllers, and moisture detector pins.' }
  ]);

  // AI Diagnostic assistant states
  const [promptSymptom, setPromptSymptom] = useState<string>('Screen runs warm and discharging fast during dual-sim 5G cellular operation');
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Stereo Tone test
  const [isTonePlaying, setIsTonePlaying] = useState<boolean>(false);

  // BMS Calibration state
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [calibrationSuccess, setCalibrationSuccess] = useState<boolean>(false);

  // === FEATURE: ADVANCED BATTERY OPTIMIZATION STATE ===
  const [adaptiveBatteryActive, setAdaptiveBatteryActive] = useState<boolean>(true);
  const [isLearningActive, setIsLearningActive] = useState<boolean>(true);
  const [usageStats, setUsageStats] = useState<BatteryUsageStat[]>(DEFAULT_USAGE_STATS);

  // === FEATURE: CUSTOM PERFORMANCE PROFILES STATE ===
  const [activeProfile, setActiveProfile] = useState<'max_perf' | 'balanced' | 'extreme_battery' | 'custom'>('balanced');
  // Individual customizable settings representing the active / custom profile state:
  const [cpuLimit, setCpuLimit] = useState<number>(85); // % throttle
  const [bgRestriction, setBgRestriction] = useState<'None' | 'Standard' | 'Strict'>('Standard');
  const [screenRefresh, setScreenRefresh] = useState<60 | 90 | 120>(120);

  // === FEATURE: ONE-CLICK REPAIR TOOL STATE ===
  const [repairState, setRepairState] = useState<'idle' | 'scanning' | 'resolving' | 'completed'>('idle');
  const [repairProgress, setRepairProgress] = useState<number>(0);
  const [repairLogs, setRepairLogs] = useState<string[]>([]);
  const [repairResults, setRepairResults] = useState<{
    cachesCleared: string;
    glitchesFixed: number;
    ramFreed: string;
    registryStatus: string;
  } | null>(null);

  // === FEATURE: SECURE & ETHICAL LOCKOUT BYPASS STATE ===
  const [bypassMode, setBypassMode] = useState<'frp' | 'pin_pattern' | 'knox_enforce'>('frp');
  const [bypassState, setBypassState] = useState<'idle' | 'executing' | 'completed'>('idle');
  const [bypassProgress, setBypassProgress] = useState<number>(0);
  const [bypassLogs, setBypassLogs] = useState<string[]>([]);
  const [bypassConsentChecked, setBypassConsentChecked] = useState<boolean>(false);
  const [bypassEthicsAcknowledged, setBypassEthicsAcknowledged] = useState<boolean>(false);
  const terminalLogsRef = useRef<HTMLDivElement>(null);

  // Sync battery capacity limit to selected model
  useEffect(() => {
    const defaultCapacity = MODEL_BATTERY_CAPACITIES[selectedModel] || 5.0;
    setBatteryState(prev => ({
      ...prev,
      capacityAh: defaultCapacity
    }));
  }, [selectedModel]);

  // Adjust remaining battery hours estimates interactively based on current state configuration
  const getSimulatedHoursRemainingString = () => {
    let baseHoursAtFullCharge = 22; // Based on 100% capacity at standard usage
    
    // Performance profile modification on discharge efficiency
    if (activeProfile === 'max_perf') {
      baseHoursAtFullCharge = 14; 
    } else if (activeProfile === 'balanced') {
      baseHoursAtFullCharge = 22;
    } else if (activeProfile === 'extreme_battery') {
      baseHoursAtFullCharge = 38;
    } else if (activeProfile === 'custom') {
      const cpuFactor = (100 - cpuLimit) / 50; // slider ranges [50-100]. Higher throttle (lower limit) improves hours
      const hzFactor = screenRefresh === 60 ? 1.25 : screenRefresh === 90 ? 1.05 : 0.9;
      const constraintMultiplier = bgRestriction === 'Strict' ? 1.3 : bgRestriction === 'Standard' ? 1.0 : 0.75;
      baseHoursAtFullCharge = Math.round(20 * (1.0 + cpuFactor * 0.4) * hzFactor * constraintMultiplier);
    }

    // Adaptive Optimization extra boost (+25% power efficiency)
    if (adaptiveBatteryActive) {
      baseHoursAtFullCharge = Math.round(baseHoursAtFullCharge * 1.25);
    }

    // Settings adjustments: Power saving mode adds extra direct baseline, eye comfort slightly decreases screen driver current drain
    if (settingsState.powerSaving) {
      baseHoursAtFullCharge = Math.round(baseHoursAtFullCharge * 1.2);
    }
    
    // Linearly calculate based on current interactive Charge slider level and battery health percentage
    const actualChargeRatio = chargeLevel / 100;
    const healthStateFactor = batteryState.healthPercentage / 100;
    const computedHours = baseHoursAtFullCharge * actualChargeRatio * healthStateFactor;
    
    const hours = Math.floor(computedHours);
    const minutes = Math.round((computedHours - hours) * 60);
    
    if (hours === 0 && minutes === 0) return 'Needs prompt charge';
    return `${hours}h ${minutes}m remaining`;
  };

  // Profile Presets trigger adjustments directly
  const applyPresetProfile = (profile: 'max_perf' | 'balanced' | 'extreme_battery') => {
    setActiveProfile(profile);
    if (profile === 'max_perf') {
      setCpuLimit(100);
      setBgRestriction('None');
      setScreenRefresh(120);
    } else if (profile === 'balanced') {
      setCpuLimit(85);
      setBgRestriction('Standard');
      setScreenRefresh(120);
    } else if (profile === 'extreme_battery') {
      setCpuLimit(60);
      setBgRestriction('Strict');
      setScreenRefresh(60);
      setSettingsState(prev => ({ ...prev, powerSaving: true }));
    }
  };

  // Sync to Custom tag if user changes single sliders in UI
  const handleCustomParamChange = (setting: 'cpu' | 'bg' | 'hz', val: any) => {
    setActiveProfile('custom');
    if (setting === 'cpu') setCpuLimit(val);
    if (setting === 'bg') setBgRestriction(val);
    if (setting === 'hz') setScreenRefresh(val);
  };

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (terminalLogsRef.current) {
      terminalLogsRef.current.scrollTop = terminalLogsRef.current.scrollHeight;
    }
  }, [repairLogs, bypassLogs]);

  // Periodic discharge temperature updates
  useEffect(() => {
    const timer = setInterval(() => {
      setBatteryState(prev => {
        const deltaTemp = (Math.random() - 0.5) * 0.4;
        // Thermal offset based on performance profile
        const thermalOffset = activeProfile === 'max_perf' ? 3.5 : activeProfile === 'extreme_battery' ? -2.0 : 0;
        const targetTemp = parseFloat((prev.temperature + deltaTemp + thermalOffset / 12).toFixed(1));
        const limitedTemp = targetTemp > 46 ? 45.4 : targetTemp < 22 ? 23.0 : targetTemp;

        return {
          ...prev,
          temperature: limitedTemp,
          voltage: parseFloat((3.6 + (chargeLevel / 100) * 0.6 + (prev.chargingState === 'charging' ? 0.15 : 0)).toFixed(2))
        };
      });
    }, 9000);

    return () => clearInterval(timer);
  }, [activeProfile, chargeLevel]);

  // Simulate Dark theme toggled
  useEffect(() => {
    const html = document.documentElement;
    if (settingsState.darkTheme) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [settingsState.darkTheme]);

  // Run Specific Diagnostic Test
  const triggerTest = (id: string) => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status: 'testing' } : t));
    
    setTimeout(() => {
      setTests(prev => prev.map(t => {
        if (t.id === id) {
          let testPassed = true;
          if (id === '1' && batteryState.healthPercentage < 80) {
            testPassed = false;
          }
          return { ...t, status: testPassed ? 'passed' : 'failed' };
        }
        return t;
      }));
    }, 1200);
  };

  const runAllTests = () => {
    tests.forEach((t, index) => {
      setTimeout(() => {
        triggerTest(t.id);
      }, index * 300);
    });
  };

  // Call API for Gemini diagnostic report
  const fetchAiDiagnosis = async () => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/diagnose-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceModel: selectedModel,
          symptom: promptSymptom,
          batteryCycleCount: batteryState.cycleCount,
          batteryHealth: batteryState.healthPercentage
        })
      });

      if (!res.ok) {
        throw new Error('Check server availability. Offline simulator mode ready.');
      }

      const data = await res.json();
      setAiReport(data);
    } catch (err: any) {
      setAiError(err.message || 'Error occurred generating guide.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick calibration dialer codes (*#0228#)
  const handleQuickStartCalibration = () => {
    setIsCalibrating(true);
    setCalibrationSuccess(false);
    setTimeout(() => {
      setIsCalibrating(false);
      setCalibrationSuccess(true);
      setBatteryState(prev => ({
        ...prev,
        healthPercentage: 100, // Realign gauge variables
        voltage: 4.22,
        temperature: 27.5
      }));
      setChargeLevel(100);
    }, 2000);
  };

  // === FEATURE CODE: ONE-CLICK REPAIR ANIMATION ENGINE ===
  const runOneClickRepair = () => {
    if (repairState !== 'idle') return;
    
    setRepairState('scanning');
    setRepairProgress(5);
    setRepairLogs([
      '[KNOX DIALER DETECTED] Initializing Samsung diagnostic register sweep...',
      '[SCAN] Connecting to firmware interface layer...',
      '[SCAN] Scanning Android cache tables for corrupted app database blocks...'
    ]);
    setRepairResults(null);

    const logPhases = [
      { p: 15, msg: '[SCAN] Found 1,424 leftover cache directories from recent software OTA update.' },
      { p: 28, msg: '[SCAN] Analyzing thread locks in Android runtime background daemons...' },
      { p: 40, msg: '[SCAN] Alert: 14 frozen database buffers found inside messaging cache pools.' },
      { p: 52, msg: '[REPAIR] Wiping cache partitions securely (No personal user files are modified)...' },
      { p: 65, msg: '[REPAIR] Compressing dynamic compilation logs and clearing Knox journal dumps...' },
      { p: 78, msg: '[REPAIR] Releasing orphaned background app memory blocks and purging leaked listeners...' },
      { p: 85, msg: '[REPAIR] Recalibrating screen brightness parameters and thread pool scheduling levels...' },
      { p: 94, msg: '[REPAIR] Re-registering background telemetry sensors with Device Care framework...' },
      { p: 100, msg: '[SYSTEM] Repair operation completed successfully! Core registry marks as Perfect.' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logPhases.length) {
        const nextStep = logPhases[currentStep];
        setRepairProgress(nextStep.p);
        setRepairLogs(prev => [...prev, nextStep.msg]);
        currentStep++;
        if (nextStep.p > 50 && repairState !== 'resolving') {
          setRepairState('resolving');
        }
      } else {
        clearInterval(interval);
        setRepairState('completed');
        setRepairResults({
          cachesCleared: '1.42 GB Reclaimed safely',
          glitchesFixed: 14,
          ramFreed: '720 MB memory released',
          registryStatus: 'CALIBRATED & SECURED'
        });
        // Settle state variables to healthy marks
        setBatteryState(prev => ({ ...prev, temperature: 28.5 }));
      }
    }, 700);
  };

  // === FEATURE CODE: ETHICAL SECURITY LOCKOUT BYPASS ENGINE ===
  const runLockoutBypass = () => {
    if (bypassState !== 'idle') return;
    if (!bypassConsentChecked || !bypassEthicsAcknowledged) return;

    setBypassState('executing');
    setBypassProgress(0);
    setBypassLogs([
      '[AUTH] Legal consensus and privacy logging confirmed.',
      '[AUTH] Authenticated as legal device administrator (DRY-RUN Recovery Stage)...',
      '[INIT] Establishing low-level USB virtual hardware handshake...',
      '[BOOTLOADER] Entering specialized recovery mode firmware hook...'
    ]);

    const bypassPhases = [
      { p: 15, msg: '[BOOTLOADER] Found active Samsung One UI bootloader signature.' },
      { p: 30, msg: `[INJECT] Launching targeted protocol for lockout configuration: [${bypassMode.toUpperCase()}] Bypass...` },
      { p: 45, msg: '[INJECT] Sending temporary custom kernel payload to check security credentials registry...' },
      { p: 60, msg: '[SECURE] Nullifying inactive lock credential files in virtual memory workspace (/dev/block/frp)...' },
      { p: 80, msg: '[SECURE] Regenerating secure token certificates without clearing precious system partition files...' },
      { p: 92, msg: '[SYSTEM] Handing back device initialization thread control (rebuilding boot parameters)...' },
      { p: 100, msg: '[SUCCESS] Bypass completed ethically. Secure system verification restored.' }
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < bypassPhases.length) {
        const nextBypass = bypassPhases[step];
        setBypassProgress(nextBypass.p);
        setBypassLogs(prev => [...prev, nextBypass.msg]);
        step++;
      } else {
        clearInterval(interval);
        setBypassState('completed');
      }
    }, 850);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans transition-colors duration-200">
      
      {/* Dynamic App Header */}
      <header className="pt-10 px-6 sm:px-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end bg-gradient-to-b from-[#121212] to-[#000000] border-b border-[#1C1C1E] sticky top-0 z-50">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Smartphone className="w-4 h-4 text-[#3E92FF]" id="app-header-logo-icon" />
            <span className="text-[10px] font-bold tracking-widest text-[#3E92FF] uppercase font-mono">One UI 6.1 • Knox Core Active</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Samsung Diagnostics & Device Care Suite
          </h1>
          <p className="text-[#A0A0A0] text-xs font-mono">
            Device Model: <span className="text-[#3E92FF]">{selectedModel}</span> • Active Profile: <span className="text-emerald-400 capitalize">{activeProfile.replace('_', ' ')}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0 items-center">
          <span className="px-3 py-1 bg-[#1A1A1C] rounded-full text-[10px] font-semibold border border-[#2C2C2E] tracking-tight font-mono text-zinc-300">
            KNOX v4.9 SECURE
          </span>
          
          {/* Custom Select Box */}
          <div className="relative">
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-[10px] uppercase font-bold py-1 pl-3 pr-8 bg-[#1C1C1E] border border-[#2C2C2E] rounded-full text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3E92FF] appearance-none font-mono"
              id="model-select-dropdown"
            >
              {SAMSUNG_MODELS.map(m => (
                <option key={m} value={m} className="bg-[#1C1C1E] text-white">{m}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400">
              <ChevronRight className="w-3 h-3 transform rotate-90" />
            </div>
          </div>
        </div>
      </header>

      {/* Main App Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        
        {/* Core Diagnosis Status Banner */}
        <div className="mb-6 rounded-[28px] p-6 bg-[#121214] border border-[#1C1C21]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#1C1C21] border border-[#2C2C35] rounded-2xl text-[#3E92FF]">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/20 font-mono">
                  Diagnostics Mode Active
                </span>
                <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  System Health Index: <span className="text-emerald-400 font-semibold font-mono">98/100 (Perfect)</span>
                </h2>
                <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
                  Advanced telemetries active for {selectedModel}. Charge levels, performance envelopes, sensor metrics, and lockout bypassed virtual registers are running diagnostic emulation.
                </p>
              </div>
            </div>

            {/* Quick Overview Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
              <div className="text-center px-4 py-3 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl font-mono">
                <div className="text-[9px] text-[#A0A0A0] uppercase tracking-wider">Health</div>
                <div className="text-base font-bold text-emerald-400 mt-0.5">{batteryState.healthPercentage}%</div>
              </div>
              <div className="text-center px-4 py-3 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl font-mono">
                <div className="text-[9px] text-[#A0A0A0] uppercase tracking-wider">Temp</div>
                <div className="text-base font-bold text-amber-500 mt-0.5" id="header-battery-temp">{batteryState.temperature}°C</div>
              </div>
              <div className="text-center px-4 py-3 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl font-mono">
                <div className="text-[9px] text-[#A0A0A0] uppercase tracking-wider">Cycles</div>
                <div className="text-base font-bold text-white mt-0.5">{batteryState.cycleCount}</div>
              </div>
              <div className="text-center px-4 py-3 bg-[#1C1C1E] border border-[#2C2C2E] rounded-2xl font-mono">
                <div className="text-[9px] text-[#A0A0A0] uppercase tracking-wider">Battery</div>
                <div className="text-base font-bold text-[#3E92FF] mt-0.5">{chargeLevel}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive One-UI Tabs Control */}
        <div className="flex overflow-x-auto space-x-2 pb-3 mb-6 scrollbar-none" id="care-tabs-navigation">
          <button
            onClick={() => setActiveTab('battery')}
            className={`flex items-center space-x-2 py-2.5 px-5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 font-mono ${
              activeTab === 'battery'
                ? 'bg-[#3E92FF] text-[#000000] shadow-lg shadow-[#3E92FF]/10'
                : 'bg-[#121214] border border-[#1C1C21] text-[#A0A0A0] hover:bg-[#1C1C21] hover:text-white'
            }`}
            id="care-tab-battery-trigger"
          >
            <Battery className="w-3.5 h-3.5" />
            <span>BATTERY & POWER SAVER</span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex items-center space-x-2 py-2.5 px-5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 font-mono ${
              activeTab === 'profiles'
                ? 'bg-[#3E92FF] text-[#000000] shadow-lg shadow-[#3E92FF]/10'
                : 'bg-[#121214] border border-[#1C1C21] text-[#A0A0A0] hover:bg-[#1C1C21] hover:text-white'
            }`}
            id="care-tab-profiles-trigger"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>PERFORMANCE PROFILES</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`flex items-center space-x-2 py-2.5 px-5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 font-mono ${
              activeTab === 'diagnostics'
                ? 'bg-[#3E92FF] text-[#000000] shadow-lg shadow-[#3E92FF]/10'
                : 'bg-[#121214] border border-[#1C1C21] text-[#A0A0A0] hover:bg-[#1C1C21] hover:text-white'
            }`}
            id="care-tab-diagnostics-trigger"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>HARDWARE DIAGSA</span>
          </button>

          <button
            onClick={() => setActiveTab('repair_bypass')}
            className={`flex items-center space-x-2 py-2.5 px-5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 font-mono ${
              activeTab === 'repair_bypass'
                ? 'bg-[#3E92FF] text-[#000000] shadow-lg shadow-[#3E92FF]/10'
                : 'bg-[#121214] border border-[#1C1C21] text-[#A0A0A0] hover:bg-[#1C1C21] hover:text-white'
            }`}
            id="care-tab-repairbypass-trigger"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>REPAIR & ETHICAL BYPASS</span>
          </button>
        </div>

        {/* Primary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Module Content Area (2-span column for deep fidelity features) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* ==================== TAB 1: BATTERY TELEMETRY & ADAPTIVE OPTIMIZATION ==================== */}
            {activeTab === 'battery' && (
              <div className="space-y-6">
                
                {/* Visual Battery Analytics & Time Prediction */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xs tracking-wide uppercase text-[#3E92FF] flex items-center gap-2 font-mono">
                      <Battery className="w-4 h-4" /> Live Power Diagnostics
                    </h3>
                    <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold font-mono border border-emerald-500/20 uppercase tracking-tight">Active Stream</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Ring indicator showing current interactive charge level */}
                    <div className="md:col-span-5 flex flex-col items-center py-6 bg-[#0B0B0C] border border-[#1C1C21] rounded-2xl justify-center relative">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="64" cy="64" r="54" strokeWidth="8" stroke="#121214" fill="transparent" />
                          <circle cx="64" cy="64" r="54" strokeWidth="8" stroke={chargeLevel < 20 ? '#EF4444' : chargeLevel < 50 ? '#F59E0B' : '#3E92FF'} fill="transparent" 
                            strokeDasharray="339.2"
                            strokeDashoffset={339.2 - (339.2 * chargeLevel) / 100}
                            className="transition-all duration-300"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center text-center">
                          <span className="text-3xl font-extrabold text-white font-mono">{chargeLevel}%</span>
                          <span className="text-[10px] text-[#A0A0A0] uppercase font-mono mt-0.5">Charge Level</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 px-3 py-1 bg-[#121214] rounded-lg border border-[#2C2C2E] text-xs font-mono font-medium text-emerald-400">
                        {getSimulatedHoursRemainingString()}
                      </div>
                    </div>

                    {/* Interactive Telemetry Multi-adjustment sliders */}
                    <div className="md:col-span-7 space-y-4">
                      
                      {/* Interactive Charge Level Slider */}
                      <div className="p-4 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl font-mono">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] uppercase text-[#A0A0A0] tracking-wider flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-[#3E92FF]" /> Current Charge
                          </span>
                          <span className="text-xs font-extrabold text-[#3E92FF]">{chargeLevel}%</span>
                        </div>
                        <input 
                          type="range"
                          min="3"
                          max="100"
                          value={chargeLevel}
                          onChange={(e) => setChargeLevel(Number(e.target.value))}
                          className="w-full h-1 bg-[#09090a] rounded-lg cursor-pointer accent-[#3E92FF]"
                          id="charge-level-slider"
                        />
                        <div className="flex justify-between text-[8px] text-zinc-500 mt-1 uppercase">
                          <span>Critical Discharging</span>
                          <span>Full Charged</span>
                        </div>
                      </div>

                      {/* Technical cells specs metadata */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-3 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl">
                          <div className="text-[8px] text-[#A0A0A0] uppercase uppercase">PHYSICAL CAPACITY</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {(MODEL_BATTERY_CAPACITIES[selectedModel] * 1000).toLocaleString()} mAh
                          </div>
                        </div>

                        <div className="p-3 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl">
                          <div className="text-[8px] text-[#A0A0A0] uppercase">CELL OUTPUT</div>
                          <div className="text-xs font-bold text-white mt-0.5">
                            {((MODEL_BATTERY_CAPACITIES[selectedModel] * chargeLevel) / 100 * 1000).toFixed(0)} mAh
                          </div>
                        </div>

                        <div className="p-3 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl">
                          <div className="text-[8px] text-[#A0A0A0] uppercase">CURRENT ACCUMULATOR</div>
                          <div className="text-xs font-bold text-[#3E92FF] mt-0.5">{batteryState.voltage} V</div>
                        </div>

                        <div className="p-3 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl">
                          <div className="text-[8px] text-[#A0A0A0] uppercase">KNOX THERMAL BAR</div>
                          <div className="text-xs font-bold text-[#3E92FF] mt-0.5">{batteryState.temperature} °C</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* === NEW FEATURE: ADAPTIVE BATTERY OPTIMIZATION & LEARNING === */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xs tracking-wide uppercase text-[#3E92FF] flex items-center gap-1.5 font-mono">
                      <Zap className="w-4 h-4 text-[#3E92FF]" /> Adaptive Battery Saving Mode
                    </h3>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={adaptiveBatteryActive}
                        onChange={() => setAdaptiveBatteryActive(!adaptiveBatteryActive)}
                        className="sr-only peer"
                        id="adaptive-saving-toggle"
                      />
                      <div className="w-9 h-5 bg-[#2C2C35] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3E92FF]"></div>
                    </label>
                  </div>
                  <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono text-[11px]">
                    Minimizes core power consumption dynamically by studying user behaviors (working/sleeping patterns) to adjust background app sync limits and adaptively modify backlight parameters.
                  </p>

                  <AnimatePresence>
                    {adaptiveBatteryActive && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-xl border border-[#2C2D3A] bg-[#1C1C21]/65 space-y-3 font-mono text-xs overflow-hidden"
                      >
                        <div className="flex items-center justify-between border-b border-[#2C2C2E] pb-2">
                          <span className="text-[#A0A0A0] uppercase text-[9px] font-bold">Learned Behavior state:</span>
                          <span className="text-emerald-400 font-extrabold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                            OPTIMIZED STATE
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-zinc-400 block text-[10px]">SLEEP CYCLES OBSERVED:</span>
                            <span className="text-white font-bold block">23:30 - 07:15 (Dynamic offline profile)</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-400 block text-[10px]">SCREEN AUTO-DIM FACTOR:</span>
                            <span className="text-white font-bold block">Offset adjusts -15% in low light environment</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-400 block text-[10px]">DORMANT TASK RESTRICTIONS:</span>
                            <span className="text-emerald-400 font-bold block">21 Unused sync-daemons deep asleep</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-400 block text-[10px]">STANDBY DISCHARGE DROP:</span>
                            <span className="text-white font-bold block">Calculated at only 0.4% per hour on rest</span>
                          </div>
                        </div>

                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] border border-emerald-500/20 text-center">
                          ⚡ Optimization is learning active. Extends estimated remaining standby battery duration by approximately 25%.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* === NEW FEATURE: DETAILED BATTERY USAGE STATISTICS === */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-xs tracking-wide uppercase text-white flex items-center gap-1.5 font-mono">
                      <Activity className="w-4 h-4 text-[#3E92FF]" /> Detailed Battery Consumption Statistics
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">Past 24h</span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono">
                    Breakdown of physical components power consumption factors. Restricted background limits apply to user and system processes.
                  </p>

                  <div className="space-y-3 font-mono">
                    {usageStats.map((stat, i) => (
                      <div key={i} className="space-y-1 p-3 bg-[#1C1C21] rounded-2xl border border-[#2C2C2E] text-xs">
                        <div className="flex items-center justify-between text-zinc-300">
                          <span className="font-medium">{stat.appName}</span>
                          <span className="text-[#3E92FF] font-bold">{stat.percentage}%</span>
                        </div>
                        
                        {/* Dynamic Percent Progress Bar custom UI */}
                        <div className="w-full bg-[#080809] h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              stat.percentage > 30 ? 'bg-indigo-500' : stat.percentage > 15 ? 'bg-[#3E92FF]' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stat.percentage}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-[#A0A0A0] pt-0.5">
                          <span className="uppercase text-zinc-500">CATEGORY: {stat.type}</span>
                          <span>{stat.activeTimeString}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Battery Protecting settings switcher original profile */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <h3 className="font-bold text-xs tracking-wide uppercase text-[#3E92FF] mb-2 flex items-center gap-2 font-mono">
                    <Sliders className="w-4 h-4" /> Hardwares Battery Protection Modes
                  </h3>
                  <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono">
                    Physical hardware charging stops optimized by One UI kernel scripts. Set maximum battery health threshold limits.
                  </p>

                  <div className="space-y-2">
                    <div className="p-3.5 rounded-2xl border border-[#1C1C21] bg-[#1C1C21] flex items-center justify-between hover:border-[#3E92FF]/50 cursor-pointer transition duration-150"
                      onClick={() => {
                        setBatteryState(prev => ({ ...prev, healthPercentage: 80 }));
                        alert('Maximum Guard Applied: Limit charging cycles dynamically to maximum 80% capacity.');
                      }}>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-[#121214] border border-[#2C2C2E] rounded-xl text-[#3E92FF] mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase font-mono">Maximum protection Profile</h4>
                          <p className="text-[10px] text-[#A0A0A0] mt-0.5">Limits physical charge capacity strictly to 80% to protect electrolyte lifespan.</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#3E92FF] font-mono border border-[#3E92FF]/20 px-2.5 py-1 rounded bg-[#3E92FF]/5 uppercase whitespace-nowrap">80% TARGET</span>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-[#1C1C21] bg-[#1C1C21] flex items-center justify-between hover:border-[#3E92FF]/50 cursor-pointer transition duration-150"
                      onClick={() => {
                        setBatteryState(prev => ({ ...prev, healthPercentage: 100 }));
                        alert('Basic Guard Applied: Charging will cycle between 95% and 100%.');
                      }}>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-[#121214] border border-[#2C2C2E] rounded-xl text-emerald-400 mt-0.5">
                          <Compass className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase font-mono">Basic Standard Profile</h4>
                          <p className="text-[10px] text-[#A0A0A0] mt-0.5">Fires a trickle cycle limit once battery gets filled up completely (100%).</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-[#3E92FF] font-mono border border-[#3E92FF]/20 px-2.5 py-1 rounded bg-[#3E92FF]/5 uppercase whitespace-nowrap">100% CYCLE</span>
                    </div>
                  </div>
                </div>

                {/* Dial-Code Calibration tool simulator */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-[#1C1C1E] border border-[#2C2C2E] text-amber-500 rounded-xl">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase font-mono">Fuel Gauge calibration (*#0228#)</h4>
                      <p className="text-xs text-[#A0A0A0] mt-0.5 font-mono">Resets reporting chips with battery physical telemetry limits directly.</p>
                    </div>
                  </div>

                  <div className="bg-[#000000] p-3 rounded-2xl mb-4 text-center border border-[#1C1C1E] font-mono text-xs font-extrabold tracking-widest text-[#3E92FF]">
                    REGISTER DIALER CODE: *#0228#
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="text-[11px] text-amber-500 flex items-center gap-1.5 font-mono leading-snug">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> Execution updates virtual charge values instantaneously.
                    </div>
                    
                    <button
                      onClick={handleQuickStartCalibration}
                      disabled={isCalibrating}
                      className="w-full sm:w-auto bg-[#3E92FF] hover:bg-[#3E92FF]/90 text-black font-extrabold text-xs py-2 px-6 rounded-xl transition duration-150 disabled:opacity-50 font-mono"
                      id="calibrate-fgu-trigger"
                    >
                      {isCalibrating ? 'RECALIBRATING...' : 'SYNC CALIBRATION'}
                    </button>
                  </div>

                  {calibrationSuccess && (
                    <div className="mt-4 p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs flex items-center space-x-2 border border-emerald-500/20 font-mono animate-fade-in">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>Calibration register parameters synchronized. Battery status aligned.</span>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ==================== TAB 2: SYSTEM PERFORMANCE PROFILES ==================== */}
            {activeTab === 'profiles' && (
              <div className="space-y-6">
                
                {/* Custom Performance Profiles Card */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sliders className="w-5 h-5 text-[#3E92FF]" />
                    <h3 className="font-bold text-xs tracking-wider uppercase text-[#3E92FF] font-mono">
                      Dynamic Performance Profiles
                    </h3>
                  </div>
                  <p className="text-xs text-[#A0A0A0] mb-5 leading-relaxed font-mono">
                    Choose preset envelopes or establish your customized hardware restrictions. Modulating throttling envelopes controls energy discharge curves and thermals.
                  </p>

                  {/* Preset Profiles Horizontal Buttons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    
                    {/* Max Performance */}
                    <div 
                      onClick={() => applyPresetProfile('max_perf')}
                      className={`p-4 rounded-2xl border cursor-pointer select-none transition flex flex-col justify-between ${
                        activeProfile === 'max_perf' 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                          : 'border-[#1D1D21] hover:border-[#2C2C2E] text-zinc-400 bg-[#1C1C21]'
                      }`}
                      id="profile-preset-max"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-wider uppercase font-mono text-indigo-400">Max Performance</span>
                          {activeProfile === 'max_perf' && <Check className="w-3 h-3 text-indigo-400" />}
                        </div>
                        <p className="text-[11px] leading-snug mt-1 text-zinc-300">Uncapped physical thermal thresholds. Smooth 120Hz locked interface.</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#2C2C2E] flex justify-between items-center text-[9px] font-mono text-zinc-400">
                        <span>CPU LIMIT: 100%</span>
                        <span>120 Hz</span>
                      </div>
                    </div>

                    {/* Balanced */}
                    <div 
                      onClick={() => applyPresetProfile('balanced')}
                      className={`p-4 rounded-2xl border cursor-pointer select-none transition flex flex-col justify-between ${
                        activeProfile === 'balanced' 
                          ? 'border-[#3E92FF] bg-[#3E92FF]/10 text-white' 
                          : 'border-[#1D1D21] hover:border-[#2C2C2E] text-zinc-400 bg-[#1C1C21]'
                      }`}
                      id="profile-preset-balanced"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-wider uppercase font-mono text-[#3E92FF]">Balanced Active</span>
                          {activeProfile === 'balanced' && <Check className="w-3 h-3 text-[#3E92FF]" />}
                        </div>
                        <p className="text-[11px] leading-snug mt-1 text-zinc-300">Sustained cooling cycles under active multi-tasking and games.</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#2C2C2E] flex justify-between items-center text-[9px] font-mono text-[#3E92FF]">
                        <span>CPU LIMIT: 85%</span>
                        <span>Auto Refresh</span>
                      </div>
                    </div>

                    {/* Extreme Battery Saver */}
                    <div 
                      onClick={() => applyPresetProfile('extreme_battery')}
                      className={`p-4 rounded-2xl border cursor-pointer select-none transition flex flex-col justify-between ${
                        activeProfile === 'extreme_battery' 
                          ? 'border-emerald-500 bg-emerald-500/10 text-white' 
                          : 'border-[#1D1D21] hover:border-[#2C2C2E] text-zinc-400 bg-[#1C1C21]'
                      }`}
                      id="profile-preset-extreme"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black tracking-wider uppercase font-mono text-emerald-400">Extreme Saver</span>
                          {activeProfile === 'extreme_battery' && <Check className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <p className="text-[11px] leading-snug mt-1 text-zinc-300">Rigid background app restrictions, locks interface refresh at 60Hz.</p>
                      </div>
                      <div className="mt-4 pt-2 border-t border-[#2C2C2E] flex justify-between items-center text-[9px] font-mono text-emerald-400">
                        <span>CPU LIMIT: 60%</span>
                        <span>60 Hz Static</span>
                      </div>
                    </div>

                  </div>

                  {/* Customizable Sliders & Selection Forms (Modifies active tab state to "Custom") */}
                  <div className="p-5 rounded-2xl border border-[#2C2C2E] bg-[#121214] font-mono text-xs space-y-5">
                    <div className="flex justify-between items-center border-b border-[#2C2C2E] pb-2">
                      <span className="font-extrabold uppercase text-[#3E92FF]">Customize Performance Values</span>
                      <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-black">
                        {activeProfile === 'custom' ? 'CUSTOM ACTIVE' : 'PRESET ALIGNED'}
                      </span>
                    </div>

                    {/* CPU Limit Custom Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between font-bold text-[#A0A0A0]">
                        <span className="uppercase text-[10px]">CPU Throttle Peak Limit</span>
                        <span className="text-[#3E92FF]">{cpuLimit}% Uncapped</span>
                      </div>
                      <input 
                        type="range"
                        min="50"
                        max="100"
                        step="5"
                        value={cpuLimit}
                        onChange={(e) => handleCustomParamChange('cpu', Number(e.target.value))}
                        className="w-full h-1 bg-[#1C1C21] rounded-lg cursor-pointer accent-[#3E92FF]"
                        id="cpu-limit-custom-slider"
                      />
                      <p className="text-[9px] text-[#A0A0A0]">Limiting CPU frequencies reduces battery discharge speeds under intensive tasks directly.</p>
                    </div>

                    {/* Background Apps Restrictions dropdown selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-[#A0A0A0]">Background App sync Limits</label>
                        <select 
                          value={bgRestriction}
                          onChange={(e) => handleCustomParamChange('bg', e.target.value as any)}
                          className="w-full py-2 px-3 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#3E92FF]"
                          id="bg-restriction-selector"
                        >
                          <option value="None">None (Unrestricted network data)</option>
                          <option value="Standard">Standard (Sleep idle background processes)</option>
                          <option value="Strict">Strict (Keep sync indicators dormant always)</option>
                        </select>
                      </div>

                      {/* Screen Refresh Rate limit selection */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] uppercase font-bold text-[#A0A0A0]">Screen Hardware Refresh Rate</label>
                        <select 
                          value={screenRefresh}
                          onChange={(e) => handleCustomParamChange('hz', Number(e.target.value) as any)}
                          className="w-full py-2 px-3 bg-[#1C1C21] border border-[#2C2C2E] rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#3E92FF]"
                          id="refresh-rate-selector"
                        >
                          <option value={60}>60 Hz Static (Extreme Guard)</option>
                          <option value={90}>90 Hz Unified (Adaptive Standard)</option>
                          <option value={120}>120 Hz Dynamic Fluid (Peak Dynamic)</option>
                        </select>
                      </div>

                    </div>

                    {/* Applied Parameters Feedback Message Panel */}
                    <div className="p-3 rounded-xl bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 text-[11px] leading-relaxed">
                      💡 <strong>Active Registry Envelope:</strong> CPU throttle locked at <strong>{cpuLimit}%</strong>, Screen refresh dynamic bounds set at <strong>{screenRefresh}Hz</strong>, background limitations are <strong>{bgRestriction}</strong>. Real-time consumption models re-calculating hours metrics.
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ==================== TAB 3: SELF HARDWARE DIAGNOSTICS ==================== */}
            {activeTab === 'diagnostics' && (
              <div className="space-y-6">
                
                {/* Diagnostics Header & Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-[#3E92FF] font-mono">Sensors Integrity Checks</h3>
                    <p className="text-xs text-[#A0A0A0]">Inspect physical component state limits and Knox cryptographic integrity rings.</p>
                  </div>
                  <button
                    onClick={runAllTests}
                    className="bg-[#3E92FF] hover:bg-[#3E92FF]/90 text-black text-xs font-bold py-2 px-5 rounded-full transition duration-150 flex items-center gap-1.5 font-mono"
                    id="run-diagnostics-overall-btn"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> RUN SENSORS CALIBRATION
                  </button>
                </div>

                {/* Diagnostics Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tests.map(test => (
                    <div 
                      key={test.id} 
                      className="p-4 rounded-2xl bg-[#121214] border border-[#1C1C21] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[9px] uppercase font-bold text-[#A0A0A0] font-mono tracking-wider">
                            {test.category}
                          </span>
                          
                          {/* One UI Status Color mapping */}
                          <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full font-mono ${
                            test.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25' :
                            test.status === 'failed' ? 'bg-red-500/10 text-red-500 border border-red-500/25' :
                            test.status === 'testing' ? 'bg-[#3E92FF]/10 text-[#3E92FF] border border-[#3E92FF]/25' :
                            'bg-[#2C2C2E] text-[#A0A0A0]'
                          }`}>
                            {test.status === 'untested' ? 'UNTESTED' : 
                             test.status === 'testing' ? 'IN_TEST' : 
                             test.status === 'passed' ? 'PASS' : 'FAIL'}
                          </span>
                        </div>

                        <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-1 font-mono uppercase">
                          {test.iconName === 'Battery' && <Battery className="w-3.5 h-3.5 text-zinc-300 animate-pulse" />}
                          {test.iconName === 'Sun' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
                          {test.iconName === 'Volume2' && <Volume2 className="w-3.5 h-3.5 text-[#3E92FF]" />}
                          {test.iconName === 'Smartphone' && <Smartphone className="w-3.5 h-3.5 text-indigo-400" />}
                          {test.iconName === 'Compass' && <Compass className="w-3.5 h-3.5 text-teal-400" />}
                          {test.iconName === 'Zap' && <Zap className="w-3.5 h-3.5 text-yellow-500" />}
                          {test.name}
                        </span>
                        <p className="text-xs text-[#A0A0A0] leading-relaxed mb-4 font-mono text-[11px]">
                          {test.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => triggerTest(test.id)}
                          disabled={test.status === 'testing'}
                          className="bg-[#1C1C21] hover:bg-[#2C2C2E] text-white text-[10px] font-bold py-1.5 px-4 rounded-lg border border-[#2C2C2E] transition duration-150 font-mono text-zinc-300"
                          id={`test-trigger-btn-${test.id}`}
                        >
                          {test.status === 'testing' ? 'TESTING...' : 'RE-CALIBRATE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Speaker Audio Calibration sweeper simulator */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <h4 className="font-bold text-xs uppercase text-[#3E92FF] mb-2 flex items-center gap-1.5 font-mono">
                    <Volume2 className="w-4 h-4" /> Stereo Impedance sweep tone
                  </h4>
                  <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono">
                    Fired sweep diagnostic frequencies. Resolves passive voice-coil distortions from accidental liquid or pocket lint ingress blocks.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={() => {
                        try {
                          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                          const osc = ctx.createOscillator();
                          const gainNode = ctx.createGain();
                          osc.connect(gainNode);
                          gainNode.connect(ctx.destination);
                          osc.frequency.setValueAtTime(440, ctx.currentTime);
                          gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
                          
                          setIsTonePlaying(true);
                          osc.start();
                          setTimeout(() => {
                            osc.stop();
                            setIsTonePlaying(false);
                          }, 1200);
                        } catch (e) {
                          alert("Calibrated diagnostics sweep tone triggered successfully.");
                        }
                      }}
                      className={`w-full sm:w-auto text-xs py-2 px-6 rounded-xl font-bold transition duration-150 font-mono ${
                        isTonePlaying ? 'bg-amber-500 text-black' : 'bg-[#3E92FF] text-black hover:bg-[#3E92FF]/95'
                      }`}
                      id="sound-test-btn"
                    >
                      {isTonePlaying ? 'SWEEPING STEREO IMPEDANCE...' : 'PLAY AUDIOMETRIC TONE'}
                    </button>
                    <span className="text-[11px] text-[#A0A0A0] font-mono leading-none">
                      Calibrated Sinusoidal frequency locked at 440 Hz.
                    </span>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== TAB 4: ADVANCED REPAIR & BYPASS TOOL ==================== */}
            {activeTab === 'repair_bypass' && (
              <div className="space-y-6">
                
                {/* === NEW FEATURE: ONE-CLICK REPAIR TOOL === */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-xs tracking-wide uppercase text-[#3E92FF] flex items-center gap-1.5 font-mono">
                      <Wrench className="w-4 h-4 text-[#3E92FF]" /> Integrated One-Click Repair Tool
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-black">
                      RECOMMENDED METHOD
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono">
                    Scans thoroughly for redundant cached updates, wipes active caches safely, purges stuck application process deadlocks, and resolves minor system glitches in One UI registries instantly.
                  </p>

                  <div className="bg-[#000000] rounded-xl p-4 border border-[#1C1C21] mb-4 font-mono text-xs">
                    <div className="flex justify-between items-center mb-2 border-b border-[#1C1C21] pb-2 text-zinc-500">
                      <span>DAEMON DISPATCHER: MAIN_REPAIR_UNIT</span>
                      <span>STATUS: {repairState.toUpperCase()}</span>
                    </div>

                    <div className="h-32 overflow-y-auto space-y-1 scrollbar-thin text-[11px] text-emerald-500" ref={terminalLogsRef}>
                      {repairLogs.length === 0 ? (
                        <p className="text-[#A0A0A0]">Console ready. Click "Execute One-Touch system Repair" below to begin diagnosis.</p>
                      ) : (
                        repairLogs.map((log, index) => <p key={index}>{log}</p>)
                      )}
                      {repairState === 'scanning' || repairState === 'resolving' ? (
                        <p className="animate-pulse text-white">_ Executing dynamic routine payload...</p>
                      ) : null}
                    </div>

                    {repairState !== 'idle' && (
                      <div className="space-y-1.5 mt-3 pt-3 border-t border-[#1C1C21]">
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                          <span>SYSTEM INDEX LEVEL RECONSTRUCTION PROGRESS</span>
                          <span>{repairProgress}%</span>
                        </div>
                        <div className="w-full bg-[#121214] h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#3E92FF] h-full transition-all duration-300"
                            style={{ width: `${repairProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Repair completed summarized achievements card */}
                  {repairResults && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl mb-4 font-mono text-xs space-y-3"
                    >
                      <div className="flex items-center space-x-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <h4 className="font-extrabold uppercase text-[11px]">One-Click Repair Finished [Perfect Outcome]</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-zinc-300">
                        <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-[#1C1C21]">
                          <span className="text-zinc-500 text-[9px] block">WIPED REGISTRY ERROR LOGS:</span>
                          <span className="font-bold text-white block mt-0.5">{repairResults.cachesCleared}</span>
                        </div>
                        <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-[#1C1C21]">
                          <span className="text-zinc-500 text-[9px] block">GLITCHES DIAGNOSED & REPAIRED:</span>
                          <span className="font-bold text-white block mt-0.5">{repairResults.glitchesFixed} Minor anomalies resolved</span>
                        </div>
                        <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-[#1C1C21]">
                          <span className="text-zinc-500 text-[9px] block">STANDBY DORMANT RAM PURGED:</span>
                          <span className="font-bold text-white block mt-0.5">{repairResults.ramFreed}</span>
                        </div>
                        <div className="p-2.5 bg-[#000000]/40 rounded-xl border border-[#1C1C21]">
                          <span className="text-zinc-500 text-[9px] block">TELEMETRY SECTOR COG FILE:</span>
                          <span className="font-bold text-emerald-400 block mt-0.5">{repairResults.registryStatus}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={runOneClickRepair}
                    disabled={repairState === 'scanning' || repairState === 'resolving'}
                    className="w-full bg-[#3E92FF] hover:bg-[#3E92FF]/95 text-[#000000] font-black text-xs py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 font-mono"
                    id="one-click-repair-execute-btn"
                  >
                    <Trash2 className="w-4 h-4" /> 
                    {repairState === 'idle' ? 'EXECUTE DISPATCH ONE-CLICK REPAIR' :
                     repairState === 'completed' ? 'DISPATCH SYSTEM REPAIR AGAIN' : 'RECONFIGURING APP CACHE PARTICLES...'}
                  </button>
                </div>

                {/* === NEW FEATURE: SECURE & ETHICAL LOCKOUT BYPASS === */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px] space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-xs tracking-wide uppercase text-white flex items-center gap-1.5 font-mono">
                        <Lock className="w-4 h-4 text-amber-500 animate-pulse" /> Authorized Lockout Bypass Console
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-mono">Secured by sandbox virtualization protocols.</p>
                    </div>
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase whitespace-nowrap">
                      ETHICAL WORKFLOW
                    </span>
                  </div>

                  {/* Ethical & Legal disclaimers with consent validation */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 text-amber-500 border border-amber-500/15 space-y-3 font-mono text-xs">
                    <div className="flex items-start space-x-2.5">
                      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white uppercase block mb-1">Strict Legal Consensus Framework</strong>
                        <p className="text-zinc-300 leading-normal text-[11px]">
                          All locking by-pass executions are authorized solely for dry-run educational simulation and licensed hardware owner partition recovery instances. Unauthorized utilization violates local device care policies. High-level cryptographic logs are stored securely inside the virtual diagnostic runtime environment.
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-amber-500/15 pt-3 space-y-2 text-[11px]">
                      <label className="flex items-start space-x-2.5 cursor-pointer text-zinc-300">
                        <input 
                          type="checkbox"
                          checked={bypassConsentChecked}
                          onChange={() => setBypassConsentChecked(!bypassConsentChecked)}
                          className="mt-0.5 accent-amber-500"
                          id="ethical-consent-chk1"
                        />
                        <span>I verify that I own this {selectedModel} device or am legally delegated to initiate emergency pass sequence.</span>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer text-zinc-300">
                        <input 
                          type="checkbox"
                          checked={bypassEthicsAcknowledged}
                          onChange={() => setBypassEthicsAcknowledged(!bypassEthicsAcknowledged)}
                          className="mt-0.5 accent-amber-500"
                          id="ethical-consent-chk2"
                        />
                        <span>I consent to temporary bypass testing, dry-run sandbox procedures and understand Knox core partition limits.</span>
                      </label>
                    </div>
                  </div>

                  {/* Selectable Bypass lockout type modes */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                    <button
                      onClick={() => setBypassMode('frp')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        bypassMode === 'frp' 
                          ? 'border-amber-500 bg-amber-500/10 text-white' 
                          : 'border-[#1C1C21] text-zinc-400 bg-[#1C1C21]'
                      }`}
                    >
                      <span className="font-bold block tracking-wider uppercase text-[10px]">FRP Bypass Mode</span>
                      <p className="text-[10px] text-zinc-400 mt-1">Simulates secure Factory Reset Protection registry nullification.</p>
                    </button>

                    <button
                      onClick={() => setBypassMode('pin_pattern')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        bypassMode === 'pin_pattern' 
                          ? 'border-amber-500 bg-amber-500/10 text-white' 
                          : 'border-[#1C1C21] text-zinc-400 bg-[#1C1C21]'
                      }`}
                    >
                      <span className="font-bold block tracking-wider uppercase text-[10px]">PIN/Pattern Reset</span>
                      <p className="text-[10px] text-zinc-400 mt-1">Re-routes credentials check routines to dummy virtual sectors.</p>
                    </button>

                    <button
                      onClick={() => setBypassMode('knox_enforce')}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                        bypassMode === 'knox_enforce' 
                          ? 'border-amber-500 bg-amber-500/10 text-white' 
                          : 'border-[#1C1C21] text-zinc-400 bg-[#1C1C21]'
                      }`}
                    >
                      <span className="font-bold block tracking-wider uppercase text-[10px]">Knox Enforce Recovery</span>
                      <p className="text-[10px] text-zinc-400 mt-1">Emulates enterprise cloud enrollments token redirection safely.</p>
                    </button>
                  </div>

                  {/* Green Hacker Terminal for Knox Bypass Simulation */}
                  <div className="bg-[#000000] border border-[#1C1C21] rounded-2xl p-4 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-zinc-500 mb-2 border-b border-[#1C1C21] pb-2">
                      <span className="text-yellow-500 font-extrabold flex items-center gap-1 uppercase">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" /> SECURE BYPASS CHANNEL: {bypassMode.toUpperCase()}
                      </span>
                      <span>ACTIVE GATE: 0x8284_Odin</span>
                    </div>

                    <div className="h-32 overflow-y-auto space-y-1 scrollbar-thin text-[11px] text-yellow-400" ref={terminalLogsRef}>
                      {bypassLogs.length === 0 ? (
                        <p className="text-[#A0A0A0]">Terminal state idle. Consent terms verification checkbox checks required to dispatch injections.</p>
                      ) : (
                        bypassLogs.map((log, index) => <p key={index}>{log}</p>)
                      )}
                      {bypassState === 'executing' && (
                        <p className="animate-pulse text-white">_ Injecting secure register overrides...</p>
                      )}
                    </div>

                    {bypassState !== 'idle' && (
                      <div className="space-y-1 mt-3 pt-3 border-t border-[#1C1C21]">
                        <div className="flex justify-between text-[9px] font-bold text-zinc-500">
                          <span>ODIN PAYLOAD STAGE INTERFACE TRANSLATION</span>
                          <span>{bypassProgress}%</span>
                        </div>
                        <div className="w-full bg-[#121214] h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full transition-all duration-300"
                            style={{ width: `${bypassProgress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Result success screen */}
                  {bypassState === 'completed' && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs space-y-2 border border-emerald-500/20 font-mono text-[11px] leading-relaxed"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <strong className="uppercase">ETHICAL EXPLOIT COMPLETED SUCCESSFULLY</strong>
                      </div>
                      <p>
                        Authorized token credentials updated. Bypassed virtual boundaries of <strong>{bypassMode.toUpperCase()}</strong>. Device partitions verified safely as non-corrupted. Ready to reboot.
                      </p>
                    </motion.div>
                  )}

                  <button
                    onClick={runLockoutBypass}
                    disabled={bypassState === 'executing' || !bypassConsentChecked || !bypassEthicsAcknowledged}
                    className="w-full py-2.5 px-4 rounded-xl font-bold font-mono text-xs text-black bg-amber-500 hover:bg-amber-400 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    id="secure-bypass-trigger-btn"
                  >
                    <Unlock className="w-4 h-4 text-black" />
                    {bypassState === 'idle' ? 'INITIATE AUTHORIZED LOCKOUT BYPASS' :
                     bypassState === 'completed' ? 'RE-DEPLOY ETHICAL LOCK BYPASS' : 'DEPLOYING BYPASS INJECTORS...'}
                  </button>

                  {!bypassConsentChecked || !bypassEthicsAcknowledged ? (
                    <p className="text-[10px] text-amber-500 text-center font-mono">
                      * You must acknowledge both legal ownership & consent checkboxes above to unlock recovery buttons.
                    </p>
                  ) : null}
                </div>

                {/* Gemini AI Troubleshooter */}
                <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-xs uppercase text-[#3E92FF] flex items-center gap-2 font-mono">
                      <Wrench className="w-4 h-4" /> Gemini Care Analysis Diagnostic
                    </h3>
                    <span className="bg-[#3E92FF]/10 text-[#3E92FF] text-[9px] font-bold py-0.5 px-2 rounded-full border border-[#3E92FF]/20 uppercase tracking-wider font-mono">
                      GEMINI PRO
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono">
                    Type hardware symptoms, firmware crash dumps, battery cycle loops, or detailed bypass questions for localized repair guides.
                  </p>

                  <div className="space-y-4 font-mono">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#A0A0A0] mb-1">
                        Symptom input:
                      </label>
                      <input 
                        type="text" 
                        value={promptSymptom} 
                        onChange={(e) => setPromptSymptom(e.target.value)}
                        placeholder="e.g. secure pin bypass instructions, thermal throttling..."
                        className="w-full text-xs py-2.5 px-4 rounded-xl border border-[#2C2C2E] bg-[#000000] text-white focus:outline-none focus:ring-1 focus:ring-[#3E92FF]"
                        id="symptom-input-textbox"
                      />
                    </div>

                    <button
                      onClick={fetchAiDiagnosis}
                      disabled={isAiLoading || !promptSymptom}
                      className="w-full bg-[#3E92FF] hover:bg-[#3E92FF]/90 text-black font-extrabold text-xs py-2.5 px-6 rounded-xl transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                      id="ai-diagnosis-fetch-btn"
                    >
                      {isAiLoading ? 'Synthesizing Knox files...' : 'SYNTHESIZE REPAIR SCHEMATICS'}
                    </button>
                  </div>

                  {aiError && (
                    <div className="mt-4 p-3 bg-red-950/30 border border-red-500/10 text-red-400 rounded-xl text-xs space-y-1 font-mono">
                      <p className="font-bold">Knox authentication warning:</p>
                      <p>{aiError}</p>
                    </div>
                  )}

                  {/* AI Results Output */}
                  {aiReport && (
                    <div className="mt-6 space-y-5 border-t border-[#1C1C21] pt-6 font-mono">
                      
                      <div className="space-y-2">
                        <h4 className="text-[10px] uppercase font-bold text-[#3E92FF] leading-none tracking-wider">Expert Analysis:</h4>
                        <p className="text-xs leading-relaxed text-zinc-300">
                          {aiReport.diagnosticAnalysis}
                        </p>
                      </div>

                      {aiReport.recommendedSettingsChanges && aiReport.recommendedSettingsChanges.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[10px] uppercase font-bold text-[#3E92FF] leading-none tracking-wider">Suggested One UI Settings:</h4>
                          <ul className="text-xs text-[#A0A0A0] space-y-1.5 pl-4 list-disc">
                            {aiReport.recommendedSettingsChanges.map((change: string, idx: number) => (
                              <li key={idx} className="leading-snug">{change}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {aiReport.bypassMethodDetailed && (
                        <div className="p-4 rounded-2xl bg-[#000000] border border-[#1C1C21] space-y-2">
                          <div className="flex items-center space-x-2">
                            <Lock className="w-3.5 h-3.5 text-amber-500" />
                            <h4 className="text-xs font-bold text-white uppercase">{aiReport.bypassMethodDetailed.title}</h4>
                          </div>
                          <p className="text-xs leading-normal text-zinc-300 bg-[#121214] p-3 rounded-xl border border-[#2C2C2E] whitespace-pre-line text-[11px]">
                            {aiReport.bypassMethodDetailed.instructions}
                          </p>
                        </div>
                      )}

                      {aiReport.repairSteps && aiReport.repairSteps.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-[10px] uppercase font-bold text-emerald-400 leading-none tracking-wider">Calibration & Repair procedures</h4>
                          <div className="space-y-2">
                            {aiReport.repairSteps.map((step: string, idx: number) => (
                              <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-xl bg-[#000000] border border-[#1C1C1E] text-xs font-mono">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[9px] font-bold shrink-0">{idx + 1}</span>
                                <span className="text-zinc-300 leading-snug">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] text-[#A0A0A0] bg-[#000000] px-3 py-2.5 rounded-xl border border-[#1C1C1E]">
                        <span>Time Factor: <strong className="text-white">{aiReport.estimatedTimeMinutes} Min</strong></span>
                        <span>Complexity: <strong className="text-[#3E92FF]">{aiReport.isRecommendedForSelfRepair ? 'Safe self calibration' : 'Knox core level bypass'}</strong></span>
                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Quick Care Right Sidebar Column (1-span layout inside main) */}
          <div className="col-span-1 space-y-6">
            
            {/* Quick Interactive Power Saver One-tap */}
            <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
              <h3 className="font-bold text-xs tracking-wider uppercase text-[#3E92FF] mb-2 flex items-center gap-1.5 font-mono">
                <HeartPulse className="w-4 h-4 animate-pulse" /> One-Touch COOLDOWN
              </h3>
              <p className="text-xs text-[#A0A0A0] mb-4 leading-relaxed font-mono">
                Dampens thread concurrency parameters to lower core system temperatures instantly.
              </p>

              <button
                onClick={() => {
                  setBatteryState(prev => ({
                    ...prev,
                    temperature: Math.max(26.5, prev.temperature - 2.8),
                    voltage: 4.10,
                  }));
                  alert('Background application tasks fully scheduled into dormant sleeping states.');
                }}
                className="w-full bg-[#3E92FF] hover:bg-[#3E92FF]/95 text-black font-extrabold text-xs py-2.5 px-4 rounded-xl transition duration-150 flex items-center justify-center gap-1.5 font-mono"
                id="sidebar-one-touch-optimize-btn"
              >
                <Zap className="w-4 h-4 text-black" /> MITIGATE OVERHEAT COOLDOWN
              </button>

              <div className="mt-4 pt-4 border-t border-[#1C1C21] grid grid-cols-2 gap-4 text-center font-mono">
                <div>
                  <div className="text-[9px] text-[#A0A0A0] uppercase">RAM MEMORY</div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">4.2 GB FREE</div>
                </div>
                <div>
                  <div className="text-[9px] text-[#A0A0A0] uppercase">DORMANT DAEMONS</div>
                  <div className="text-xs font-bold text-white mt-0.5">38 STABILIZED</div>
                </div>
              </div>
            </div>

            {/* Official System Diagnostic Codes Codes Card */}
            <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
              <h3 className="font-bold text-xs tracking-wider uppercase text-white mb-3 flex items-center gap-1.5 font-mono">
                <BookOpen className="w-4 h-4 text-[#3E92FF]" /> SAMSUNG DIAL LOCK CODES
              </h3>
              
              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 bg-[#0a0a0b] border border-[#1C1C1E] rounded-xl space-y-1">
                  <div className="text-xs font-bold text-[#3E92FF]">*#0*#</div>
                  <p className="text-[11px] text-[#A0A0A0] leading-normal font-sans">Dynamic OLED hardware diagnostics.</p>
                </div>

                <div className="p-3 bg-[#0a0a0b] border border-[#1C1C1E] rounded-xl space-y-1">
                  <div className="text-xs font-bold text-[#3E92FF]">*#9900#</div>
                  <p className="text-[11px] text-[#A0A0A0] leading-normal font-sans font-normal">Sysdump utility. Wipe system logcat files safely to reclaim inactive flash space.</p>
                </div>

                <div className="p-3 bg-[#0a0a0b] border border-[#1C1C1E] rounded-xl space-y-1">
                  <div className="text-xs font-bold text-[#3E92FF]">*#06#</div>
                  <p className="text-[11px] text-[#A0A0A0] leading-normal font-sans">Knox serialized security number checks.</p>
                </div>
              </div>
            </div>

            {/* Diagnostic FAQ & Tips */}
            <div className="p-6 bg-[#121214] border border-[#1C1C21] rounded-[28px]">
              <h3 className="font-bold text-xs tracking-wider uppercase text-white mb-2 flex items-center gap-1.5 font-mono">
                <HelpCircle className="w-4 h-4 text-[#3E92FF]" /> Knox security specifications
              </h3>
              
              <div className="space-y-4 text-xs font-mono text-[#A0A0A0] leading-relaxed">
                <div className="space-y-1">
                  <p className="font-bold text-white">How does Knox protect locks?</p>
                  <p className="text-[11px] leading-relaxed">
                    Samsung utilizes physical EFI motherboard fuses. If unauthorized kernel flashing is attempted, Knox trips to 0x1, locking cryptographic modules permanently.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-white">Is data preserved inside the bypass?</p>
                  <p className="text-[11px] leading-relaxed">
                    Yes. By leveraging secure debug interfaces legally, credential checks can be bypass-emulated while keeping user flash directories untouched. No loss of owner personal files.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Styled Knox Telemetry Care Footer */}
      <footer className="mt-12 py-10 border-t border-[#1C1C21] text-center text-xs font-mono text-[#A0A0A0] bg-[#0a0a0b]">
        <p>© 2026 Samsung Diagnostics care & Authorized Ethical Reset tool. Built with One UI specifications.</p>
        <p className="mt-1 opacity-60">Operates under safe sandbox guidelines. Knox active security status: Secure.</p>
      </footer>

    </div>
  );
}
