import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApplicationApi } from '../../api/applicationApi';
import { useProgramApi } from '../../api/programApi';
import ErrorBanner from '../../components/common/ErrorBanner';
import ApplicationFormComponent from '../../components/Application/ApplicationFormComponent';

function ApplicationForm() {
    const { createApplication } = useApplicationApi();
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

    const { data: programs = [] } = useQuery({
        queryKey: ['programs'],
        queryFn: getPrograms,
    });

    const mutation = useMutation({
        mutationFn: createApplication,
        onSuccess: () => {
        queryClient.invalidateQueries(['applications']);
        navigate('/applications');
        },
        onError: () => {
        setError('Failed to submit application');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    return (
        <div className="p-4">
            <h2>New Application</h2>
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

export default ApplicationForm;
