// hooks/programHook.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProgramApi } from '../api/programApi';

export function useProgramsHook() {
  const api = useProgramApi();
  const qc = useQueryClient();

  const programsQuery = useQuery({ queryKey: ['programs'], queryFn: api.getPrograms });
  const useProgram = (id) =>
    useQuery({ queryKey: ['program', id], queryFn: () => api.getProgramById(id), enabled: !!id });

  // Mentor
  const enrollAsMentor = useMutation({
    mutationFn: api.enrollAsMentor,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  const leaveProgram = useMutation({
    mutationFn: api.leaveProgram,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  // Admin
  const addProgramToMentor = useMutation({
    mutationFn: api.addProgramToMentor,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  const removeProgramFromMentor = useMutation({
    mutationFn: api.removeProgramFromMentor,
    onSuccess: () => qc.invalidateQueries(['programs']),
  });

  // Applications
  const useProgramApplications = (program_id) =>
    useQuery({
      queryKey: ['programApplications', program_id],
      queryFn: () => api.getProgramApplications(program_id),
      enabled: !!program_id,
    });

  const acceptApplication = useMutation({
    mutationFn: api.acceptApplication,
    onSuccess: (_d, { program_id }) => {
      qc.invalidateQueries(['programApplications', program_id]);
    },
  });

  return {
    programsQuery,
    useProgram,
    enrollAsMentor,
    leaveProgram,
    addProgramToMentor,
    removeProgramFromMentor,
    useProgramApplications,
    acceptApplication,
  };
}
