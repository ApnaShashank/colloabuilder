import { useState, useEffect } from "react";
import projectService from "../api/services/projectService";
import { getAccessToken } from "../api/axios";

export function useShipyardLogs(projectId) {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("loading");
  const [publicUrl, setPublicUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    let eventSource = null;
    const connect = () => {
      // For Colloabuilder, we might use a different token storage
      const token = getAccessToken();
      const url = projectService.getLogsUrl(projectId, token);
      
      eventSource = new EventSource(url);

      eventSource.addEventListener("status", (e) => {
        const parsed = JSON.parse(e.data);
        if (parsed.status) setStatus(parsed.status);
      });

      eventSource.addEventListener("log", (e) => {
        const parsed = JSON.parse(e.data);
        setLogs((prev) => [...prev, parsed]);
      });

      eventSource.addEventListener("complete", (e) => {
        const parsed = JSON.parse(e.data);
        if (parsed.url) {
          setPublicUrl(parsed.url);
          setStatus("live");
        }
      });

      eventSource.addEventListener("failed", (e) => {
        setStatus("failed");
      });

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        setError("Connection to log stream lost. Retrying...");
        eventSource.close();
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [projectId]);

  return { logs, status, publicUrl, error, setStatus };
}
