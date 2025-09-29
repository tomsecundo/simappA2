import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationApi } from '../../api/applicationApi';
import { useProgramApi } from '../../api/programApi';
import ErrorBanner from '../../components/common/ErrorBanner';

function ApplicationForm() {
    const { createApplication } = useApplicationApi();
    const { getPrograms } = useProgramApi();
    const navigate = useNavigate();

    const [form, setForm] = useState({ 
        startupName: '', 
        program: '', 
        applicationEmail: '', 
        applicationPhone: '', 
        description: '' 
    });
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadPrograms() {
            try {
                const data = await getPrograms();
                setPrograms(data);
            } catch (err) {
                setError("Failed to fetch programs");
            }
        }
        loadPrograms();
    }, [getPrograms]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createApplication(form);
            if (!result) {
                setError("No response from server");
            }
            navigate('/applications');
        } catch (err) {
            setError('Failed to submit application');
        }
    };

    return (
        <div className="p-4">
            <h2>New Application</h2>
            <ErrorBanner message={error} onClose={() => setError('')} />
            <form onSubmit={handleSubmit} className="space-y-3">
                <input 
                    className="form-control" 
                    name="startupName" 
                    placeholder="Startup Name" 
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
                    placeholder="Email" 
                    value={form.applicationEmail} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    className="form-control" 
                    type="tel" 
                    name="applicationPhone" 
                    placeholder="Phone" 
                    value={form.applicationPhone} 
                    onChange={handleChange} 
                    required 
                />
                <textarea 
                    className="form-control" 
                    name="description" 
                    placeholder="Description" 
                    value={form.description} 
                    onChange={handleChange} 
                />
                <button type="submit" className="btn btn-success">Submit</button>
            </form>
        </div>
    );
}

export default ApplicationForm;