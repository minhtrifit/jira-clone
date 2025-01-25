import { create } from "zustand";

const useApiStore = create((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (url: string) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("API call failed!");

      const data = await response.json();
      set({ data, loading: false });
    } catch (error) {
      set({ error: error, loading: false });
    }
  },
}));

export default useApiStore;

// const { data, loading, error, fetchData } = useApiStore();

// useEffect(() => {
//   fetchData('https://jsonplaceholder.typicode.com/posts');
// }, []);
