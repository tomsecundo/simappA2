import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApplicationApi } from '../../api/applicationApi';
// import { useFeedbackApi } from '../../api/feedbackApi';
// import FeedbackForm from '../components/FeedbackForm';
// import FeedbackList from '../components/FeedbackList';
import ErrorBanner from '../../components/common/ErrorBanner';
function ApplicationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { getApplicationById, updateApplicationStatus } = useApplicationApi();
    // const { getFeedbacks, createFeedback, updateFeedback, deleteFeedback } = useFeedbackApi();

    // Fetch application detail
    const {
        data: application,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['application', id],
        queryFn: () => getApplicationById(id),
        enabled: !!id,
    });

    // Fetch feedbacks
    // const {
    //     data: feedbacks = [],
    //     isLoading: feedbackLoading,
    //     error: feedbackError,
    // } = useQuery({
    //     queryKey: ['feedbacks', id],
    //     queryFn: () => getFeedbacks(id),
    //     enabled: !!id,
    // });

    // Mutations
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => updateApplicationStatus(id, status),
        onSuccess: () => {
        queryClient.invalidateQueries(['application', id]);
        queryClient.invalidateQueries(['applications']);
        },
    });

    // const createFeedbackMutation = useMutation({
    //     mutationFn: ({ applicationId, feedback }) => createFeedback(applicationId, feedback),
    //     onSuccess: () => queryClient.invalidateQueries(['feedbacks', id]),
    // });

    // const updateFeedbackMutation = useMutation({
    //     mutationFn: ({ feedbackId, feedback }) => updateFeedback(feedbackId, feedback),
    //     onSuccess: () => queryClient.invalidateQueries(['feedbacks', id]),
    // });

    // const deleteFeedbackMutation = useMutation({
    //     mutationFn: (feedbackId) => deleteFeedback(feedbackId),
    //     onSuccess: () => queryClient.invalidateQueries(['feedbacks', id]),
    // });

    // Handlers
    const handleStatusChange = (status) => {
        updateStatusMutation.mutate({ id, status });
    };

    // const handleFeedbackSubmit = (feedback, editingFeedbackId) => {
    //     if (editingFeedbackId) {
    //     updateFeedbackMutation.mutate({ feedbackId: editingFeedbackId, feedback });
    //     } else {
    //     createFeedbackMutation.mutate({ applicationId: id, feedback });
    //     }
    // };

    // const handleFeedbackDelete = (feedbackId) => {
    //     deleteFeedbackMutation.mutate(feedbackId);
    // };

    if (isLoading) return <p>Loading application...</p>;
    if (error) return <ErrorBanner message="Failed to load application details" />;
    if (!application) return <p>Application not found</p>;

    return (
        <div className="p-6">
        <button
            onClick={() => navigate('/applications')}
            className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
            ← Back to Applications
        </button>

        <h1 className="text-2xl font-bold mb-4">Application Details</h1>

        <div className="bg-white shadow-md rounded p-6 mb-6">
            <p><strong>Startup:</strong> {application.startupName}</p>
            <p><strong>Program Applied:</strong> {application.programApplied}</p>
            <p><strong>Email:</strong> {application.applicationEmail}</p>
            <p><strong>Phone:</strong> {application.applicationPhone}</p>
            <p><strong>Status:</strong> {application.status}</p>
            <p><strong>Description:</strong> {application.description}</p>
        </div>

        {/* Status Update Section */}
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Update Application Status</h2>
            <div className="flex flex-wrap gap-2">
            {['Pending', 'Under Review', 'Accepted', 'Rejected'].map((status) => (
                <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={updateStatusMutation.isLoading || application.status === status}
                className={`px-4 py-2 rounded ${
                    application.status === status
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
                >
                {status}
                </button>
            ))}
            </div>
        </div>

        {/* Feedback Section */}
        {/* <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Feedback</h2>
            <FeedbackForm
            onSubmit={handleFeedbackSubmit}
            loading={createFeedbackMutation.isLoading || updateFeedbackMutation.isLoading}
            error={feedbackError}
            />
            <FeedbackList
            feedbacks={feedbacks}
            loading={feedbackLoading}
            currentUserId={application.createdBy?._id}
            onEdit={(fb) => {}}
            onDelete={handleFeedbackDelete}
            />
        </div> */}
        </div>
    );
}

export default ApplicationDetail;
