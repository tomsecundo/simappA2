import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMentorApi } from '../api/mentorApi';

export function useMentorsHook() {
    const api = useMentorApi();
    const qc = useQueryClient();

    const mentorsQuery = useQuery({
        queryKey: ['mentors'],
        queryFn: api.getMentors,
    });

    const useMentor = (id) =>
        useQuery({
            queryKey: ['mentor', id],
            queryFn: () => api.getMentorById(id),
            enabled: !!id,
        });

    const updateMentor = useMutation({
        mutationFn: ({ id, data }) => api.updateMentor(id, data),
        onSuccess: (_d, { id }) => {
            qc.invalidateQueries(['mentors']);
            qc.invalidateQueries(['mentor', id]);
        },
    });

    const deleteMentor = useMutation({
        mutationFn: api.deleteMentor,
        onSuccess: () => qc.invalidateQueries(['mentors']),
    });

    const enrollProgram = useMutation({
        mutationFn: api.enrollProgram,
        onSuccess: () => qc.invalidateQueries(['mentors']),
    });

    const leaveProgram = useMutation({
        mutationFn: api.leaveProgram,
        onSuccess: () => qc.invalidateQueries(['mentors']),
    });

    return { mentorsQuery, useMentor, updateMentor, deleteMentor, enrollProgram, leaveProgram };
}
