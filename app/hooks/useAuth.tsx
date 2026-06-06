import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/firebase";

/**
 * The authentication context stores the current Firebase user and
 * provides methods to register, log in and log out.  Consumers of
 * this hook can access the `user` object and call `signUp`,
 * `signIn` or `signOutUser` to perform actions.  The `loading`
 * flag indicates whether the initial authentication state is still
 * being determined.
 */
interface AuthContextValue {
  /** The currently authenticated Firebase user or null if none */
  user: FirebaseUser | null;
  /** Whether the initial auth check is still in progress */
  loading: boolean;
  /** Create a new user account */
  signUp: (email: string, password: string) => Promise<void>;
  /** Log in an existing user */
  signIn: (email: string, password: string) => Promise<void>;
  /** Log out the current user */
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for changes to the Firebase auth user.  This will run
    // whenever the user logs in or out.  When the component mounts we
    // start in a loading state until the current auth state is known.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    signIn,
    signOutUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook that returns the authentication context.  If used
 * outside of the provider it will throw an error, helping
 * developers catch configuration mistakes early.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}