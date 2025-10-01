import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useProgramApi } from '../api/programApi';

export function useProgramsHook() {
    const api = useProgramApi();
    const qc = useQueryClient();

    // all programs
    const programsQuery = useQuery({
        queryKey: ['programs'],
        queryFn: api.getPrograms,
    });

    // one program
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

    return { programsQuery, useProgram, createProgram, updateProgram, deleteProgram };
}
