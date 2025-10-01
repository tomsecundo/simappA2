import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApplicationApi } from '../api/applicationApi';

export function useApplicationsHook() {
    const api = useApplicationApi();
    const qc = useQueryClient();

    // Fetch all applications
    const applicationsQuery = useQuery({
        queryKey: ['applications'],                    
        queryFn: api.getApplications,
    });

    // Get application by id
    const useApplication = (id) => useQuery({
        queryKey: ['application', id],        
        queryFn: () => api.getApplicationById(id),
        enabled: !!id, // only runs if id exists
    });

    // create new application
    const createApplication = useMutation({
        mutationFn: api.createApplication,
        onSuccess: () => qc.invalidateQueries(['applications']),
    });

    // update application
    const updateApplication = useMutation({
        mutationFn: ({ id, data }) => api.updateApplication(id, data),
        onSuccess: (_, { id }) => qc.invalidateQueries(['applications']),
    });

    // update status
    const updateStatus = useMutation({
        mutationFn: ({ id, status }) => api.updateApplicationStatus(id, status),
        onSuccess: (_d, { id }) => {
            qc.invalidateQueries(['applications']);
            qc.invalidateQueries(['application', id])
        }
    });

    // delete application
    const deleteApplication = useMutation({
        mutationFn: (id) => api.deleteApplication(id),
        onSuccess: () => qc.invalidateQueries(['applications']),
    });

    return {
        // queries
        applicationsQuery,
        useApplication,
        createApplication,
        updateApplication,
        updateStatus,
        deleteApplication,
    }
    
    // We do not need useState / useEffect since we implemented useQuery already

    // const [applications, setApplications] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState('');

    // useEffect(() => {
    //     async function load() {
    //         try {
    //             const data = await getApplications();
    //             setApplications(data);
    //         } catch {
    //             setError('Failed to fetch applications');
    //         } finally {
    //             setLoading(false);
    //         }
    //     }
    //     load();
    // }, []);

}
