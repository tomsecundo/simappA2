import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserApi } from '../api/userApi';

export function useUserHook() {
    const api = useUserApi();
    const qc = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ['userProfile'],
        queryFn: api.getProfile,
    });

    const updateProfile = useMutation({
        mutationFn: api.updateProfile,
        onSuccess: () => qc.invalidateQueries(['userProfile']),
    });

    const changePassword = useMutation({
        mutationFn: api.changePassword,
    });

    const allUsersQuery = useQuery({
        queryKey: ['users'],
        queryFn: api.getAllUsers,
        enabled: false,
    });

    const updateUserByAdmin = useMutation({
        mutationFn: ({ id, data }) => api.updateUserByAdmin(id, data),
        onSuccess: (_d, { id }) => {
        qc.invalidateQueries(['users']);
        qc.invalidateQueries(['user', id]);
        },
    });

    const deleteUser = useMutation({
        mutationFn: api.deleteUser,
        onSuccess: () => qc.invalidateQueries(['users']),
    });

    return {
        profileQuery,
        updateProfile,
        changePassword,
        allUsersQuery,
        updateUserByAdmin,
        deleteUser,
    };
}

export function useUserById(id) {
    const api = useUserApi();
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => api.getUserById(id),
        enabled: !!id,
    });
}
