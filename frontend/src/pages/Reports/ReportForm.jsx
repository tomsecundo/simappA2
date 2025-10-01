import { useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ReportForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
   
    mentorEmail: '',
    submissionDate: '',
    phase: '', 
    startupName: '',
    programApplied: '',
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
      await axiosInstance.post('/api/reports/new', formData);
      setSuccess(true);
      setFormData({
        mentorEmail: '',
        submissionDate: '',
        phase: '', 
        startupName: '',
        programApplied: '',
        description: ''
      });
    } catch (error) {
      // alert('Failed to save application. Please try again.');
      setError(error.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 720 }}>

      {success && (
        <Alert variant="success">Report submitted successfully! We'll contact you soon.</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <h1 className="text-3xl font-bold mb-3 text-center">Submit Reports</h1>
   
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-4">
        <Form.Group className="mb-3" controlId="startupName">
          <Form.Control
            type="text"
            placeholder={user.name}
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
        <Form.Group className="mb-3" controlId="mentorEmail">
          <Form.Control
            type="text"
            placeholder="Mentor Name"
            value={formData.mentorEmail}
            onChange={(e) => setFormData({ ...formData, mentorEmail: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="submissionDate">
          <Form.Control
            type="date"
            value={formData.submissionDate}
            onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="applicationChoice">
         
          <Form.Control
            as="select"
            value={formData.applicationChoice}
            onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
            required
          >
            <option value="">Select phase</option>
            <option value="Phase 1">Phase 1</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Phase 3">Phase 3</option>
            <option value="Phase 4">Phase 4</option>
          </Form.Control>
        </Form.Group>

     
        <Form.Group className="mb-3" controlId="description">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Report Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="applicationFile">
          <Form.Label>Attachments (Optional)</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFormData({ ...formData, applicationFile: e.target.files[0] })}
            
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? 'Saving...' : 'Submit Report'}
        </Button>
      </Form>
    </Container>
  );
};

export default ReportForm;