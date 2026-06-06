import { useState, useCallback, useRef } from 'react';
import { Shuffle, Download, Trash2, Plus, Eye, X, QrCode, ChevronDown, ChevronUp, Zap, Database, BarChart3, CheckCircle } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import type { Citizen } from '../Context/AuthContext';

// ── Complete India: 28 States + 8 Union Territories ──────────────
const STATES: Record<string, { districts: string[]; lang: string; isUT?: boolean }> = {
  "Andhra Pradesh":     { districts: ["Visakhapatnam","Vijayawada","Guntur","Nellore","Kurnool","Tirupati","Kakinada","Rajahmundry","Kadapa","Anantapur"], lang: "Telugu" },
  "Arunachal Pradesh":  { districts: ["Itanagar","Naharlagun","Pasighat","Tezpur","Bomdila","Ziro","Along","Tezu","Changlang","Khonsa"], lang: "Bengali" },
  "Assam":              { districts: ["Guwahati","Dibrugarh","Silchar","Jorhat","Tezpur","Nagaon","Tinsukia","Lakhimpur","Sivasagar","Dhubri"], lang: "Assamese" },
  "Bihar":              { districts: ["Patna","Gaya","Bhagalpur","Muzaffarpur","Darbhanga","Purnia","Arrah","Begusarai","Katihar","Munger"], lang: "Hindi" },
  "Chhattisgarh":       { districts: ["Raipur","Bhilai","Bilaspur","Durg","Korba","Rajnandgaon","Jagdalpur","Ambikapur","Raigarh","Dhamtari"], lang: "Hindi" },
  "Goa":                { districts: ["Panaji","Margao","Vasco da Gama","Mapusa","Ponda","Bicholim","Sanquelim","Curchorem","Pernem","Canacona"], lang: "Konkani" },
  "Gujarat":            { districts: ["Ahmedabad","Surat","Vadodara","Rajkot","Gandhinagar","Bhavnagar","Jamnagar","Junagadh","Anand","Mehsana"], lang: "Gujarati" },
  "Haryana":            { districts: ["Gurugram","Faridabad","Ambala","Rohtak","Hisar","Karnal","Panipat","Sonipat","Yamunanagar","Bhiwani"], lang: "Hindi" },
  "Himachal Pradesh":   { districts: ["Shimla","Manali","Dharamshala","Solan","Mandi","Kullu","Una","Hamirpur","Bilaspur","Chamba"], lang: "Hindi" },
  "Jharkhand":          { districts: ["Ranchi","Jamshedpur","Dhanbad","Bokaro","Deoghar","Hazaribagh","Giridih","Ramgarh","Chatra","Palamu"], lang: "Hindi" },
  "Karnataka":          { districts: ["Bengaluru","Mysuru","Hubli","Mangaluru","Belagavi","Davanagere","Ballari","Vijayapura","Shivamogga","Tumkur"], lang: "Kannada" },
  "Kerala":             { districts: ["Thiruvananthapuram","Kochi","Kozhikode","Thrissur","Kollam","Palakkad","Alappuzha","Kannur","Kottayam","Malappuram"], lang: "Malayalam" },
  "Madhya Pradesh":     { districts: ["Bhopal","Indore","Jabalpur","Gwalior","Ujjain","Sagar","Dewas","Satna","Ratlam","Rewa"], lang: "Hindi" },
  "Maharashtra":        { districts: ["Mumbai","Pune","Nagpur","Nashik","Aurangabad","Solapur","Thane","Kolhapur","Amravati","Nanded"], lang: "Marathi" },
  "Manipur":            { districts: ["Imphal","Thoubal","Bishnupur","Churachandpur","Senapati","Ukhrul","Chandel","Tamenglong","Jiribam","Kakching"], lang: "Meitei" },
  "Meghalaya":          { districts: ["Shillong","Tura","Nongpoh","Jowai","Baghmara","Williamnagar","Nongstoin","Resubelpara","Ampati","Mairang"], lang: "Khasi" },
  "Mizoram":            { districts: ["Aizawl","Lunglei","Champhai","Kolasib","Serchhip","Lawngtlai","Mamit","Saiha","Hnahthial","Khawzawl"], lang: "Mizo" },
  "Nagaland":           { districts: ["Kohima","Dimapur","Mokokchung","Tuensang","Wokha","Zunheboto","Mon","Phek","Kiphire","Longleng"], lang: "Nagamese" },
  "Odisha":             { districts: ["Bhubaneswar","Cuttack","Rourkela","Berhampur","Sambalpur","Puri","Balasore","Baripada","Bhadrak","Jharsuguda"], lang: "Odia" },
  "Punjab":             { districts: ["Ludhiana","Amritsar","Jalandhar","Patiala","Bathinda","Mohali","Pathankot","Hoshiarpur","Gurdaspur","Faridkot"], lang: "Punjabi" },
  "Rajasthan":          { districts: ["Jaipur","Jodhpur","Udaipur","Kota","Bikaner","Ajmer","Bhilwara","Alwar","Sikar","Bharatpur"], lang: "Hindi" },
  "Sikkim":             { districts: ["Gangtok","Namchi","Gyalshing","Mangan","Rangpo","Jorethang","Nayabazar","Singtam","Ravangla","Yuksom"], lang: "Nepali" },
  "Tamil Nadu":         { districts: ["Chennai","Coimbatore","Madurai","Tiruchirappalli","Salem","Tirunelveli","Erode","Vellore","Thoothukudi","Dindigul"], lang: "Tamil" },
  "Telangana":          { districts: ["Hyderabad","Warangal","Nizamabad","Karimnagar","Khammam","Ramagundam","Mancherial","Adilabad","Suryapet","Siddipet"], lang: "Telugu" },
  "Tripura":            { districts: ["Agartala","Udaipur","Dharmanagar","Kailashahar","Belonia","Ambassa","Sabroom","Khowai","Bishramganj","Sonamura"], lang: "Bengali" },
  "Uttar Pradesh":      { districts: ["Lucknow","Kanpur","Agra","Varanasi","Meerut","Allahabad","Ghaziabad","Bareilly","Aligarh","Moradabad"], lang: "Hindi" },
  "Uttarakhand":        { districts: ["Dehradun","Haridwar","Roorkee","Haldwani","Rudrapur","Kashipur","Rishikesh","Mussoorie","Nainital","Almora"], lang: "Hindi" },
  "West Bengal":        { districts: ["Kolkata","Howrah","Durgapur","Asansol","Siliguri","Bardhaman","Malda","Darjeeling","Haldia","Kharagpur"], lang: "Bengali" },
  "Andaman & Nicobar Islands":            { districts: ["Port Blair","Diglipur","Car Nicobar","Mayabunder","Rangat","Neil Island","Havelock","Campbell Bay","Little Andaman","Kamorta"], lang: "Hindi", isUT: true },
  "Chandigarh":                           { districts: ["Chandigarh","Manimajra","Panchkula","Mohali","Zirakpur","Kharar","Derabassi","Banur","Kurali","Morinda"], lang: "Hindi", isUT: true },
  "Dadra & Nagar Haveli and Daman & Diu": { districts: ["Silvassa","Daman","Diu","Amli","Khanvel","Naroli","Vapi","Bhilad","Samarvarni","Dadra"], lang: "Gujarati", isUT: true },
  "Delhi":                                { districts: ["Central Delhi","East Delhi","New Delhi","North Delhi","South Delhi","West Delhi","North East Delhi","Shahdara","North West Delhi","South West Delhi"], lang: "Hindi", isUT: true },
  "Jammu & Kashmir":                      { districts: ["Srinagar","Jammu","Anantnag","Baramulla","Sopore","Udhampur","Kathua","Poonch","Rajouri","Pulwama"], lang: "Kashmiri", isUT: true },
  "Ladakh":                               { districts: ["Leh","Kargil","Diskit","Padum","Nubra","Zanskar","Drass","Sankoo","Nyoma","Changthang"], lang: "Ladakhi", isUT: true },
  "Lakshadweep":                          { districts: ["Kavaratti","Agatti","Amini","Andrott","Minicoy","Kalpeni","Kadmat","Kiltan","Chetlat","Bitra"], lang: "Malayalam", isUT: true },
  "Puducherry":                           { districts: ["Puducherry","Karaikal","Mahe","Yanam","Ozhukarai","Nettapakkam","Ariyankuppam","Villianur","Bahour","Mannadipet"], lang: "Tamil", isUT: true },
};

