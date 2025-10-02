import { useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

//Form with validation
const EventForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
   
    eventName: '',
    eventDescription: '',
    eventDate: '', 
    eventVenue: '',
    eventType: '',
    coverage: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {

        const payload = {
            eventName: formData.eventName.trim(),
            eventDescription: formData.eventDescription.trim(),
            eventDate: formData.eventDate || null,
            eventVenue: formData.eventVenue.trim(),
            eventType: formData.eventType,
            coverage: formData.coverage,
        };

        if (!payload.eventName || !payload.eventDescription || !payload.eventDate || !payload.eventVenue) {
            setError('Please complete all required fields.');
            setLoading(false);
            return;
        }
      
      const token = user?.token || localStorage.getItem('token');

      await axiosInstance.post('/api/events', payload, {
        headers: token ? { Authorization: `Bearer ${token}`} : undefined,
      });
      setSuccess(true);
      setFormData({
        eventName: '',
        eventDescription: '',
        eventDate: '', 
        eventVenue: '',
        eventType: '',
        coverage: '',        
      });
    } catch (error) {
      // alert('Failed to save event. Please try again.');
      setError(error.response?.data?.message || 'Failed to submit event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 720 }}>

      {success && (
        <Alert variant="success">Event created!</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <h1 className="text-3xl font-bold mb-3 text-center">Create Event</h1>
   
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-4">
        <Form.Group className="mb-3" controlId="eventName">
          <Form.Control
            type="text"
            placeholder="Event Title"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="eventDescription">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Event Description"
            value={formData.eventDescription}
            onChange={(e) => setFormData({ ...formData, eventDescription: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="eventDate">
          <Form.Control
            type="date"
            value={formData.eventDate}
            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
            min={new Date().toISOString().slice(0,10)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="eventVenue">
          <Form.Control
            type="text"
            placeholder="Event Venue"
            value={formData.eventVenue}
            onChange={(e) => setFormData({ ...formData, eventVenue: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="eventType">
         
          <Form.Select
            value={formData.eventType}
            onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            required
          >
            <option value="">Select Event Type</option>
            <option value="Networking">Networking</option>
            <option value="Demo Day">Demo Day</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="coverage">
          <Form.Select
            value={formData.coverage}
            onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
            required
          >
            <option value="">Select Event Coverage</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? 'Saving...' : 'Submit Event'}
        </Button>
      </Form>
    </Container>
  );
};

export default EventForm;