"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { auth, db } from "@/config/firebaseClient";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAccepted: boolean | null;
  role: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAccepted: null,
  role: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAccepted, setIsAccepted] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Listen to Firestore in real time for user's approval updates
        const userDocRef = doc(db, "ekg_users", currentUser.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsAccepted(data.isAccepted || false);
            setRole(data.role || null);

        
            if (data.isAccepted) {
              router.push(`/${currentUser.uid}`); 
            } else {
              router.push("/pending");
            }
          } else {
            console.warn("User document not found in Firestore.");
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setIsAccepted(null);
        setRole(null);
        setLoading(false);
        router.push("/auth");
      }
    });

    return () => unsubscribeAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, isAccepted, role }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
