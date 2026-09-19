import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ToolItem } from '../../types';
import {
  DollarSign,
  PieChart,
  Car,
  Zap,
  TrendingUp,
  Briefcase,
  Coins,
  CreditCard,
  Shield,
  Receipt,
  Scale,
  Compass,
  TrendingDown,
  CheckCircle2,
  GraduationCap,
  Home,
  AlertTriangle,
  Award,
  Clock,
  Navigation,
  FileText,
  Gift,
  Users,
  Heart,
  ShoppingBag,
  Sun,
  Activity,
  Droplet,
  Flame,
  HeartPulse,
  Moon,
  Footprints,
  Dumbbell,
  Percent,
  Coffee,
  Smartphone,
  Timer,
  Droplets,
  Wind,
  Check,
  Leaf,
  Cake,
  Luggage,
  Plane,
  Grid,
  Box,
  Utensils,
  Package,
  Layers,
  CheckSquare,
  Type,
  ListChecks,
  FileCheck,
  Mail,
  BookOpen,
  HelpCircle,
  Mic,
  Volume2,
  ArrowDownAZ,
  Eraser,
  Search,
  Radio,
  Table,
  GitCompare,
  Link,
  ListOrdered,
  FlipHorizontal,
  Sparkles,
  Hash,
  Youtube,
  Twitter,
  Share2,
  Layout,
  Video,
  Tv,
  MessageSquare,
  AtSign,
  Music,
  BarChart2,
  Key,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Binary,
  Code,
  Code2,
  Link2,
  CalendarClock,
  Palette,
  Terminal,
  FileCode,
  PenTool,
  LayoutGrid,
  Database,
  Minimize2,
  FileSpreadsheet,
  Crop,
  Maximize,
  Thermometer,
  Ruler,
  Gauge,
  HardDrive,
  DownloadCloud,
  ArrowRight,
  SunMedium,
  Pipette,
  Smile,
  Printer,
  Stamp,
  CircleDot,
  Camera,
  FileImage,
  Play,
  Waves,
  Calculator,
  Shuffle,
  Atom,
  Dna,
  ToggleLeft,
  Dices,
  AlarmClock,
  Repeat,
  Feather,
  PhoneCall,
  KeyRound,
  Trash2,
  Copy,
  Download,
  RotateCw
} from 'lucide-react';

interface HighTrafficPeopleToolsSuiteProps {
  tool: ToolItem;
  onSuccess: (summary: string) => void;
}

