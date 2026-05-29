export interface BatteryDiagnosticState {
  healthPercentage: number;
  temperature: number; // in Celsius
  voltage: number; // in Volts
  cycleCount: number;
  chargingState: 'discharging' | 'charging' | 'full';
  timeRemaining: string;
  pluggedType: 'none' | 'ac' | 'usb' | 'wireless';
  capacityAh: number; // e.g. 5.0 Ah for 5000mAh
}

export interface SettingsState {
  brightness: number;
  volume: number;
  darkTheme: boolean;
  powerSaving: boolean;
  eyeComfort: boolean;
  dolbyAtmos: boolean;
  nearShare: boolean;
}

export interface DiagnosticsTest {
  id: string;
  name: string;
  iconName: string;
  status: 'passed' | 'failed' | 'untested' | 'testing';
  category: 'Sensors' | 'Hardware' | 'Connectivity';
  description: string;
}

export interface RepairJob {
  id: string;
  title: string;
  description: string;
  steps: string[];
  samsungOfficialGuideUrl?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface BatteryUsageStat {
  appName: string;
  percentage: number;
  type: 'system' | 'user' | 'hardware';
  activeTimeString: string;
}

export interface PerformanceProfile {
  id: 'max_perf' | 'balanced' | 'extreme_battery' | 'custom';
  name: string;
  description: string;
  cpuThrottleLimit: number; // percentage (e.g. 100 for uncapped, 60 for saver)
  backgroundAppsRestriction: 'None' | 'Standard' | 'Strict';
  refreshRate: 60 | 90 | 120;
}
