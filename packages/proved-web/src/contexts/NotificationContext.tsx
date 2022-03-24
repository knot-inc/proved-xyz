import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

export type Content = {
  type: NotificationType;
  message: string;
  title: string;
};

export enum NotificationType {
  Warning,
  Success,
  Error,
}
type State = { content?: Content | undefined; show: boolean } | undefined;
type Action =
  | { type: "SHOW_NOTIFICATION"; input: Content }
  | { type: "HIDE_NOTIFICATION" };

const NotificationStateContext = createContext<State>(undefined);
const NotificationDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined
);

const reducer = (state: State, action: Action): State => {
  switch (action?.type) {
    case "SHOW_NOTIFICATION":
      const content: Content = {
        ...action.input,
      };
      return {
        content,
        show: true,
      };
    case "HIDE_NOTIFICATION":
      return {
        content: undefined,
        show: false,
      };
    default:
      return {
        content: undefined,
        show: false,
      };
  }
};

const initialState = {
  show: false,
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
};

export const useNotificationState = () => {
  const state = useContext(NotificationStateContext);
  if (state === undefined) {
    throw new Error(
      "useNotificationState should be used with NotificationProvider"
    );
  }
  return state;
};

export const useNotificationDispatch = () => {
  const dispatch = useContext(NotificationDispatchContext);

  if (dispatch === undefined) {
    throw new Error(
      "useNotificationDispatch should be used with NotificationProvider"
    );
  }
  return dispatch;
};