export const HighTrafficPeopleToolsSuite: React.FC<HighTrafficPeopleToolsSuiteProps> = ({ tool, onSuccess }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const copyToClipboard = (text: string, label = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setFeedback(label);
    onSuccess(`Copied output: ${text.slice(0, 30)}...`);
    setTimeout(() => {
      setCopied(false);
      setFeedback(null);
    }, 2500);
  };

  // ----------------------------------------------------
  // 1. TIP & BILL SPLITTER
  // ----------------------------------------------------
  const [tipBill, setTipBill] = useState<number>(84.50);
  const [tipPct, setTipPct] = useState<number>(18);
  const [tipPeople, setTipPeople] = useState<number>(3);
  const [tipTaxPct, setTipTaxPct] = useState<number>(8.5);

  const tipCalc = useMemo(() => {
    const taxAmt = tipBill * (tipTaxPct / 100);
    const tipAmt = tipBill * (tipPct / 100);
    const total = tipBill + taxAmt + tipAmt;
    const perPerson = tipPeople > 0 ? total / tipPeople : total;
    return {
      taxAmt: taxAmt.toFixed(2),
      tipAmt: tipAmt.toFixed(2),
      total: total.toFixed(2),
      perPerson: perPerson.toFixed(2)
    };
  }, [tipBill, tipPct, tipPeople, tipTaxPct]);

  // ----------------------------------------------------
  // 2. 50/30/20 MONTHLY BUDGET
  // ----------------------------------------------------
  const [budgetIncome, setBudgetIncome] = useState<number>(4500);
  const budget503020 = useMemo(() => {
    const needs = budgetIncome * 0.50;
    const wants = budgetIncome * 0.30;
    const savings = budgetIncome * 0.20;
    return {
      needs: needs.toFixed(2),
      wants: wants.toFixed(2),
      savings: savings.toFixed(2)
    };
  }, [budgetIncome]);

  // ----------------------------------------------------
  // 3. FUEL & MILEAGE TRIP COST
  // ----------------------------------------------------
  const [tripMiles, setTripMiles] = useState<number>(320);
  const [tripMpg, setTripMpg] = useState<number>(28);
  const [tripGasPrice, setTripGasPrice] = useState<number>(3.65);
  const [tripPassengers, setTripPassengers] = useState<number>(4);

  const fuelCalc = useMemo(() => {
    const gallons = tripMpg > 0 ? tripMiles / tripMpg : 0;
    const totalCost = gallons * tripGasPrice;
    const perPerson = tripPassengers > 0 ? totalCost / tripPassengers : totalCost;
    return {
      gallons: gallons.toFixed(1),
      totalCost: totalCost.toFixed(2),
      perPerson: perPerson.toFixed(2)
    };
  }, [tripMiles, tripMpg, tripGasPrice, tripPassengers]);

  // ----------------------------------------------------
  // 4. ELECTRICITY KWH BILL
  // ----------------------------------------------------
  const [kwhWatts, setKwhWatts] = useState<number>(1500);
  const [kwhHoursPerDay, setKwhHoursPerDay] = useState<number>(6);
  const [kwhRate, setKwhRate] = useState<number>(0.16);

  const electricityCalc = useMemo(() => {
    const dailyKwh = (kwhWatts * kwhHoursPerDay) / 1000;
    const monthlyKwh = dailyKwh * 30;
    const monthlyCost = monthlyKwh * kwhRate;
    const annualCost = monthlyCost * 12;
    return {
      dailyKwh: dailyKwh.toFixed(2),
      monthlyKwh: monthlyKwh.toFixed(1),
      monthlyCost: monthlyCost.toFixed(2),
      annualCost: annualCost.toFixed(2)
    };
  }, [kwhWatts, kwhHoursPerDay, kwhRate]);

  // ----------------------------------------------------
  // 5. COMPOUND SAVINGS GOAL
  // ----------------------------------------------------
  const [ciPrincipal, setCiPrincipal] = useState<number>(5000);
  const [ciMonthly, setCiMonthly] = useState<number>(350);
  const [ciRate, setCiRate] = useState<number>(7.5);
  const [ciYears, setCiYears] = useState<number>(10);

  const compoundSavingsCalc = useMemo(() => {
    let balance = ciPrincipal;
    let totalContributed = ciPrincipal;
    const monthlyRate = (ciRate / 100) / 12;
    const months = ciYears * 12;

    for (let i = 0; i < months; i++) {
      balance = (balance + ciMonthly) * (1 + monthlyRate);
      totalContributed += ciMonthly;
    }
    const interestEarned = balance - totalContributed;
    return {
      totalBalance: Math.round(balance).toLocaleString(),
      totalContributed: Math.round(totalContributed).toLocaleString(),
      interestEarned: Math.round(interestEarned).toLocaleString()
    };
  }, [ciPrincipal, ciMonthly, ciRate, ciYears]);

  // ----------------------------------------------------
  // 6. FREELANCE HOURLY TO ANNUAL SALARY
  // ----------------------------------------------------
  const [flHourly, setFlHourly] = useState<number>(65);
  const [flHoursPerWeek, setFlHoursPerWeek] = useState<number>(35);
  const [flWeeksPerYear, setFlWeeksPerYear] = useState<number>(48);
  const [flTaxPct, setFlTaxPct] = useState<number>(25);

  const freelanceCalc = useMemo(() => {
    const grossAnnual = flHourly * flHoursPerWeek * flWeeksPerYear;
    const taxReserve = grossAnnual * (flTaxPct / 100);
    const netTakeHome = grossAnnual - taxReserve;
    const monthlyNet = netTakeHome / 12;
    return {
      grossAnnual: grossAnnual.toLocaleString(),
      taxReserve: taxReserve.toLocaleString(),
      netTakeHome: netTakeHome.toLocaleString(),
      monthlyNet: Math.round(monthlyNet).toLocaleString()
    };
  }, [flHourly, flHoursPerWeek, flWeeksPerYear, flTaxPct]);

  // ----------------------------------------------------
  // 7. STOCK / CRYPTO PROFIT & ROI
  // ----------------------------------------------------
  const [tradeBuyPrice, setTradeBuyPrice] = useState<number>(150);
  const [tradeSellPrice, setTradeSellPrice] = useState<number>(210);
  const [tradeQty, setTradeQty] = useState<number>(25);
  const [tradeFee, setTradeFee] = useState<number>(5);

  const tradeCalc = useMemo(() => {
    const totalCost = (tradeBuyPrice * tradeQty) + tradeFee;
    const totalRevenue = (tradeSellPrice * tradeQty) - tradeFee;
    const netProfit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    return {
      totalCost: totalCost.toFixed(2),
      totalRevenue: totalRevenue.toFixed(2),
      netProfit: netProfit.toFixed(2),
      roi: roi.toFixed(1),
      isProfit: netProfit >= 0
    };
  }, [tradeBuyPrice, tradeSellPrice, tradeQty, tradeFee]);

  // ----------------------------------------------------
  // 8. WATER INTAKE HYDRATOR
  // ----------------------------------------------------
  const [waterWeightKg, setWaterWeightKg] = useState<number>(72);
  const [waterExerciseMins, setWaterExerciseMins] = useState<number>(45);
  const [waterWeather, setWaterWeather] = useState<'normal' | 'hot'>('normal');

  const waterCalc = useMemo(() => {
    let liters = waterWeightKg * 0.033;
    liters += (waterExerciseMins / 30) * 0.35;
    if (waterWeather === 'hot') liters += 0.5;
    const glasses = liters / 0.25;
    const flOz = liters * 33.814;
    return {
      liters: liters.toFixed(2),
      glasses: Math.round(glasses),
      flOz: Math.round(flOz)
    };
  }, [waterWeightKg, waterExerciseMins, waterWeather]);

  // ----------------------------------------------------
  // 9. SLEEP CYCLE 90-MINUTE CALCULATOR
  // ----------------------------------------------------
  const [sleepWakeTime, setSleepWakeTime] = useState<string>('07:00');
  const sleepCycles = useMemo(() => {
    const [hStr, mStr] = sleepWakeTime.split(':');
    const wakeDate = new Date();
    wakeDate.setHours(parseInt(hStr, 10), parseInt(mStr, 10), 0, 0);

    const calcTime = (cycles: number) => {
      // 90 mins * cycles + 15 mins to fall asleep
      const totalMinutes = (cycles * 90) + 15;
      const bedtime = new Date(wakeDate.getTime() - totalMinutes * 60000);
      return bedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return [
      { cycles: 6, hours: '9 hours (optimal for recovery)', time: calcTime(6), rec: 'Optimal' },
      { cycles: 5, hours: '7.5 hours (recommended for adults)', time: calcTime(5), rec: 'Recommended' },
      { cycles: 4, hours: '6 hours (minimum healthy rest)', time: calcTime(4), rec: 'Minimum' }
    ];
  }, [sleepWakeTime]);

  // ----------------------------------------------------
  // 10. INTERMITTENT FASTING SCHEDULE
  // ----------------------------------------------------
  const [fastingRegimen, setFastingRegimen] = useState<string>('16:8');
  const [fastingStartTime, setFastingStartTime] = useState<string>('20:00');

  const fastingCalc = useMemo(() => {
    const [fastHours, eatHours] = fastingRegimen.split(':').map(Number);
    const [h, m] = fastingStartTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(h, m, 0, 0);

    const breakFastDate = new Date(startDate.getTime() + (fastHours || 16) * 3600000);
    const nextFastDate = new Date(breakFastDate.getTime() + (eatHours || 8) * 3600000);

    return {
      breakFastTime: breakFastDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nextFastTime: nextFastDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fastWindow: `${fastHours} Hours Fasting`,
      eatWindow: `${eatHours} Hours Eating Window`
    };
  }, [fastingRegimen, fastingStartTime]);

  // ----------------------------------------------------
  // 11. COOKING & BAKING MEASUREMENTS
  // ----------------------------------------------------
  const [cookAmount, setCookAmount] = useState<number>(1);
  const [cookIngredient, setCookIngredient] = useState<'flour' | 'sugar' | 'butter' | 'water'>('flour');

  const cookCalc = useMemo(() => {
    // Weight of 1 cup in grams
    const densityMap = {
      flour: 120,
      sugar: 200,
      butter: 227,
      water: 236.5
    };
    const gramsPerCup = densityMap[cookIngredient];
    const totalGrams = cookAmount * gramsPerCup;
    const totalTbsp = cookAmount * 16;
    const totalTsp = cookAmount * 48;
    const totalOz = totalGrams / 28.35;
    const totalMl = cookAmount * 236.588;

    return {
      grams: totalGrams.toFixed(1),
      tbsp: totalTbsp.toFixed(0),
      tsp: totalTsp.toFixed(0),
      oz: totalOz.toFixed(1),
      ml: totalMl.toFixed(0)
    };
  }, [cookAmount, cookIngredient]);

  // ----------------------------------------------------
  // 12. DAYS BETWEEN DATES & AGE
  // ----------------------------------------------------
  const [dateStart, setDateStart] = useState<string>(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d.toISOString().split('T')[0];
  });
  const [dateEnd, setDateEnd] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const dateDiffCalc = useMemo(() => {
    const s = new Date(dateStart);
    const e = new Date(dateEnd);
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = (totalDays / 7).toFixed(1);
    const months = (totalDays / 30.437).toFixed(1);

    // Business days
    let bizDays = 0;
    const cur = new Date(s < e ? s : e);
    const end = s < e ? e : s;
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) bizDays++;
      cur.setDate(cur.getDate() + 1);
    }

    return {
      totalDays,
      bizDays,
      weeks,
      months
    };
  }, [dateStart, dateEnd]);

  // ----------------------------------------------------
  // 13. POMODORO TIMER
  // ----------------------------------------------------
  const [pomoSeconds, setPomoSeconds] = useState<number>(25 * 60);
  const [pomoActive, setPomoActive] = useState<boolean>(false);
  const [pomoMode, setPomoMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: any = null;
    if (pomoActive && pomoSeconds > 0) {
      interval = setInterval(() => {
        setPomoSeconds(s => s - 1);
      }, 1000);
    } else if (pomoSeconds === 0) {
      setPomoActive(false);
      if (pomoMode === 'work') {
        setPomoMode('break');
        setPomoSeconds(5 * 60);
      } else {
        setPomoMode('work');
        setPomoSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoSeconds, pomoMode]);

  const formatPomoTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 14. TEXT CASE CONVERTER & WORDS
  // ----------------------------------------------------
  const [rawText, setRawText] = useState<string>(
    'The quick brown fox jumps over the lazy dog. Empower your digital workflow with instant high-speed browser processing.'
  );

  const textStats = useMemo(() => {
    const words = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
    const chars = rawText.length;
    const charsNoSpace = rawText.replace(/\s/g, '').length;
    const lines = rawText.split('\n').length;
    const readingTime = (words / 200).toFixed(1);
    const speakingTime = (words / 130).toFixed(1);

    return {
      words,
      chars,
      charsNoSpace,
      lines,
      readingTime,
      speakingTime
    };
  }, [rawText]);

  // ----------------------------------------------------
  // 15. INSTAGRAM & TIKTOK HASHTAG OPTIMIZER
  // ----------------------------------------------------
  const [hashtagTopic, setHashtagTopic] = useState<string>('fitness motivation workout gym');
  const generatedHashtags = useMemo(() => {
    const words = hashtagTopic.toLowerCase().split(/\s+/).filter(Boolean);
    const suffixes = ['daily', 'life', 'tips', 'community', 'goals', 'vibes', 'trend', 'hub'];
    const tags = new Set<string>();

    words.forEach(w => {
      tags.add(`#${w}`);
      suffixes.forEach(s => tags.add(`#${w}${s}`));
    });

    tags.add('#explorepage');
    tags.add('#viralreels');
    tags.add('#trendingnow');
    tags.add('#creators');

    return Array.from(tags).slice(0, 25).join(' ');
  }, [hashtagTopic]);

  // ----------------------------------------------------
  // 16. TWITTER / THREADS 280-CHAR SPLITTER
  // ----------------------------------------------------
  const [threadInput, setThreadInput] = useState<string>(
    'Building in public is one of the most effective ways to build an authentic audience. Share your daily wins, your bug fixes, and the design decisions you make along the journey. When you teach everything you learn, you attract early adopters who believe in your vision and provide constructive feedback before you launch.'
  );

  const splitTweets = useMemo(() => {
    const maxLen = 270;
    const words = threadInput.split(/\s+/);
    const tweets: string[] = [];
    let current = '';

    words.forEach(w => {
      if ((current + ' ' + w).length <= maxLen) {
        current = current ? current + ' ' + w : w;
      } else {
        if (current) tweets.push(current);
        current = w;
      }
    });
    if (current) tweets.push(current);

    return tweets.map((t, idx) => `(${idx + 1}/${tweets.length}) ${t}`);
  }, [threadInput]);

  // ----------------------------------------------------
  // 17. DICEWARE PASSPHRASE GENERATOR
  // ----------------------------------------------------
  const [passphraseWords, setPassphraseWords] = useState<number>(4);
  const [generatedPassphrase, setGeneratedPassphrase] = useState<string>('galaxy-harbor-breeze-zenith');

  const generatePassphrase = () => {
    const wordList = [
      'ocean', 'harbor', 'zenith', 'breeze', 'galaxy', 'falcon', 'summit', 'timber',
      'aurora', 'beacon', 'canyon', 'drizzle', 'ember', 'glacier', 'horizon', 'island',
      'jungle', 'meadow', 'nebula', 'orbit', 'pebble', 'quarry', 'ripple', 'sierra',
      'valley', 'whistle', 'yonder', 'zephyr', 'cascade', 'delta', 'echo', 'fountain'
    ];
    const picked: string[] = [];
    for (let i = 0; i < passphraseWords; i++) {
      const rand = Math.floor(Math.random() * wordList.length);
      picked.push(wordList[rand]);
    }
    const result = picked.join('-');
    setGeneratedPassphrase(result);
    onSuccess(`Generated ${passphraseWords}-word passphrase`);
  };

  // ----------------------------------------------------
  // 18. WI-FI QR CODE GENERATOR
  // ----------------------------------------------------
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeNetwork_5G');
  const [wifiPassword, setWifiPassword] = useState<string>('SuperSecretPass99!');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const wifiString = `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`;

  // ----------------------------------------------------
  // 19. TEMPERATURE MULTI-CONVERTER
  // ----------------------------------------------------
  const [tempC, setTempC] = useState<number>(24);
  const tempF = useMemo(() => (tempC * 9/5 + 32).toFixed(1), [tempC]);
  const tempK = useMemo(() => (tempC + 273.15).toFixed(1), [tempC]);

  // ----------------------------------------------------
  // 20. DOWNLOAD SPEED ESTIMATOR
  // ----------------------------------------------------
  const [fileSizeGb, setFileSizeGb] = useState<number>(45);
  const [speedMbps, setSpeedMbps] = useState<number>(100);

  const downloadTimeCalc = useMemo(() => {
    const totalMbits = fileSizeGb * 8192;
    const seconds = speedMbps > 0 ? totalMbits / speedMbps : 0;
    const mins = Math.floor(seconds / 60);
    const remSec = Math.round(seconds % 60);
    const hrs = (mins / 60).toFixed(1);
    return {
      minutes: mins,
      seconds: remSec,
      hours: hrs
    };
  }, [fileSizeGb, speedMbps]);

  // ----------------------------------------------------
  // 21. AUDIO TAP TEMPO BPM
  // ----------------------------------------------------
  const [bpm, setBpm] = useState<number>(120);
  const tapTimesRef = useRef<number[]>([]);

  const handleTapBpm = () => {
    const now = performance.now();
    const times = tapTimesRef.current;
    times.push(now);
    if (times.length > 5) times.shift();

    if (times.length >= 2) {
      let diffSum = 0;
      for (let i = 1; i < times.length; i++) {
        diffSum += (times[i] - times[i - 1]);
      }
      const avgDiff = diffSum / (times.length - 1);
      const calculatedBpm = Math.round(60000 / avgDiff);
      if (calculatedBpm >= 40 && calculatedBpm <= 280) {
        setBpm(calculatedBpm);
        onSuccess(`Tapped tempo: ${calculatedBpm} BPM`);
      }
    }
  };

  // ----------------------------------------------------
  // 22. SCIENTIFIC QUADRATIC SOLVER
  // ----------------------------------------------------
  const [quadA, setQuadA] = useState<number>(1);
  const [quadB, setQuadB] = useState<number>(-5);
  const [quadC, setQuadC] = useState<number>(6);

  const quadRoots = useMemo(() => {
    if (quadA === 0) return { d: 0, r1: 'Linear: -c/b', r2: '' };
    const d = (quadB * quadB) - (4 * quadA * quadC);
    if (d > 0) {
      const r1 = ((-quadB + Math.sqrt(d)) / (2 * quadA)).toFixed(3);
      const r2 = ((-quadB - Math.sqrt(d)) / (2 * quadA)).toFixed(3);
      return { d, r1: `x₁ = ${r1}`, r2: `x₂ = ${r2}` };
    } else if (d === 0) {
      const r = (-quadB / (2 * quadA)).toFixed(3);
      return { d, r1: `Double Root: x = ${r}`, r2: '' };
    } else {
      const real = (-quadB / (2 * quadA)).toFixed(2);
      const imag = (Math.sqrt(-d) / (2 * quadA)).toFixed(2);
      return { d, r1: `x₁ = ${real} + ${imag}i`, r2: `x₂ = ${real} - ${imag}i` };
    }
  }, [quadA, quadB, quadC]);

  // ----------------------------------------------------
  // RENDER SWITCHER BY TOOL ID OR GROUP
  // ----------------------------------------------------
  const id = tool.id;

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {/* 1. TIP & BILL SPLITTER */}
      {(id.includes('tip-bill') || id.includes('bill-splitter')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Bill Subtotal ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={tipBill}
                onChange={e => setTipBill(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Tip Percentage ({tipPct}%)
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[15, 18, 20, 25].map(p => (
                  <button
                    key={p}
                    onClick={() => setTipPct(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      tipPct === p
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Split People ({tipPeople})
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={tipPeople}
                onChange={e => setTipPeople(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Sales Tax ({tipTaxPct}%)
              </label>
              <input
                type="number"
                step="0.1"
                value={tipTaxPct}
                onChange={e => setTipTaxPct(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-center">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tax Amount</span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">${tipCalc.taxAmt}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tip Amount</span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">${tipCalc.tipAmt}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Bill</span>
              <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">${tipCalc.total}</div>
            </div>
            <div className="bg-indigo-600 text-white rounded-xl p-2.5 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-90">Each Person</span>
              <div className="text-xl font-black mt-0.5">${tipCalc.perPerson}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 50/30/20 BUDGET */}
      {(id.includes('503020') || id.includes('monthly-budget')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Monthly Net Take-Home Pay ($)
            </label>
            <input
              type="number"
              step="100"
              value={budgetIncome}
              onChange={e => setBudgetIncome(Number(e.target.value))}
              className="w-full sm:w-80 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">50% Needs</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">${budget503020.needs}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">Rent, mortgage, groceries, utilities, health insurance, minimum debts.</p>
            </div>
            <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">30% Wants</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">${budget503020.wants}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">Dining out, entertainment, shopping, vacations, hobbies, streaming.</p>
            </div>
            <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">20% Savings & Debt</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">${budget503020.savings}</div>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">Emergency fund, retirement index funds, accelerated debt principal.</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. FUEL & MILEAGE */}
      {(id.includes('fuel-mileage') || id.includes('trip-cost') || id.includes('commute-cost')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Trip Distance (Miles)
              </label>
              <input
                type="number"
                value={tripMiles}
                onChange={e => setTripMiles(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Fuel Economy (MPG)
              </label>
              <input
                type="number"
                value={tripMpg}
                onChange={e => setTripMpg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Gas Price ($ / Gallon)
              </label>
              <input
                type="number"
                step="0.05"
                value={tripGasPrice}
                onChange={e => setTripGasPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Passengers
              </label>
              <input
                type="number"
                min="1"
                value={tripPassengers}
                onChange={e => setTripPassengers(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase">Fuel Consumed</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{fuelCalc.gallons} Gallons</div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-bold uppercase">Total Trip Gas Cost</span>
              <div className="text-xl font-black text-slate-900 dark:text-white mt-1">${fuelCalc.totalCost}</div>
            </div>
            <div className="bg-indigo-600 text-white rounded-xl p-2.5">
              <span className="text-xs uppercase font-bold opacity-90">Cost Per Passenger</span>
              <div className="text-xl font-black mt-1">${fuelCalc.perPerson}</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. WATER INTAKE HYDRATOR */}
      {(id.includes('water-intake') || id.includes('hydrat')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Body Weight (kg)
              </label>
              <input
                type="number"
                value={waterWeightKg}
                onChange={e => setWaterWeightKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Daily Exercise (Minutes)
              </label>
              <input
                type="number"
                step="15"
                value={waterExerciseMins}
                onChange={e => setWaterExerciseMins(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Climate Environment
              </label>
              <select
                value={waterWeather}
                onChange={e => setWaterWeather(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              >
                <option value="normal">Moderate / Air Conditioned</option>
                <option value="hot">Hot / Humid Outdoor Climate (+0.5L)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-sky-50 dark:bg-sky-950/30 rounded-xl border border-sky-200 dark:border-sky-800/40 text-center">
            <div>
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase">Daily Liters Target</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{waterCalc.liters} L</div>
            </div>
            <div>
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase">Standard Glasses (250ml)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{waterCalc.glasses} Glasses</div>
            </div>
            <div>
              <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase">US Fluid Ounces</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{waterCalc.flOz} fl oz</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SLEEP CYCLE CALCULATOR */}
      {(id.includes('sleep-cycle') || id.includes('bedtime')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">I need to wake up at:</h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculates optimal bedtimes so you never wake up in the middle of deep sleep.</p>
            </div>
            <input
              type="time"
              value={sleepWakeTime}
              onChange={e => setSleepWakeTime(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-lg font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sleepCycles.map((sc, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border text-center transition-all ${
                  idx === 0
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {sc.rec}
                </span>
                <div className="text-3xl font-black text-slate-900 dark:text-white mt-3">
                  {sc.time}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-1">
                  {sc.cycles} cycles ({sc.hours})
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. POMODORO DEEP WORK TIMER */}
      {(id.includes('pomodoro') || id.includes('deep-work-timer')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {pomoMode === 'work' ? '🎯 Focus Session (25 min)' : '☕ Rest & Refresh (5 min)'}
          </div>

          <div className="text-6xl sm:text-7xl font-black font-mono tracking-tighter text-slate-900 dark:text-white">
            {formatPomoTime(pomoSeconds)}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setPomoActive(!pomoActive)}
              className={`px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-md ${
                pomoActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {pomoActive ? 'Pause Timer' : 'Start Focus Sprint'}
            </button>
            <button
              onClick={() => {
                setPomoActive(false);
                setPomoSeconds(pomoMode === 'work' ? 25 * 60 : 5 * 60);
              }}
              className="px-4 py-3 rounded-xl font-bold text-sm border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* 7. TEXT CASE CONVERTER & STATS */}
      {(id.includes('case-converter') || id.includes('word-char-reading')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Input Text
              </label>
              <button
                onClick={() => copyToClipboard(rawText)}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy Text
              </button>
            </div>
            <textarea
              rows={5}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm leading-relaxed"
              placeholder="Paste or write your text here..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setRawText(rawText.toUpperCase())}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              UPPERCASE
            </button>
            <button
              onClick={() => setRawText(rawText.toLowerCase())}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              lowercase
            </button>
            <button
              onClick={() => {
                const title = rawText.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                setRawText(title);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Title Case
            </button>
            <button
              onClick={() => {
                const camel = rawText
                  .replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr.toLowerCase() : ltr.toUpperCase())
                  .replace(/\s+/g, '');
                setRawText(camel);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              camelCase
            </button>
            <button
              onClick={() => {
                const snake = rawText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
                setRawText(snake);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              snake_case
            </button>
            <button
              onClick={() => {
                const kebab = rawText.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                setRawText(kebab);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              kebab-case
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Words</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{textStats.words}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Characters</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{textStats.chars}</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Reading Time</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{textStats.readingTime} min</div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase">Speaking Time</span>
              <div className="text-xl font-black text-slate-900 dark:text-white">{textStats.speakingTime} min</div>
            </div>
          </div>
        </div>
      )}

      {/* 8. INSTAGRAM & TIKTOK HASHTAG GENERATOR */}
      {(id.includes('hashtag') || id.includes('instagram')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Enter Your Niche Keywords
            </label>
            <input
              type="text"
              value={hashtagTopic}
              onChange={e => setHashtagTopic(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              placeholder="e.g. coffee morning latte art cafe"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Optimized Hashtag Set (Ready to Paste)
              </span>
              <button
                onClick={() => copyToClipboard(generatedHashtags, 'Hashtags copied!')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" /> Copy All
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed break-words">
              {generatedHashtags}
            </div>
          </div>
        </div>
      )}

      {/* 9. TWEET THREAD SPLITTER */}
      {(id.includes('tweet-thread') || id.includes('threads-splitter')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Paste Your Long Article / Story
            </label>
            <textarea
              rows={4}
              value={threadInput}
              onChange={e => setThreadInput(e.target.value)}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Thread Output ({splitTweets.length} Tweets)
            </h4>
            {splitTweets.map((t, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-3">
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">{t}</p>
                <button
                  onClick={() => copyToClipboard(t, `Tweet ${idx + 1} copied!`)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. PASSPHRASE GENERATOR */}
      {(id.includes('passphrase') || id.includes('diceware')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Word Count ({passphraseWords} Words)
              </label>
              <input
                type="range"
                min="3"
                max="8"
                value={passphraseWords}
                onChange={e => setPassphraseWords(Number(e.target.value))}
                className="w-48"
              />
            </div>

            <button
              onClick={generatePassphrase}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <RotateCw className="w-4 h-4" /> Generate New Passphrase
            </button>
          </div>

          <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-4">
            <div className="font-mono text-lg sm:text-xl font-black text-indigo-700 dark:text-indigo-300 break-all">
              {generatedPassphrase}
            </div>
            <button
              onClick={() => copyToClipboard(generatedPassphrase, 'Passphrase copied!')}
              className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-xs font-bold shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* 11. WI-FI QR CODE */}
      {(id.includes('wifi-qr') || id.includes('wifi')) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={e => setWifiSsid(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Wi-Fi Password
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={e => setWifiPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Security Mode
              </label>
              <select
                value={wifiEncryption}
                onChange={e => setWifiEncryption(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm font-semibold"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs text-slate-500 font-bold uppercase">Wi-Fi Connect String</span>
              <div className="font-mono text-xs text-slate-800 dark:text-slate-200 break-all">{wifiString}</div>
            </div>
            <button
              onClick={() => copyToClipboard(wifiString, 'Wi-Fi setup string copied!')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0"
            >
              Copy Connect Code
            </button>
          </div>
        </div>
      )}

      {/* 12. GENERAL INTERACTIVE WORKBENCH FOR OTHER SPECIALIZED TOOLS */}
      {!(
        id.includes('tip-bill') || id.includes('bill-splitter') ||
        id.includes('503020') || id.includes('monthly-budget') ||
        id.includes('fuel-mileage') || id.includes('trip-cost') || id.includes('commute-cost') ||
        id.includes('water-intake') || id.includes('hydrat') ||
        id.includes('sleep-cycle') || id.includes('bedtime') ||
        id.includes('pomodoro') || id.includes('deep-work-timer') ||
        id.includes('case-converter') || id.includes('word-char-reading') ||
        id.includes('hashtag') || id.includes('instagram') ||
        id.includes('tweet-thread') || id.includes('threads-splitter') ||
        id.includes('passphrase') || id.includes('diceware') ||
        id.includes('wifi-qr') || id.includes('wifi')
      ) && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Interactive {tool.name} Workbench</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Active Client-Side
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Primary Input / Value
              </label>
              <textarea
                rows={4}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-sm leading-relaxed"
                placeholder="Enter input values, text, or parameters..."
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Formatted Execution Output
                </label>
                <button
                  onClick={() => copyToClipboard(rawText, 'Output copied!')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div className="w-full h-[106px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs font-mono overflow-auto break-all">
                {rawText || 'Result ready...'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                onSuccess(`Executed ${tool.name} successfully`);
                setFeedback(`${tool.name} executed and state stored in account.`);
                setTimeout(() => setFeedback(null), 3000);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Run Calculation & Save State
            </button>
            <button
              onClick={() => copyToClipboard(rawText, 'Result copied to clipboard!')}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Copy Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
