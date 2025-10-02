// hooks/programHook.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProgramApi } from '../api/programApi';

export function useProgramsHook() {
  const api = useProgramApi();
  const qc = useQueryClient();

  // Queries
  const programsQuery = useQuery({
    queryKey: ['programs'],
    queryFn: api.getPrograms,
  });

  const useProgram = (id) =>
    useQuery({
      queryKey: ['program', id],
      queryFn: () => api.getProgramById(id),
      enabled: !!id,
    });

  const createProgram = useMutation({
    mutationFn: api.createProgram,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  const updateProgram = useMutation({
    mutationFn: ({ id, data }) => api.updateProgram(id, data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries(['programs']);
      qc.invalidateQueries(['program', id]);
    },
  });

  const deleteProgram = useMutation({
    mutationFn: api.deleteProgram,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  // Mentor self
  const enrollAsMentor = useMutation({
    mutationFn: api.enrollAsMentor,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  const leaveProgram = useMutation({
    mutationFn: api.leaveProgram,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  // Admin mentor assignment
  const addProgramToMentor = useMutation({
    mutationFn: api.addProgramToMentor,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  const removeProgramFromMentor = useMutation({
    mutationFn: api.removeProgramFromMentor,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  // Applications
  const useProgramApplications = (programId) =>
    useQuery({
      queryKey: ['programApplications', programId],
      queryFn: async () => {
        try {
          return await api.getProgramApplications(programId);
        } catch (error) {
          if (error.response?.status === 404) {
            return [];
          }
          throw error;
        }
      },
      enabled: !!programId,
    });

    const acceptApplication = useMutation({
        mutationFn: api.acceptApplication,
        onSuccess: (_d, { programId }) => {
        qc.invalidateQueries(['programApplications', programId]);
    },
  });

  return {
    programsQuery,
    useProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    enrollAsMentor,
    leaveProgram,
    addProgramToMentor,
    removeProgramFromMentor,
    useProgramApplications,
    acceptApplication,
  };
}
