import { useAuth as useAuthFromProvider } from "../Components/Auth/AuthProvider";

const useAuth = () => {
    return useAuthFromProvider();
}

export default useAuth; 