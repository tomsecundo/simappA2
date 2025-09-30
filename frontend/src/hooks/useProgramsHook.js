import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProgramApi } from "../api/programApi";

export function useProgramsHook() {
    const api = useProgramApi();
    const qc = useQueryClient();

    const programsQuery = useQuery({
        queryKey: ['programs'],
        queryFn: api.getPrograms,
    });

    const useProgram = (id) => useQuery({
        queryKey: ['program', id],
        queryFn: () => api.getProgramById(id),
        enabled: !!id, // only run if id is passed
    });

    const createProgram = useMutation({
        mutationFn: api.createProgram,
        onSuccess: () => qc.invalidateQueries(['programs']),
    })

    const updateProgram = useMutation({
        mutationFn: ({ id, data }) => api.updateProgram(id, data),
        onSuccess: (_data, { id }) => {
            qc.invalidateQueries(['programs']);
            qc.invalidateQueries(['program', id]);
        }
    });

    const deleteProgram = useMutation({
        mutationFn: api.deleteProgram,
        onSuccess: () => qc.invalidateQueries(['programs']),
    });

    return {
        programsQuery,
        useProgram,
        createProgram,
        updateProgram,
        deleteProgram,
    };
}