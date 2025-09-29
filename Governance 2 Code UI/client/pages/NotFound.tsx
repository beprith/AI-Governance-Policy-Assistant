import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppLayout from "../components/layouts/AppLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <AppLayout>
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron text-6xl font-extrabold tracking-[0.2em] text-cyan-200 drop-shadow-[0_0_20px_rgba(0,229,255,0.35)]">404</h1>
          <p className="mt-4 font-rajdhani text-lg text-cyan-100/80">Page not found.</p>
          <a
            href="/"
            className="mt-6 inline-block rounded-md border border-cyan-400/40 bg-[#061427] px-6 py-3 font-rajdhani tracking-widest text-cyan-200 shadow-neon"
          >
            Return Home
          </a>
        </div>
      </div>
    </AppLayout>
  );
};

export default NotFound;
