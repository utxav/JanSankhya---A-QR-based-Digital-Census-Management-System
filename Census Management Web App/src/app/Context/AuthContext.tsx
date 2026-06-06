import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';

// ── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'supervisor';

export interface StaffUser {
  id: string;
  name: string;
  role: UserRole;
  area: string;
  state: string;
  phone: string;
  password: string;
  createdAt: string;
}

export interface Enumerator {
  id: string;
  name: string;
  phone: string;
  state: string;
  district: string;
  supervisorId: string;
  password: string;
  assigned: number;
  completed: number;
  pending: number;
  createdAt: string;
}

export interface Citizen {
  uid: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  age: number;
  religion: string;
  caste: string;
  motherTongue: string;
  maritalStatus: string;
  mobile: string;
  email: string;
  aadhaar: string;
  state: string;
  district: string;
  pincode: string;
  education: string;
  occupation: string;
  disability: string;
  houseMaterial: string;
  homeOwnership: string;
  drinkingWater: string;
  electricitySource: string;
  cookingFuel: string;
  sanitation: string;
  householdSize: number;
  numberOfChildren: number;
  incomeClass: string;
  migrationReason: string;
  supervisorId: string;
  registeredOn: string;
  qrCode: string;
}

// ── API Base URL ─────────────────────────────────────────────────────────────

const API = 'http://localhost/jansankhya-api';

// ── Real QR Code Generator ───────────────────────────────────────────────────

async function generateQRDataUrl(uid: string): Promise<string> {
  try {
    return await QRCode.toDataURL(uid, {
      width: 120,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' }
    });
  } catch {
    return '';
  }
}

// ── Context Shape ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user: StaffUser | null;
  staffRegistry: StaffUser[];
  enumeratorRegistry: Enumerator[];
  citizens: Citizen[];
  loading: boolean;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => void;
  registerStaff: (data: Omit<StaffUser, 'id' | 'createdAt'>) => Promise<{ id: string; password: string } | null>;
  deleteStaff: (id: string) => Promise<void>;
  registerEnumerator: (data: Omit<Enumerator, 'id' | 'createdAt' | 'assigned' | 'completed' | 'pending'>) => Promise<{ id: string; password: string } | null>;
  deleteEnumerator: (id: string) => Promise<void>;
  addCitizens: (newCitizens: Citizen[]) => Promise<void>;
  clearCitizens: () => Promise<void>;
  refreshCitizens: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,               setUser]               = useState<StaffUser | null>(null);
  const [staffRegistry,      setStaffRegistry]      = useState<StaffUser[]>([]);
  const [enumeratorRegistry, setEnumeratorRegistry] = useState<Enumerator[]>([]);
  const [citizens,           setCitizens]           = useState<Citizen[]>([]);
  const [loading,            setLoading]            = useState(true);

  // ── attach real QR ───────────────────────────────────────────────────────

  const attachQR = async (c: Omit<Citizen, 'qrCode'>): Promise<Citizen> => ({
    ...c,
    qrCode: await generateQRDataUrl(c.uid),
  });

  // ── initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const savedUser = localStorage.getItem('census_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const [staffRes, enumRes, citizenRes] = await Promise.all([
          fetch(`${API}/staff/list.php`).then(r => r.json()),
          fetch(`${API}/enumerators/list.php`).then(r => r.json()),
          fetch(`${API}/citizens/list.php`).then(r => r.json()),
        ]);

        if (staffRes.success)   setStaffRegistry(staffRes.staff);
        if (enumRes.success)    setEnumeratorRegistry(enumRes.enumerators);
        if (citizenRes.success) {
          const citizensWithQR = await Promise.all(
            citizenRes.citizens.map((c: Omit<Citizen, 'qrCode'>) => attachQR(c))
          );
          setCitizens(citizensWithQR);
        }
      } catch (err) {
        console.error('Init load error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────

  const login = useCallback(async (id: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/auth/login.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('census_user', JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('census_user');
  }, []);

  // ── staff ─────────────────────────────────────────────────────────────────

  const registerStaff = useCallback(async (
    data: Omit<StaffUser, 'id' | 'createdAt'>
  ): Promise<{ id: string; password: string } | null> => {
    try {
      const res = await fetch(`${API}/staff/add.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        const listRes = await fetch(`${API}/staff/list.php`).then(r => r.json());
        if (listRes.success) setStaffRegistry(listRes.staff);
        return { id: result.id, password: result.password };
      }
      return null;
    } catch (err) {
      console.error('Register staff error:', err);
      return null;
    }
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    try {
      await fetch(`${API}/staff/delete.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id }),
      });
      setStaffRegistry(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete staff error:', err);
    }
  }, []);

  // ── enumerators ───────────────────────────────────────────────────────────

  const registerEnumerator = useCallback(async (
    data: Omit<Enumerator, 'id' | 'createdAt' | 'assigned' | 'completed' | 'pending'>
  ): Promise<{ id: string; password: string } | null> => {
    try {
      const res = await fetch(`${API}/enumerators/add.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        const listRes = await fetch(`${API}/enumerators/list.php`).then(r => r.json());
        if (listRes.success) setEnumeratorRegistry(listRes.enumerators);
        return { id: result.id, password: result.password };
      }
      return null;
    } catch (err) {
      console.error('Register enumerator error:', err);
      return null;
    }
  }, []);

  const deleteEnumerator = useCallback(async (id: string) => {
    try {
      await fetch(`${API}/enumerators/delete.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id }),
      });
      setEnumeratorRegistry(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      console.error('Delete enumerator error:', err);
    }
  }, []);

  // ── citizens ──────────────────────────────────────────────────────────────

  const addCitizens = useCallback(async (newCitizens: Citizen[]) => {
    try {
      const toSend = newCitizens.map(({ qrCode, ...rest }) => rest);
      const BATCH = 500;
      for (let i = 0; i < toSend.length; i += BATCH) {
        const batch = toSend.slice(i, i + BATCH);
        await fetch(`${API}/citizens/add.php`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ citizens: batch }),
        });
      }
      setCitizens(prev => {
        const existingUids = new Set(prev.map(c => c.uid));
        const fresh = newCitizens.filter(c => !existingUids.has(c.uid));
        return [...prev, ...fresh];
      });
    } catch (err) {
      console.error('Add citizens error:', err);
    }
  }, []);

  const clearCitizens = useCallback(async () => {
    try {
      await fetch(`${API}/citizens/clear.php`, { method: 'POST' });
      setCitizens([]);
    } catch (err) {
      console.error('Clear citizens error:', err);
    }
  }, []);

  const refreshCitizens = useCallback(async () => {
    try {
      const res = await fetch(`${API}/citizens/list.php`).then(r => r.json());
      if (res.success) {
        const citizensWithQR = await Promise.all(
          res.citizens.map((c: Omit<Citizen, 'qrCode'>) => attachQR(c))
        );
        setCitizens(citizensWithQR);
      }
    } catch (err) {
      console.error('Refresh citizens error:', err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user, staffRegistry, enumeratorRegistry, citizens, loading,
      login, logout, registerStaff, deleteStaff,
      registerEnumerator, deleteEnumerator,
      addCitizens, clearCitizens, refreshCitizens,
    }}>
      {children}
    </AuthContext.Provider>
  );
}