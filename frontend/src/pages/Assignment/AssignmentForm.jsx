import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

//Form with validation
const AssignmentForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
   
    title: '',
    description: '',
    startup: '', 
    applicationName: '',
    phase: '',
    deadline: '',
  });
  
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStartups = async () => {
      try {
        const token = user?.token || localStorage.getItem('token');
        if (!token) return;

        const res = await axiosInstance.get('/api/user/startups', {
          headers: { Authorization: `Bearer ${token}`},
      });
        setStartups(res.data || []);
      } catch {
        setError('Failed to load startups');
      }
    };
    loadStartups();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {

      if (!/^[a-f\d]{24}$/i.test(formData.startup)) {
        setError('Please select a startup from the list');
        setLoading(false);
        return;
      }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            startup: formData.startup, 
            applicationName: formData.applicationName.trim(),
            phase: formData.phase,
            deadline: formData.deadline
            ? (() => {
                const d = new Date(formData.deadline);
                d.setHours(23,59,59,999);
                return d.toISOString();
            }) ()
            : null,
        };
      
      const token = user?.token || localStorage.getItem('token');

      await axiosInstance.post('/api/assignment', payload, {
        headers: token ? { Authorization: `Bearer ${token}`} : undefined,
      });
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        startup: '', 
        applicationName: '',
        phase: '',
        deadline: '',        
      });
    } catch (error) {
      // alert('Failed to save application. Please try again.');
      setError(error.response?.data?.message || 'Failed to submit assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: 720 }}>

      {success && (
        <Alert variant="success">Assignment created!</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <h1 className="text-3xl font-bold mb-3 text-center">Create Assignment</h1>
   
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-4">
        <Form.Group className="mb-3" controlId="title">
          <Form.Control
            type="text"
            placeholder="Assignment Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Assignment Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="startup">
          <Form.Select
            value={formData.startup}
            onChange={(e) => setFormData({ ...formData, startup: e.target.value })}
            required
          >
            <option value="">Select Startup</option>
            {startups.map(s=> (
              <option key ={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3" controlId="applicationName">
          <Form.Control
            type="text"
            placeholder="Application Name"
            value={formData.applicationName}
            onChange={(e) => setFormData({ ...formData, applicationName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="phase">
         
          <Form.Control
            as="select"
            value={formData.phase}
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

        <Form.Group className="mb-3" controlId="deadline">
          <Form.Control
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading} className="w-100">
          {loading ? 'Saving...' : 'Submit Assignment'}
        </Button>
      </Form>
    </Container>
  );
};

export default AssignmentForm;