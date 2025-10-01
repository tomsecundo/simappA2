import { useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const ProgressForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    applicationId: '1',
    mentorEmail: 'one',
    phase1: 'Started',
    phase2: 'Started', 
    phase3: 'Started',
    phase4: 'Started',
    startupName: 'nars'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log(formData);
      await axiosInstance.post('/api/progress/new', formData);
      
      setSuccess(true);
      setFormData({
        applicationId: '',
        mentorEmail: '',
        phase1: '',
        phase2: '', 
        phase3: '',
        phase4: '',
        startupName: ''

      });
    } catch (error) {
      // alert('Failed to generate progress. Please try again.');
      setError(error.response?.data?.message || error.message + ': Failed to generate progress chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 720 }}>

      {success && (
        <Alert variant="success">Progress generated! We'll contact you soon.</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <h1 className="text-3xl font-bold mb-3 text-center">Generate Progress</h1>
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-4">
      <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? 'Saving...' : 'Generate Progress'}
        </Button>
      </Form>
    </Container>
  );
};

export default ProgressForm;