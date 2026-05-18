import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAccessToken } from "../../../api/axios";
import { toast } from "sonner";

export default function ShipyardAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      setAccessToken(token);
      toast.success("Shipyard connected successfully");
      navigate("/dashboard/deploy", { replace: true });
    } else {
      toast.error("Authentication failed");
      navigate("/dashboard/deploy", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-4 text-zinc-500">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#6366f1]/20 border-t-[#6366f1]" />
        <p className="text-[10px] font-black uppercase tracking-widest italic">Authenticating Shipyard...</p>
      </div>
    </div>
  );
}
