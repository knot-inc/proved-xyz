import { API, Auth, Hub } from "aws-amplify";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthData } from "types";
import { Org, S3Object, UserGetQuery } from "API";
import { userGet } from "graphql/queries";

export interface UserData {
  id: string;
  email: string | null;
  name: string | null;
  address: string | null;
  verified: boolean | null;
  profileImage?: S3Object | null;
  orgs?: Array<Org | null> | null;
}

export interface User {
  data: UserData | null;
  loading: boolean;
  isAuthenticated: boolean;
}

interface UserEvent {
  payload: {
    event: string;
    data?: UserData;
  };
}

const initialUser = {
  loading: true,
  isAuthenticated: false,
  data: null,
};

const UserContext = createContext<User>(initialUser);

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(initialUser);

  const signOutUser = () => {
    setUser({ loading: false, isAuthenticated: false, data: null });
  };

  const setUserData = (data: UserData) => {
    setUser({ loading: false, isAuthenticated: true, data });
  };

  const setLoading = (loading: boolean) => {
    setUser((u) => ({ ...u, loading }));
  };

  useEffect(() => {
    const initUser = async (): Promise<UserData | null> => {
      try {
        setLoading(true);
        const authData = await Auth.currentAuthenticatedUser();
        const userdata = (await API.graphql({
          query: userGet,
          variables: {
            id: authData.name,
          },
        })) as { data: UserGetQuery };

        if (!userdata.data.userGet) {
          // Unlikely to happen
          // If the query has any error, it goes to the "catch" block
          return null;
        }
        const data: UserData = {
          ...authData,
          ...userdata?.data.userGet,
          address: authData.name,
        };
        Object.freeze(data);
        setUserData(data);
        console.log("==== init user data", data);
        return data;
      } catch {
        // Not signed in
        signOutUser();
        return null;
      }
    };

    /**  
    /* discordData contains name email profileImage
    **/
    const verifyUser = async (
      discordData?: UserData
    ): Promise<UserData | null> => {
      setLoading(true);
      const authData = await Auth.currentAuthenticatedUser();
      const userdata = (await API.graphql({
        query: userGet,
        variables: {
          id: authData.name,
        },
      })) as { data: UserGetQuery };

      // Userdata is define id as an wallet address but cognito user has wallet id as name
      const address = authData.name;
      const data: UserData = {
        ...authData,
        ...userdata?.data.userGet,
        ...discordData,
        address,
        verified: true,
      };
      Object.freeze(data);
      setUserData(data);
      console.log("==== update user data", data);
      return data;
    };

    const registerUser = async () => {
      setLoading(true);
      const authData: AuthData = await Auth.currentAuthenticatedUser();
      const userdata = (await API.graphql({
        query: userGet,
        variables: {
          id: authData.name,
        },
      })) as { data: UserGetQuery };
      const verified = userdata.data.userGet?.verified || false;
      const data: UserData = {
        ...authData,
        ...userdata?.data.userGet,
        address: authData.name,
        verified,
      };
      Object.freeze(data);
      setUserData(data);
      console.log("===== userdata", data);
    };

    const signOut = async () => {
      await Auth.signOut();
      signOutUser();
    };

    // Custom event listener
    const userListener = async ({ payload: { event, data } }: UserEvent) => {
      switch (event) {
        case "register":
          await registerUser();
          break;
        case "verify":
          await verifyUser(data);
          break;
        case "signout":
          await signOut();
          break;
        default:
          break;
      }
    };
    Hub.listen("user", userListener);

    // gets called every time tab is open
    initUser();

    return () => {
      Hub.remove("user", userListener);
    };
    // Should be requested just once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = (): User => useContext(UserContext);
