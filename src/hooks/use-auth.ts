import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@/store";
import { setUser, logout } from "@/store/auth-slice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  return {
    user,
    accessToken,

    setUser: (user: any) => dispatch(setUser(user)),
    logout: () => dispatch(logout()),
  };
};
