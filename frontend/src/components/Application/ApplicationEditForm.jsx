import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApplicationApi } from '../../api/applicationApi';
import { useProgramApi } from '../../api/programApi';
import ErrorBanner from '../../components/common/ErrorBanner';

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

    // Get application detail
    const { data: application, isLoading: appLoading, error: appError } = useQuery({
        queryKey: ['application', id],
        queryFn: () => getApplicationById(id),
        enabled: !!id,
    });

    // Fetch programs
    const { data: programs = [] } = useQuery({
        queryKey: ['programs'],
        queryFn: getPrograms
    });

    // Mutation for update
    const mutation = useMutation({
        mutationFn: ({ id, data }) => updateApplication(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['applications']);
            queryClient.invalidateQueries(['application', application._id]);
            navigate('/applications');
        },
        onError: () => {
            setError('Failed to update application');
        }
    });

    // Pre-fill form
    useEffect(() => {
        if (application) {
            setForm({
                startupName: application.startupName || '',
                program: application.program?._id || '',
                applicationEmail: application.applicationEmail || '',
                applicationPhone: application.applicationPhone || '',
                description: application.description || ''
            });
            console.log(application);
        }
    }, [application]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ id, data: form });
    };

    return (
        <div className="p-4">
            <h2>Edit Application</h2>
            <ErrorBanner message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit} className="space-y-3">
                <input 
                    className="form-control" 
                    name="startupName"
                    placeholder='Startup Name'
                    value={form.startupName} 
                    onChange={handleChange} 
                    required 
                />
                <select 
                    className="form-control" 
                    name="program"
                    placeholder="Program"
                    value={form.program} 
                    onChange={handleChange} 
                    required
                >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                            {program.title}
                        </option>
                    ))}
                </select>
                <input 
                    className="form-control" 
                    type="email" 
                    name="applicationEmail"
                    placeholder='Email'
                    value={form.applicationEmail} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    className="form-control" 
                    type="tel" 
                    name="applicationPhone"
                    placeholder='Phone'
                    value={form.applicationPhone} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    className="form-control" 
                    name="description"
                    value={form.description} 
                    onChange={handleChange} 
                />
                <button 
                    type="submit" 
                    className="btn btn-primary" 
                    disabled={mutation.isLoading}
                >
                    {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <Link to="/applications" className="btn btn-secondary mt-3 m-2">Cancel</Link>
            </form>
        </div>
    );
}

export default ApplicationEditForm;