// Sorted list for the dropdown
const STATE_KEYS = Object.keys(STATES).sort();
const STATES_LIST  = STATE_KEYS.filter(k => !STATES[k].isUT);
const UT_LIST      = STATE_KEYS.filter(k =>  STATES[k].isUT);

const MALE_NAMES   = ["Rajesh","Anil","Suresh","Ramesh","Vikram","Sanjay","Ajay","Vijay","Mohan","Ravi","Amit","Rohit","Nitin","Deepak","Manoj","Rakesh","Vinod","Ashok","Pankaj","Sachin","Gaurav","Narendra","Pradeep","Hemant","Anand","Yogesh","Satish","Arvind","Harish","Prakash","Rahul","Santosh","Tarun","Varun","Alok","Chandan","Devendra","Ganesh","Hardik","Jatin","Kapil","Lokesh","Mukesh","Nilesh","Piyush","Rajiv","Shyam","Firoz","Irfan","Qasim"];
const FEMALE_NAMES = ["Priya","Sunita","Rekha","Kavita","Anita","Seema","Pooja","Neha","Asha","Meena","Geeta","Radha","Sita","Usha","Lata","Mala","Nita","Rani","Suman","Savita","Divya","Ritu","Monika","Sapna","Preeti","Kiran","Vandana","Shweta","Alka","Pinki","Jyoti","Sarita","Mamta","Lalita","Kamla","Sheela","Pushpa","Rohini","Sudha","Beena","Deepa","Fatima","Hasina","Ishita","Jasmine","Komal","Madhuri","Nidhi","Poonam","Reena"];
const LAST_NAMES   = ["Sharma","Verma","Gupta","Singh","Kumar","Patel","Shah","Yadav","Mishra","Tiwari","Joshi","Pandey","Dubey","Chauhan","Rao","Nair","Menon","Pillai","Reddy","Naidu","Das","Bose","Sen","Chatterjee","Banerjee","Mukherjee","Iyer","Patil","Desai","Mehta","Jain","Agarwal","Mittal","Kapoor","Malhotra","Bhatia","Khanna","Chopra","Sinha","Ghosh","Dutta","Biswas","Mondal","Sawant","Pawar","Shinde","Kulkarni","Deshpande","Khan","Ansari","Siddiqui","Sheikh","Qureshi","Hussain","Ahmed","Akhtar","Pathan","Malik","Chaudhary","Thakur","Rathore"];
const RELIGIONS    = ["Hindu","Hindu","Hindu","Hindu","Hindu","Hindu","Muslim","Muslim","Christian","Sikh","Buddhist","Jain","Other"];
const CASTES       = ["General","OBC","OBC","SC","ST"];
const EDUCATION    = ["Below 10th","10th Pass","12th Pass","Bachelor's Degree","Bachelor's Degree","Master's Degree","PhD","Diploma","Illiterate"];
const OCCUPATIONS  = ["Farmer","Government Employee","Private Employee","Self-Employed","Daily Wage Worker","Student","Homemaker","Shopkeeper","Teacher","Doctor","Engineer","Lawyer","Driver","Technician","Carpenter","Mason","Weaver","Fisherman","Trader","Artisan"];
const MARITAL      = ["Married","Married","Married","Single","Widowed","Divorced"];
const DISABILITIES = ["None","None","None","None","None","None","None","None","Visual Impairment","Physical Disability","Hearing Impairment"];
const HOUSE_MAT    = ["Brick and Cement","Brick and Cement","Brick and Cement","Brick and Mud","Concrete","Wood and Mud","Stone","Thatched"];
const OWNERSHIP    = ["Owned","Owned","Rented","Rented","Family Property"];
const WATER_SRC    = ["Municipal Water","Borewell","Hand Pump","Well Water","Tap Water","River/Pond"];
const ELEC_SRC     = ["Grid Electricity","Grid Electricity","Grid Electricity","Solar Panel","Diesel Generator","No Electricity"];
const FUEL_SRC     = ["LPG Gas","LPG Gas","Firewood","Firewood","Biogas","Kerosene"];
const SANITATION   = ["Flush Toilet","Flush Toilet","Pit Latrine","Open Defecation","No Access"];
const MIGRATION    = ["Not Migrated","Not Migrated","Not Migrated","Work","Education","Family","Marriage"];
const INCOME       = ["Below Poverty Line","Lower Middle","Middle","Upper Middle","High"];

