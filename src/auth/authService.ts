export type Role = "ADMIN" | "DOCTOR" | "ASHA_WORKER" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  specialization?: string;
  status: "Active" | "Pending" | "Suspended" | "Deactivated";
}

export interface DoctorRegistrationRequest {
  id: string;
  name: string;
  email: string;
  mobile: string;
  specialization: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}

export const initialDoctorList: User[] = [
  { id: "DOC-PHC-0001", name: "Dr. Aravind Kumar", email: "doctor@demo.sevasetu.in", role: "DOCTOR", status: "Active", specialization: "General Medicine" },
  { id: "DOC-002", name: "Dr. Priya Rani", email: "pending@demo.sevasetu.in", role: "DOCTOR", status: "Pending", specialization: "Pediatrics" },
  { id: "DOC-003", name: "Dr. Rajesh Sharma", email: "suspended@demo.sevasetu.in", role: "DOCTOR", status: "Suspended", specialization: "Orthopedics" },
  { id: "DOC-004", name: "Dr. Suresh Babu", email: "deactivated@demo.sevasetu.in", role: "DOCTOR", status: "Deactivated", specialization: "Dermatology" },
];

export const demoUsers: Record<string, User> = {
  "admin@demo.sevasetu.in": { id: "ADM-001", name: "PHC Administrator", email: "admin@demo.sevasetu.in", role: "ADMIN", status: "Active" },
  "admin@sevasetu.in": { id: "ADM-001", name: "PHC Administrator", email: "admin@sevasetu.in", role: "ADMIN", status: "Active" },
  "admin@demo.swasthyasetu.in": { id: "ADM-001", name: "PHC Administrator", email: "admin@demo.swasthyasetu.in", role: "ADMIN", status: "Active" },
  "admin": { id: "ADM-001", name: "PHC Administrator", email: "admin@demo.sevasetu.in", role: "ADMIN", status: "Active" },
  "doctor@demo.sevasetu.in": { id: "DOC-PHC-0001", name: "Dr. Aravind Kumar", email: "doctor@demo.sevasetu.in", role: "DOCTOR", status: "Active", specialization: "General Medicine" },
  "doctor@sevasetu.in": { id: "DOC-PHC-0001", name: "Dr. Aravind Kumar", email: "doctor@sevasetu.in", role: "DOCTOR", status: "Active", specialization: "General Medicine" },
  "doctor@demo.swasthyasetu.in": { id: "DOC-PHC-0001", name: "Dr. Aravind Kumar", email: "doctor@demo.swasthyasetu.in", role: "DOCTOR", status: "Active", specialization: "General Medicine" },
  "doctor": { id: "DOC-PHC-0001", name: "Dr. Aravind Kumar", email: "doctor@demo.sevasetu.in", role: "DOCTOR", status: "Active", specialization: "General Medicine" },
  "pending@demo.sevasetu.in": { id: "DOC-002", name: "Dr. Priya Rani", email: "pending@demo.sevasetu.in", role: "DOCTOR", status: "Pending", specialization: "Pediatrics" },
  "suspended@demo.sevasetu.in": { id: "DOC-003", name: "Dr. Rajesh Sharma", email: "suspended@demo.sevasetu.in", role: "DOCTOR", status: "Suspended", specialization: "Orthopedics" },
  "deactivated@demo.sevasetu.in": { id: "DOC-004", name: "Dr. Suresh Babu", email: "deactivated@demo.sevasetu.in", role: "DOCTOR", status: "Deactivated", specialization: "Dermatology" },
};

export const login = async (emailOrId: string, _password?: string, extraUsers: User[] = []): Promise<User | null> => {
  // Simulate fast verification
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const query = (emailOrId || "").trim().toLowerCase();
  if (!query) return null;

  // 1. Direct admin keyword or ID matches
  if (
    query === "admin" ||
    query === "adm-001" ||
    query === "adm001" ||
    query === "adm-1" ||
    query === "admin1" ||
    query === "admin@demo.sevasetu.in" ||
    query === "admin@sevasetu.in" ||
    query === "admin@demo.swasthyasetu.in" ||
    query === "admin@phc.in" ||
    query === "admin@gmail.com" ||
    query.startsWith("adm-") ||
    query.startsWith("admin")
  ) {
    return {
      id: "ADM-001",
      name: "PHC Administrator",
      email: "admin@demo.sevasetu.in",
      role: "ADMIN",
      status: "Active"
    };
  }

  // 2. Direct doctor keyword or ID matches
  if (
    query === "doctor" ||
    query === "doc-001" ||
    query === "doc-phc-0001" ||
    query === "doc-phc-001" ||
    query === "doc001" ||
    query === "doc1" ||
    query === "doctor@demo.sevasetu.in" ||
    query === "doctor@sevasetu.in" ||
    query === "doctor@demo.swasthyasetu.in" ||
    query === "doctor@phc.in"
  ) {
    return {
      id: "DOC-PHC-0001",
      name: "Dr. Aravind Kumar",
      email: "doctor@demo.sevasetu.in",
      role: "DOCTOR",
      status: "Active",
      specialization: "General Medicine"
    };
  }

  // 3. Search in demoUsers keys
  for (const [key, user] of Object.entries(demoUsers)) {
    if (key.toLowerCase() === query || user.id.toLowerCase() === query || user.email.toLowerCase() === query) {
      return user;
    }
  }

  // 4. Search in extraUsers (dynamically registered users)
  const userInExtra = extraUsers.find(
    u => u.email.toLowerCase() === query || u.id.toLowerCase() === query || u.name.toLowerCase() === query
  );
  if (userInExtra) return userInExtra;

  // 5. If user typed any email containing "admin", allow as Admin
  if (query.includes("admin")) {
    return {
      id: "ADM-001",
      name: "PHC Administrator",
      email: emailOrId.trim(),
      role: "ADMIN",
      status: "Active"
    };
  }

  // 6. If user typed any email containing "doc" or ID starting with "DOC", allow as Doctor
  if (query.includes("doc")) {
    return {
      id: "DOC-PHC-0001",
      name: "Dr. Medical Officer",
      email: emailOrId.trim(),
      role: "DOCTOR",
      status: "Active",
      specialization: "General Medicine"
    };
  }

  return null;
};

