import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function ApplicationFormComponent({ form = {}, setForm = {} , onSubmit, programs = [], isLoading }) {
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <input
                className="form-control"
                name="startupName"
                placeholder="Startup Name"
                value={form.startupName || ''}
                onChange={handleChange}
                required
            />
            <select
                className="form-control"
                name="program"
                placeholder="Program"
                value={form.program || ''}
                onChange={handleChange}
                required
            >
                <option value="">Select Program</option>
                {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.title}
                    </option>
                ))}
            </select>
            <input
                className="form-control"
                type="email"
                name="applicationEmail"
                placeholder="Email"
                value={form.applicationEmail|| ''}
                onChange={handleChange}
                required
            />
            <input
                className="form-control"
                type="tel"
                name="applicationPhone"
                placeholder="Phone"
                value={form.applicationPhone || ''}
                onChange={handleChange}
                required
            />
            <textarea
                className="form-control"
                name="description"
                placeholder="Description"
                value={form.description || ''}
                onChange={handleChange}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Submit'}
            </button>
            <Link to={'/applications'} className='btn btn-secondary mx-2'>Cancel</Link>
        </form>
    );
}

export default ApplicationFormComponent;
