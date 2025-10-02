import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEventApi } from '../../api/eventAPI';
import ErrorBanner from '../../components/common/ErrorBanner';

function EventEditForm() {
    const { id } = useParams();
    const { getEventById, updateEvent } = useEventApi();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        eventName: '',
        eventDescription: '',
        eventDate: '',
        eventVenue: '',
        eventType: '',
        coverage: ''
    });
    const [error, setError] = useState('');

    // Get Event By ID
    const { data: event, isLoading, error: loadError } = useQuery({
        queryKey: ['event', id],
        queryFn: () => getEventById(id),
        enabled: !!id,
    });

    // Pre-fill form when data is loaded
    useEffect(() => {
        if (!event) return; 
            setForm({
                eventName: event.eventName ?? '',
                eventDescription: event.eventDescription ?? '',
                eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0,10) : '',
                eventVenue: event.eventVenue ?? '',
                eventType: event.eventType ?? '',
                coverage: event.coverage ?? ''
            });
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const mutation = useMutation({
        mutationFn: ({ id, data }) => updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['events']});
            queryClient.invalidateQueries({queryKey: ['event', id]});
            navigate('/events');
        },
        onError: (err) => {
            setError(err?.respnse?.data?.message || err?.message || 'Failed to update event');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate({ id, data: form });
    };

    if (isLoading) return <div className="p-4"> Loading event...</div>;
    if (loadError) return <div className="p-4 text-red-500"> Failed to load event </div>;

    return (
        <div className="p-4 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Edit Event</h2>
            <ErrorBanner message={error} onClose={() => setError('')} />
            
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
                <input
                    type="text"
                    name="eventName"
                    value={form.eventName}
                    onChange={handleChange}
                    placeholder="Event Title"
                    className="w-full border rounded p-2"
                    required
                />
                <textarea
                    name="eventDescription"
                    value={form.eventDescription}
                    onChange={handleChange}
                    placeholder="Event Description"
                    rows={3}
                    className="w-full border rounded p-2"
                    required
                />
                <input
                    type="date"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                    placeholder="Event Date"
                    className="w-full border rounded p-2"
                    required
                />
                <input
                    type="text"
                    name="eventVenue"
                    value={form.eventVenue}
                    onChange={handleChange}
                    placeholder="Event Venue"
                    className="w-full border rounded p-2"
                    required
                />
                <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    placeholder="Event Type"
                    className="w-full border rounded p-2"
                    required
                >
                    <option value="">Select Event Type</option>
                    <option value="Networking">Networking</option>
                    <option value="Demo Day">Demo Day</option>
                </select>
                <select
                    name="coverage"
                    value={form.coverage}
                    onChange={handleChange}
                    placeholder="Event Type"
                    className="w-full border rounded p-2"
                    required
                >
                    <option value="">Select Event Coverage</option>
                    <option value="Private">Private</option>
                    <option value="Public">Public</option>
                </select>
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={mutation.isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
                >
                    {mutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                    type="button"
                    onClick={()=> navigate('/events')}
                    className="px-4 py-2 border rounded"
                >
                    Update
                </button>
            </div>
            </form>
        </div>
    );
}

export default EventEditForm;
