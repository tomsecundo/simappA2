import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useSessionApi } from "../../api/sessionAPI";
import SessionTable from "../../components/Session/SessionTable";
import ErrorBanner from "../../components/common/ErrorBanner";

function SessionList() {
    const { getSessions } = useSessionApi();
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getSessions();
                setSessions(data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Unauthorized: please log in again.");
                } else {
                    setError("Failed to load sessions.");
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [getSessions]);
    
    if (loading) return <p>Loading sessions...</p>;

    return (
        <div className="p-4">
            <h2 className="mb-3">Sessions</h2>
            <ErrorBanner message={error} onClose={() => setError("")} />
            <Link to="/sessions/new" className="btn btn-primary">New Session</Link>
            <SessionTable sessions={sessions} />
        </div>
    );
}

export default SessionList;
