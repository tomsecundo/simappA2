import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useAvailabilityApi } from "../../api/availabilityAPI";
import AvailabilityTable from "../../components/Availability/AvailabilityTable";
import ErrorBanner from "../../components/common/ErrorBanner";

function AvailabilityList() {
    const { getAvailabilityList } = useAvailabilityApi();
    const [availability, setAvailability] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAvailabilityList();
                setAvailability(data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError("Unauthorized: please log in again.");
                } else {
                    setError("Failed to load availability list.");
                }
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [getAvailabilityList]);
    
    if (loading) return <p>Loading availability list...</p>;

    return (
        <div className="p-4">
            <h2 className="mb-3">Availability</h2>
            <ErrorBanner message={error} onClose={() => setError("")} />
            <Link to="/availabilitylist/new" className="btn btn-primary">New Availability</Link>
            <AvailabilityTable availability={availability} />
        </div>
    );
}

export default AvailabilityList;
