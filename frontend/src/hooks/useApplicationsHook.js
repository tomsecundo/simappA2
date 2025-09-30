// import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApplicationApi } from '../api/applicationApi';

export function useApplicationsHook() {
    const { getApplications, getApplicationById, createApplication, updateApplication, deleteApplication } = useApplicationApi();
    const queryClient = useQueryClient();

    // Fetch all applications
    const applicationsQuery = useQuery({
        queryKey: ['applications'],                    
        queryFn: getApplications,
    });

    // Get application by id
    const useApplication = (id) => useQuery({
        queryKey: ['application', id],        
        queryFn: () => getApplicationById(id),
        enabled: !!id, // only runs if id exists
    });

    // create new application
    const createMutation = useMutation({
        mutationFn: createApplication,
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
        },
    });

    // update application
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateApplication(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries(['applications']);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteApplication(id),
        onSuccess: () => {
        queryClient.invalidateQueries(['applications']);
        },
    });

    return {
        // queries
        applicationsQuery,
        useApplication,
        // mutations
        createApplication: createMutation.mutate,
        updateApplication: updateMutation.mutate,
        deleteApplication: deleteMutation.mutate,
        // mutation states
        isCreating: createMutation.isLoading,
        isUpdate: updateMutation.isLoading,
        isDeleting: deleteMutation.isLoading,
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
