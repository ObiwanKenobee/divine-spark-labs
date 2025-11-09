import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="mb-4 text-5xl md:text-6xl font-bold text-primary">404</h1>
        <p className="mb-4 text-lg md:text-xl text-muted-foreground">We couldn't find the page you're looking for.</p>
        <div className="flex items-center justify-center gap-4">
          <a href="/" className="px-4 py-2 rounded bg-primary text-primary-foreground">Return Home</a>
          <a href="/" className="px-4 py-2 rounded border">Explore Site</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
