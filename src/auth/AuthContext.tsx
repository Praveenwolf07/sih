import React, { createContext, useContext, useState } from "react";
import { User, Role, login as authLogin, demoUsers, initialDoctorList, DoctorRegistrationRequest } from "./authService";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  doctors: User[];
  addDoctor: (user: User) => void;
  updateDoctorStatus: (id: string, status: User["status"]) => void;
  doctorRegistrationRequests: DoctorRegistrationRequest[];
  addDoctorRegistrationRequest: (request: DoctorRegistrationRequest) => void;
  approveDoctorRegistration: (id: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  error: null,
  doctors: [],
  addDoctor: () => {},
  updateDoctorStatus: () => {},
  doctorRegistrationRequests: [],
  addDoctorRegistrationRequest: () => {},
  approveDoctorRegistration: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<User[]>(initialDoctorList);
  const [doctorRegistrationRequests, setDoctorRegistrationRequests] = useState<DoctorRegistrationRequest[]>([]);

  const addDoctor = (newUser: User) => {
    setDoctors(prev => [...prev, newUser]);
  };

  const updateDoctorStatus = (id: string, status: User["status"]) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const addDoctorRegistrationRequest = (request: DoctorRegistrationRequest) => {
    setDoctorRegistrationRequests(prev => [...prev, request]);
  };

  const approveDoctorRegistration = (id: string) => {
    setDoctorRegistrationRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    const approvedRequest = doctorRegistrationRequests.find(r => r.id === id);
    if (approvedRequest) {
      const newDoctorId = `DOC-PHC-${String(doctors.length + 1).padStart(4, '0')}`;
      addDoctor({
        id: newDoctorId,
        name: approvedRequest.name,
        email: approvedRequest.email,
        role: "DOCTOR",
        status: "Active",
        specialization: approvedRequest.specialization
      });
      console.log(`Doctor ${approvedRequest.name} approved. Generated ID: ${newDoctorId}`);
    }
  };

  const login = async (emailOrId: string, password: string) => {
    setError(null);
    const loggedUser = await authLogin(emailOrId, password, doctors);
    if (!loggedUser) {
      setError("Invalid credentials or account not found.");
      return;
    }
    // Admin is always active, others need to check status
    if (loggedUser.role !== "ADMIN" && loggedUser.status !== "Active") {
      setError(`Account status: ${loggedUser.status}. Please contact Admin.`);
      return;
    }
    setUser(loggedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, error, doctors, addDoctor, updateDoctorStatus, doctorRegistrationRequests, addDoctorRegistrationRequest, approveDoctorRegistration }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
