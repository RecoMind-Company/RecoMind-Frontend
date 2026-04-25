import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--BG_gradient)] text-[var(--font_primary)] font-garet px-4">
      <h1 className="text-9xl font-bold tracking-wider drop-shadow-lg text-[var(--Secondary)] animate-pulse">
        404
      </h1>

      <p className="text-lg md:text-xl mt-4 text-[var(--font_secondary)] text-center">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 rounded-xl bg-[var(--Secondary)] text-[var(--Primary)] font-bold shadow-md hover:scale-105 active:scale-95 transition-all duration-300"
      >
        Go Home
      </button>

      <div className="mt-12 w-32 h-[2px] bg-[var(--Secondary)] rounded-full opacity-50"></div>
    </div>
  );
};

export default NotFound;
