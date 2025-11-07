// hooks/useSubjects.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://e-question-server.vercel.app/api";

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/subject`);
      return data;
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, token }) => {
      return await axios.delete(`${BASE_URL}/subject/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]); // 👈 Refresh cache
    },
  });
};

export const useUpdateSubjectStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, token }) => {
      return await axios.patch(
        `${BASE_URL}/subject/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["subjects"]); // 👈 Refresh cache
    },
  });
};
