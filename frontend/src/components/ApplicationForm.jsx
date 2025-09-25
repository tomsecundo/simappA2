import { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const ApplicationForm = () => {

  const [formData, setFormData] = useState({
    startupName: '',
    programApplied: '',
    applicationEmail: '',
    applicationPhone: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/api/applications/apply', formData);
      setSuccess(true);
      setFormData({
        startupName: '',
        programApplied: '',
        applicationEmail: '',
        applicationPhone: '',
        description: ''
      });
    } catch (error) {
      // alert('Failed to save application. Please try again.');
      setError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 720 }}>

      {success && (
        <Alert variant="success">Application submitted successfully! We'll contact you soon.</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <h1 className="text-3xl font-bold mb-3 text-center">Startup Incubation Application</h1>
      <p className="text-gray-600 mb-4 text-center">
        Complete the form below to submit your application for our startup incubation program.
      </p>
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-4">
        <Form.Group className="mb-3" controlId="startupName">
          <Form.Control
            type="text"
            placeholder="Startup Name"
            value={formData.startupName}
            onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="programApplied">
          <Form.Control
            type="text"
            placeholder="Program Applied For"
            value={formData.programApplied}
            onChange={(e) => setFormData({ ...formData, programApplied: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="applicationEmail">
          <Form.Control
            type="email"
            placeholder="Contact Email"
            value={formData.applicationEmail}
            onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="applicationPhone">
          <Form.Control
            type="tel"
            placeholder="Contact Phone"
            value={formData.applicationPhone}
            onChange={(e) => setFormData({ ...formData, applicationPhone: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Application Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? 'Saving...' : 'Submit Application'}
        </Button>
      </Form>
    </Container>
  );
};

export default ApplicationForm;