let _uidCounter = Math.floor(Math.random() * 90000) + 10000;
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;

function generateQRSvg(uid: string, name: string): string {
  let hash = 0;
  const str = uid + name;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const size = 21; const cell = 10; const quiet = 2;
  const total = (size + 2 * quiet) * cell;
  const isFinderTL = (r: number, c: number) => r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
  const isFinderTR = (r: number, c: number) => r >= 0 && r <= 6 && c >= 14 && c <= 20 && (r === 0 || r === 6 || c === 14 || c === 20 || (r >= 2 && r <= 4 && c >= 16 && c <= 18));
  const isFinderBL = (r: number, c: number) => r >= 14 && r <= 20 && c >= 0 && c <= 6 && (r === 14 || r === 20 || c === 0 || c === 6 || (r >= 16 && r <= 18 && c >= 2 && c <= 4));
  const rects: string[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let dark = false;
      if (isFinderTL(r, c) || isFinderTR(r, c) || isFinderBL(r, c)) dark = true;
      else if (r === 6) dark = c % 2 === 0;
      else if (c === 6) dark = r % 2 === 0;
      else dark = ((hash >> ((r * size + c) % 32)) & 1) === 1;
      if (dark) rects.push(`<rect x="${(c + quiet) * cell}" y="${(r + quiet) * cell}" width="${cell}" height="${cell}"/>`);
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${total}" viewBox="0 0 ${total} ${total}"><title>${uid}</title><desc>${name}</desc><rect width="${total}" height="${total}" fill="white"/><g fill="black">${rects.join('')}</g></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export type GeneratedCitizen = Citizen;

// ── CHANGE 1: generateOne now accepts optional forceState ─────────
function generateOne(forceState?: string): GeneratedCitizen {
  const gender    = pick(["Male","Male","Female","Female","Other"]);
  const firstName = pick(gender === "Male" ? MALE_NAMES : FEMALE_NAMES);
  const lastName  = pick(LAST_NAMES);
  const age       = randInt(18, 85);
  const year      = 2026 - age;
  const dob       = `${year}-${String(randInt(1,12)).padStart(2,'0')}-${String(randInt(1,28)).padStart(2,'0')}`;
  // Use forceState if provided, otherwise pick randomly
  const stateKey  = forceState ?? pick(Object.keys(STATES));
  const sdata     = STATES[stateKey];
  const district  = pick(sdata.districts);
  const mobile    = pick(["98","97","96","95","94","93","92","91","90","89","88","87","86","85","84","83","82","81","80"]) + String(randInt(10000000,99999999));
  const uid       = `CEN${String(++_uidCounter).padStart(7,'0')}`;
  const marital   = age < 22 ? "Single" : pick(MARITAL);
  const name      = `${firstName} ${lastName}`;
  return {
    uid, name, firstName, lastName, gender, dob, age,
    religion: pick(RELIGIONS), caste: pick(CASTES), motherTongue: sdata.lang,
    maritalStatus: marital, mobile,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1,999)}@gmail.com`,
    aadhaar: String(randInt(200000000000, 999999999999)),
    state: stateKey, district, pincode: String(randInt(100000, 999999)),
    education: pick(EDUCATION),
    occupation: age < 22 ? pick(["Student","Student","Daily Wage Worker"]) : pick(OCCUPATIONS),
    disability: pick(DISABILITIES), houseMaterial: pick(HOUSE_MAT),
    homeOwnership: pick(OWNERSHIP), drinkingWater: pick(WATER_SRC),
    electricitySource: pick(ELEC_SRC), cookingFuel: pick(FUEL_SRC),
    sanitation: pick(SANITATION), householdSize: randInt(2, 8),
    numberOfChildren: marital === "Married" ? randInt(0, 4) : 0,
    incomeClass: pick(INCOME), migrationReason: pick(MIGRATION),
    registeredOn: `2026-0${randInt(1,2)}-${String(randInt(1,28)).padStart(2,'0')}`,
    qrCode: generateQRSvg(uid, name),
  };
}

// ── CHANGE 2: generateBatch passes forceState through ────────────
function generateBatch(n: number, forceState?: string): GeneratedCitizen[] {
  return Array.from({ length: n }, () => generateOne(forceState));
}

// ── Modals (unchanged) ────────────────────────────────────────────
function QRModal({ c, onClose }: { c: GeneratedCitizen; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-gray-800 font-bold">{c.name}</h3>
            <code className="text-[#FF9933] text-xs font-bold">{c.uid}</code>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16}/></button>
        </div>
        <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center mb-4 border-2 border-dashed border-gray-200">
          <img src={c.qrCode} alt="QR" className="w-44 h-44"/>
        </div>
        <div className="rounded-2xl p-4 text-white" style={{background:'linear-gradient(135deg,#0D1B4B,#1a2d6e)'}}>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-white/40 text-xs mb-1">CENSUS ID CARD</p>
              <p className="font-bold">{c.name}</p>
              <p className="text-white/60 text-xs mt-1">{c.gender} · {c.dob}</p>
              <p className="text-white/60 text-xs">{c.district}, {c.state}</p>
              <p className="text-[#FF9933] font-bold tracking-wider mt-2">{c.uid}</p>
            </div>
            <img src={c.qrCode} alt="QR" className="w-14 h-14 bg-white rounded-xl p-1"/>
          </div>
        </div>
        <p className="text-gray-400 text-xs text-center mt-3">Scan with Android app to load citizen data</p>
      </div>
    </div>
  );
}

function DetailModal({ c, onClose }: { c: GeneratedCitizen; onClose: () => void }) {
  const rows = [
    ['UID', c.uid], ['Name', c.name], ['Gender', c.gender], ['DOB', c.dob], ['Age', `${c.age} yrs`],
    ['Religion', c.religion], ['Caste', c.caste], ['Mother Tongue', c.motherTongue], ['Marital Status', c.maritalStatus],
    ['Mobile', c.mobile], ['Email', c.email], ['Aadhaar', c.aadhaar],
    ['State / UT', c.state], ['District', c.district], ['PIN', c.pincode],
    ['Education', c.education], ['Occupation', c.occupation], ['Income Class', c.incomeClass],
    ['Disability', c.disability], ['Household Size', `${c.householdSize} members`], ['Children', `${c.numberOfChildren}`],
    ['House Material', c.houseMaterial], ['Ownership', c.homeOwnership],
    ['Drinking Water', c.drinkingWater], ['Electricity', c.electricitySource],
    ['Cooking Fuel', c.cookingFuel], ['Sanitation', c.sanitation],
    ['Migration Reason', c.migrationReason], ['Registered On', c.registeredOn],
  ];
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl max-h-[90vh] flex flex-col" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-gray-800 font-bold">{c.name}</h3>
            <code className="text-[#FF9933] text-xs">{c.uid}</code>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16}/></button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="bg-[#F8F9FB] rounded-2xl overflow-hidden">
            {rows.map(([k,v])=>(
              <div key={k} className="flex justify-between px-4 py-2.5 border-b border-gray-100 last:border-0">
                <span className="text-xs text-gray-400 font-medium">{k}</span>
                <span className="text-xs text-gray-700 font-semibold text-right max-w-[55%] truncate">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
const BATCH_OPTIONS = [10, 50, 100, 250, 500, 1000];
const PAGE_SIZE = 20;

export function DataGeneratorPage() {
  const { addCitizens, clearCitizens, citizens: globalCitizens } = useAuth();

  const [localCitizens, setLocalCitizens] = useState<GeneratedCitizen[]>([]);
  const [generating, setGenerating]       = useState(false);
  const [batchSize, setBatchSize]         = useState(100);
  // ── CHANGE 3: new filterState ─────────────────────────────────
  const [filterState, setFilterState]     = useState<string>('All');
  const [qrModal, setQrModal]             = useState<GeneratedCitizen | null>(null);
  const [detailModal, setDetailModal]     = useState<GeneratedCitizen | null>(null);
  const [page, setPage]                   = useState(1);
  const [expandedStats, setExpandedStats] = useState(false);
  const [savedToList, setSavedToList]     = useState(false);
  const generateRef = useRef(false);

  // ── CHANGE 4: pass filterState into generateBatch ────────────
  const generate = useCallback(() => {
    if (generateRef.current) return;
    generateRef.current = true;
    setGenerating(true);
    setSavedToList(false);
    setTimeout(() => {
      const forceState = filterState === 'All' ? undefined : filterState;
      const batch = generateBatch(batchSize, forceState);
      setLocalCitizens(prev => [...prev, ...batch]);
      setPage(1);
      setGenerating(false);
      generateRef.current = false;
    }, 50);
  }, [batchSize, filterState]);

  const saveToList = () => {
    addCitizens(localCitizens);
    setSavedToList(true);
  };

  const clearAll = () => {
    setLocalCitizens([]);
    setPage(1);
    setSavedToList(false);
  };

  const clearGlobalList = () => {
    if (confirm(`This will remove all ${globalCitizens.length} citizens from the Citizens page. Are you sure?`)) {
      clearCitizens();
    }
  };

  const exportCSV = () => {
    const headers = ['UID','Name','Gender','DOB','Age','State / UT','District','PIN','Religion','Caste','Mother Tongue','Marital Status','Mobile','Email','Aadhaar','Education','Occupation','Income Class','Disability','House Material','Ownership','Drinking Water','Electricity','Cooking Fuel','Sanitation','Household Size','Children','Migration Reason','Registered On'];
    const rows = localCitizens.map(c => [
      c.uid, c.name, c.gender, c.dob, c.age, c.state, c.district, c.pincode,
      c.religion, c.caste, c.motherTongue, c.maritalStatus, c.mobile, c.email, c.aadhaar,
      c.education, c.occupation, c.incomeClass, c.disability,
      c.houseMaterial, c.homeOwnership, c.drinkingWater, c.electricitySource, c.cookingFuel, c.sanitation,
      c.householdSize, c.numberOfChildren, c.migrationReason, c.registeredOn
    ].map(v => `"${String(v).replace(/"/g,'""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `census_data_${localCitizens.length}_citizens_${filterState !== 'All' ? filterState.replace(/ /g,'_') + '_' : ''}${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const paginated  = localCitizens.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const totalPages = Math.ceil(localCitizens.length / PAGE_SIZE);

  const stats = localCitizens.length > 0 ? {
    states:   new Set(localCitizens.map(c=>c.state)).size,
    male:     localCitizens.filter(c=>c.gender==='Male').length,
    female:   localCitizens.filter(c=>c.gender==='Female').length,
    avgAge:   Math.round(localCitizens.reduce((a,c)=>a+c.age,0)/localCitizens.length),
    topState: Object.entries(localCitizens.reduce((a,c)=>({...a,[c.state]:(a[c.state]||0)+1}),{} as any)).sort((x:any,y:any)=>y[1]-x[1])[0]?.[0] || '-',
  } : null;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }} className="min-h-screen bg-[#F4F6FA]">
      {qrModal     && <QRModal      c={qrModal}     onClose={()=>setQrModal(null)}    />}
      {detailModal && <DetailModal  c={detailModal} onClose={()=>setDetailModal(null)}/>}

      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-gray-800 text-xl font-semibold flex items-center gap-2">
              <Database size={20} className="text-[#FF9933]"/>
              Citizen Data Generator
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Generate realistic census data for all 28 states + 8 UTs →
              <span className="text-[#138808] font-semibold"> {globalCitizens.length.toLocaleString('en-IN')} saved to Citizens list</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {globalCitizens.length > 0 && (
              <button onClick={clearGlobalList}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-400 text-xs rounded-xl hover:bg-red-50">
                <Trash2 size={12}/> Clear Citizens List ({globalCitizens.length.toLocaleString()})
              </button>
            )}
            {localCitizens.length > 0 && (
              <>
                <span className="text-sm font-bold text-[#0D1B4B] bg-blue-50 px-3 py-1.5 rounded-xl">
                  {localCitizens.length.toLocaleString('en-IN')} generated
                </span>
                <button onClick={saveToList} disabled={savedToList}
                  className={`flex items-center gap-2 px-4 py-2 text-white text-sm rounded-xl font-semibold shadow-sm transition-all ${savedToList ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0D1B4B] hover:bg-[#162254]'}`}>
                  {savedToList
                    ? <><CheckCircle size={14}/> Saved to Citizens List</>
                    : <><Plus size={14}/> Add to Citizens List</>
                  }
                </button>
                <button onClick={exportCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-[#138808] text-white text-sm rounded-xl hover:bg-green-700 font-semibold shadow-sm">
                  <Download size={14}/> Export CSV
                </button>
                <button onClick={clearAll}
                  className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-400 text-sm rounded-xl hover:bg-red-50">
                  <Trash2 size={14}/> Clear
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-5">
        {/* Generator controls */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {/* Row 1: Batch size */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">How many citizens to generate?</p>
            <div className="flex gap-2 flex-wrap">
              {BATCH_OPTIONS.map(n => (
                <button key={n} onClick={()=>setBatchSize(n)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${batchSize===n ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={batchSize===n ? {background:'linear-gradient(135deg,#0D1B4B,#1a2d6e)'} : {}}>
                  {n.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* ── CHANGE 5: State filter row ── */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Filter by State / UT <span className="text-gray-400 font-normal">(optional)</span></p>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={filterState}
                onChange={e => { setFilterState(e.target.value); setSavedToList(false); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#0D1B4B] bg-white text-gray-700 font-medium min-w-[220px]"
              >
                <option value="All">🇮🇳 All States &amp; UTs (Random)</option>
                <optgroup label="── States ──">
                  {STATES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </optgroup>
                <optgroup label="── Union Territories ──">
                  {UT_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </optgroup>
              </select>

              {filterState !== 'All' && (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
                  <span className="text-xs text-orange-700 font-semibold">
                    All {batchSize.toLocaleString()} citizens will be from <strong>{filterState}</strong>
                  </span>
                  <button
                    onClick={() => setFilterState('All')}
                    className="text-orange-400 hover:text-orange-600 ml-1"
                  >
                    <X size={13}/>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Generate button */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-gray-400">
              {filterState === 'All'
                ? `Will generate ${batchSize.toLocaleString()} citizens spread across all 36 states & UTs`
                : `Will generate ${batchSize.toLocaleString()} citizens all from ${filterState} · Districts: ${STATES[filterState].districts.slice(0,3).join(', ')}...`
              }
            </p>
            <button onClick={generate} disabled={generating}
              className="flex items-center gap-2.5 px-6 py-3 text-white text-sm font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{background:'linear-gradient(135deg,#FF9933,#e67e00)', boxShadow:'0 4px 20px rgba(255,153,51,0.4)'}}>
              {generating
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/><span>Generating...</span></>
                : <><Zap size={16}/><span>Generate {batchSize.toLocaleString()} {filterState !== 'All' ? `from ${filterState}` : 'Citizens'}</span></>
              }
            </button>
          </div>

          {localCitizens.length === 0 && (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-10 text-center">
              <Database size={32} className="text-gray-300 mx-auto mb-3"/>
              <p className="text-gray-400 text-sm font-medium">No data yet. Select a state (optional) and click Generate.</p>
              <p className="text-gray-300 text-xs mt-1">Covers all 28 states + 8 union territories of India</p>
            </div>
          )}
        </div>

        {/* Saved confirmation banner */}
        {savedToList && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-[#138808] flex-shrink-0"/>
            <p className="text-sm text-green-800 font-medium">
              {localCitizens.length.toLocaleString()} citizens added to the Citizens list.
              <a href="/citizens" className="ml-2 underline text-[#138808] font-semibold">View Citizens →</a>
            </p>
          </div>
        )}

        {/* Stats bar */}
        {stats && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button className="w-full px-5 py-4 flex items-center justify-between" onClick={()=>setExpandedStats(e=>!e)}>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><BarChart3 size={15} className="text-[#FF9933]"/><span className="text-sm font-semibold text-gray-700">Dataset Summary</span></div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span><strong className="text-[#0D1B4B]">{localCitizens.length.toLocaleString()}</strong> generated</span>
                  <span><strong className="text-[#138808]">{stats.states}</strong> states/UTs</span>
                  <span>Avg age <strong className="text-[#FF9933]">{stats.avgAge}</strong></span>
                  <span>Top: <strong className="text-[#7C3AED]">{stats.topState}</strong></span>
                </div>
              </div>
              {expandedStats ? <ChevronUp size={16} className="text-gray-400"/> : <ChevronDown size={16} className="text-gray-400"/>}
            </button>
            {expandedStats && (
              <div className="px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-gray-50 pt-4">
                {[
                  { label:'Generated',       val: localCitizens.length.toLocaleString('en-IN'), color:'#0D1B4B' },
                  { label:'States & UTs',    val: stats.states, color:'#138808' },
                  { label:'Male',            val: stats.male.toLocaleString('en-IN'), color:'#FF9933' },
                  { label:'Female',          val: stats.female.toLocaleString('en-IN'), color:'#7C3AED' },
                  { label:'Average Age',     val: `${stats.avgAge} yrs`, color:'#059669' },
                  { label:'Most Citizens',   val: stats.topState, color:'#DC2626' },
                  { label:'Educated (12+)',  val: localCitizens.filter(c=>["12th Pass","Bachelor's Degree","Master's Degree","PhD","Diploma"].includes(c.education)).length.toLocaleString(), color:'#0891B2' },
                  { label:'LPG Users',       val: localCitizens.filter(c=>c.cookingFuel==='LPG Gas').length.toLocaleString(), color:'#D97706' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-[#F8F9FB] rounded-xl p-3">
                    <p className="text-lg font-bold" style={{color}}>{val}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        {localCitizens.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  Generated Citizens
                  {filterState !== 'All' && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                      {filterState}
                    </span>
                  )}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,localCitizens.length)} of {localCitizens.length.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={generate} disabled={generating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white hover:opacity-90"
                style={{background:'linear-gradient(135deg,#FF9933,#e67e00)'}}>
                <Plus size={12}/> Add {batchSize.toLocaleString()} More
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8F9FB]">
                    {['#','Citizen','UID','State / UT','Age','Education','Occupation','QR','Details'].map(h=>(
                      <th key={h} className="px-4 py-3 text-left text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c, idx) => (
                    <tr key={c.uid} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-400 font-medium">{(page-1)*PAGE_SIZE+idx+1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{background: c.gender==='Male' ? 'linear-gradient(135deg,#0D1B4B,#1a2d6e)' : c.gender==='Female' ? 'linear-gradient(135deg,#FF9933,#e67e00)' : 'linear-gradient(135deg,#7C3AED,#5B21B6)'}}>
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm text-gray-800 font-semibold">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.gender} · {c.caste}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3"><code className="text-xs bg-[#F0F4FF] text-[#0D1B4B] px-2 py-1 rounded-lg font-bold">{c.uid}</code></td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700 font-medium">{c.state}</p>
                        <p className="text-xs text-gray-400">{c.district}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{c.age}</td>
                      <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">{c.education}</span></td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.occupation}</td>
                      <td className="px-4 py-3">
                        <button onClick={()=>setQrModal(c)} className="p-1.5 text-gray-300 hover:text-[#0D1B4B] hover:bg-blue-50 rounded-lg transition-all">
                          <QrCode size={15}/>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={()=>setDetailModal(c)} className="p-1.5 text-gray-300 hover:text-[#FF9933] hover:bg-orange-50 rounded-lg transition-all">
                          <Eye size={15}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between">
              <p className="text-xs text-gray-400">{localCitizens.length.toLocaleString('en-IN')} total · {totalPages} pages</p>
              <div className="flex items-center gap-1">
                <button onClick={()=>setPage(1)} disabled={page===1} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">«</button>
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">‹</button>
                {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
                  const p=Math.max(1,Math.min(totalPages-4,page-2))+i;
                  return <button key={p} onClick={()=>setPage(p)} className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${page===p?'bg-[#0D1B4B] text-white':'border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{p}</button>;
                })}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">›</button>
                <button onClick={()=>setPage(totalPages)} disabled={page===totalPages} className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 disabled:opacity-40 hover:bg-gray-50">»</button>
              </div>
            </div>
          </div>
        )}

        {/* Power BI tip */}
        {localCitizens.length > 0 && (
          <div className="bg-gradient-to-r from-[#0D1B4B] to-[#1a2d6e] rounded-2xl p-5 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 size={20} className="text-[#FF9933]"/>
              </div>
              <div>
                <p className="font-semibold mb-1">Ready for Power BI</p>
                <p className="text-white/60 text-sm">
                  Export CSV → Open Power BI → Get Data → Text/CSV → Load.
                  The {localCitizens.length.toLocaleString()} citizen dataset
                  {filterState !== 'All' ? ` (${filterState})` : ' covers all 28 states + 8 UTs'} with 29 columns.
                </p>
              </div>
              <button onClick={exportCSV}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-[#FF9933] text-white text-sm font-bold rounded-xl hover:bg-orange-400 transition-all">
                <Download size={14}/> Export Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}