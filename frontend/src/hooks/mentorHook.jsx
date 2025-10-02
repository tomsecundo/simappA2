// hooks/mentorHook.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMentorApi } from '../api/mentorApi';

export function useMentorsHook() {
  const api = useMentorApi();
  const qc = useQueryClient();

  const mentorsQuery = useQuery({ queryKey: ['mentors'], queryFn: api.getAll });

  const updateMentor = useMutation({
    mutationFn: ({ id, data }) => api.updateByAdmin(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries(['mentors']);
      qc.invalidateQueries(['mentor', id]);
    },
  });

  const deleteMentor = useMutation({
    mutationFn: api.deleteMentor,
    onSuccess: () => qc.invalidateQueries(['mentors']),
  });

  return { mentorsQuery, updateMentor, deleteMentor };
}

export function useMentor(id) {
  const api = useMentorApi();
  return useQuery({
    queryKey: ['mentor', id],
    queryFn: () => api.getById(id),
    enabled: !!id,
  });
}
