import { AuthProvider } from "@/provider/AuthProvider";
import "../globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <AuthProvider>{children}</AuthProvider>

  );
}
