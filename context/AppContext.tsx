import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Transaction {
  id: string;
  type: "sent" | "received" | "bill" | "recharge" | "purchase";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  icon: string;
  color: string;
  status: "success" | "pending" | "failed";
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  avatar: string;
  recent: boolean;
}

interface AppContextValue {
  balance: number;
  transactions: Transaction[];
  contacts: Contact[];
  addTransaction: (tx: Omit<Transaction, "id" | "date">) => void;
  updateBalance: (amount: number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY_BALANCE = "@paysphere_balance";
const STORAGE_KEY_TRANSACTIONS = "@paysphere_transactions";
const STORAGE_KEY_VERSION = "@paysphere_version";
const APP_VERSION = "2";

const DEFAULT_CONTACTS: Contact[] = [
  { id: "1", name: "Priya Sharma", phone: "9876543210", upiId: "priya@ybl", avatar: "P", recent: true },
  { id: "2", name: "Rohit Verma", phone: "9812345678", upiId: "rohit@upi", avatar: "R", recent: true },
  { id: "3", name: "Ananya Singh", phone: "9867890123", upiId: "ananya@ok", avatar: "A", recent: true },
  { id: "4", name: "Karthik Nair", phone: "9845678901", upiId: "karthik@hdf", avatar: "K", recent: false },
  { id: "5", name: "Meera Patel", phone: "9823456789", upiId: "meera@sbi", avatar: "M", recent: false },
  { id: "6", name: "Arjun Gupta", phone: "9834567890", upiId: "arjun@icici", avatar: "A", recent: false },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    type: "received",
    title: "Rohit Verma",
    subtitle: "UPI Transfer",
    amount: 2500,
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    icon: "arrow-down",
    color: "#00C48C",
    status: "success",
  },
  {
    id: "t2",
    type: "bill",
    title: "Electricity Bill",
    subtitle: "BESCOM • March 2026",
    amount: -1840,
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: "flash",
    color: "#FFB300",
    status: "success",
  },
  {
    id: "t3",
    type: "sent",
    title: "Priya Sharma",
    subtitle: "UPI Transfer",
    amount: -500,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: "arrow-up",
    color: "#FF4B6B",
    status: "success",
  },
  {
    id: "t4",
    type: "purchase",
    title: "Blinkit Order",
    subtitle: "Groceries & Essentials",
    amount: -324,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "bag",
    color: "#FF6B35",
    status: "success",
  },
  {
    id: "t5",
    type: "recharge",
    title: "Mobile Recharge",
    subtitle: "Airtel • +91 9876543210",
    amount: -299,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "phone-portrait",
    color: "#5C35CC",
    status: "success",
  },
  {
    id: "t6",
    type: "received",
    title: "Salary Credit",
    subtitle: "HDFC Bank",
    amount: 45000,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "briefcase",
    color: "#00C48C",
    status: "success",
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(6200000);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);

  useEffect(() => {
    (async () => {
      try {
        const version = await AsyncStorage.getItem(STORAGE_KEY_VERSION);
        if (version !== APP_VERSION) {
          await AsyncStorage.multiRemove([STORAGE_KEY_BALANCE, STORAGE_KEY_TRANSACTIONS]);
          await AsyncStorage.setItem(STORAGE_KEY_VERSION, APP_VERSION);
          return;
        }
        const storedBalance = await AsyncStorage.getItem(STORAGE_KEY_BALANCE);
        const storedTxns = await AsyncStorage.getItem(STORAGE_KEY_TRANSACTIONS);
        if (storedBalance) setBalance(parseFloat(storedBalance));
        if (storedTxns) setTransactions(JSON.parse(storedTxns));
      } catch {}
    })();
  }, []);

  const addTransaction = (tx: Omit<Transaction, "id" | "date">) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      date: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    AsyncStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updated)).catch(() => {});

    const newBalance = balance + tx.amount;
    setBalance(newBalance);
    AsyncStorage.setItem(STORAGE_KEY_BALANCE, newBalance.toString()).catch(() => {});
  };

  const updateBalance = (amount: number) => {
    const newBalance = balance + amount;
    setBalance(newBalance);
    AsyncStorage.setItem(STORAGE_KEY_BALANCE, newBalance.toString()).catch(() => {});
  };

  const value = useMemo(
    () => ({ balance, transactions, contacts: DEFAULT_CONTACTS, addTransaction, updateBalance }),
    [balance, transactions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
