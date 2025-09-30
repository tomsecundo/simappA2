import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useProgramApi } from "../../api/programApi";
import ProgramTable from "../../components/Program/ProgramTable";
import ErrorBanner from "../../components/common/ErrorBanner";

function ProgramList() {
    const { getPrograms } = useProgramApi();
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getPrograms();
                setPrograms(data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Unauthorized: please log in again.");
                } else {
                    setError("Failed to load programs.");
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [getPrograms]);
    
    if (loading) return <p>Loading programs...</p>;

    return (
        <div className="p-4">
            <h2 className="mb-3">Programs</h2>
            <ErrorBanner message={error} onClose={() => setError("")} />
            <Link to="/programs/new" className="btn btn-primary">New Program</Link>
            <ProgramTable programs={programs} />
        </div>
    );
}

export default ProgramList;
