import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApplicationApi } from '../../api/applicationApi';
import { useProgramApi } from '../../api/programApi';
import ErrorBanner from '../../components/common/ErrorBanner';
import ApplicationFormComponent from '../../components/Application/ApplicationFormComponent';

function ApplicationEditForm() {
    const { id } = useParams();
    const { getApplicationById, updateApplication } = useApplicationApi();
    const { getPrograms } = useProgramApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        startupName: '',
        program: '',
        applicationEmail: '',
        applicationPhone: '',
        description: ''
    });
    const [error, setError] = useState('');

    // Get Application By ID
    const { data: application, isLoading: appLoading, error: appError } = useQuery({
        queryKey: ['application', id],
        queryFn: () => getApplicationById(id),
        enabled: !!id,
    });

    // Fetch all Programs
    const { data: programs = [] } = useQuery({
        queryKey: ['programs'],
        queryFn: getPrograms,
    });

    // Pre-fill form when data is loaded
    useEffect(() => {
        if (application) {
            setForm({
                startupName: application.startupName || '',
                program: application.program?._id || '',
                applicationEmail: application.applicationEmail || '',
                applicationPhone: application.applicationPhone || '',
                description: application.description || ''
            });
        }
    }, [application]);

    const mutation = useMutation({
        mutationFn: ({ id, data }) => updateApplication(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            queryClient.invalidateQueries(['application', id]);
            navigate('/applications');
        },
        onError: () => {
            setError('Failed to update application');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ id, data: form });
    };

    return (
        <div className="p-4">
            <h2>Edit Application</h2>
            <ErrorBanner message={error} onClose={() => setError('')} />
            <ApplicationFormComponent
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                programs={programs}
                isLoading={mutation.isLoading}
            />
        </div>
    );
}

export default ApplicationEditForm;
