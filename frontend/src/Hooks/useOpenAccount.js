import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const useOpenAccount = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const openAccount = (userId) => {
    if (!userId) return;
    if (userId === user.id) {
      navigate("/account");
    } else {
      navigate(`/account/${userId}`);
    }
  };

  return openAccount;
};

export default useOpenAccount;
