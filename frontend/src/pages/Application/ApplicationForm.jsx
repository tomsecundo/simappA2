import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationsHook } from '../../hooks/applicationHook';
import { useProgramsHook } from '../../hooks/programHook';
import ErrorBanner from '../../components/common/ErrorBanner';
import ApplicationFormComponent from '../../components/Application/ApplicationFormComponent';

function ApplicationForm() {
    const navigate = useNavigate();
    const { createApplication } = useApplicationsHook();
    const { programsQuery } = useProgramsHook();

    const [form, setForm] = useState({
        startupName: '',
        program: '',
        applicationEmail: '',
        applicationPhone: '',
        description: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        createApplication.mutate(form, {
            onSuccess: () => navigate('/applications'),
            onError: () => setError('Failed to submit application'),
        });
    };

    if (programsQuery.isLoading) return <p>Loading programs...</p>;
    if (programsQuery.isError) return <ErrorBanner message="Failed to load programs" />;

    return (
        <div className="p-4">
            <h2>New Application</h2>
            <ErrorBanner message={error} onClose={() => setError('')} />
            <ApplicationFormComponent
                form={form}
                setForm={setForm}
                onSubmit={handleSubmit}
                programs={programsQuery.data || []}
                isLoading={createApplication.isLoading}
                submitLabel="Submit"
            />
        </div>
    );
}

export default ApplicationForm;
