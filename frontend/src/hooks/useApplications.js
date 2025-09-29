import { useEffect, useState } from 'react';
import { useApplicationApi } from '../api/applicationApi';

export function useApplications() {
    const { getApplications } = useApplicationApi();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            try {
                const data = await getApplications();
                setApplications(data);
            } catch {
                setError('Failed to fetch applications');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { applications, setApplications, loading, error, setError };
}
