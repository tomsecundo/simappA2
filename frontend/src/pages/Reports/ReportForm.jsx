import { useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { Form, Button, Alert, Container } from 'react-bootstrap';

const ReportForm = () => {

  const [formData, setFormData] = useState({
    phaseStatus: '',
    mentorEmail: '',
    submissionDate: '',
    phase1: '', 
    startupName: '',
    programApplied: '',
    description: '',
    remarks: ''
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
        startupName: '',
        programApplied: '',
        applicationEmail: '',
        applicationPhone: '',
        description: '',
        remarks: ''
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

        <Form.Group className="mb-3" controlId="applicationChoice">
         
          <Form.Control
            as="select"
            value={formData.applicationChoice}
            onChange={(e) => setFormData({ ...formData, applicationChoice: e.target.value })}
            required
          >
            <option value="">Select phase</option>
            <option value="option1">Phase 1</option>
            <option value="option2">Phase 2</option>
            <option value="option3">Phase 3</option>
            <option value="option4">Phase 4</option>
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
            required
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