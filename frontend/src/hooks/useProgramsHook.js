import { useEffect, useState } from "react";
import { getPrograms } from "../api/programApi";

export function usePrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPrograms();
        setPrograms(data);
      } catch (err) {
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data?.error || "Request failed"}`);
        } else {
          setError("Network error: Unable to reach server");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { programs, setPrograms, loading, error, setError };
}