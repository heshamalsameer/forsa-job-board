import { Action_Types as actions } from "./ActionsTypes";

export const reduser = (state, action) => {
  switch (action.type) {
    case actions.ADD_JOB:
      return { ...state, jobs: [action.job, ...state.jobs] };
    case actions.DELETE_JOB:
      return {
        ...state,
        jobs: state.jobs.filter((j) => j.id !== action.id),
        employees: state.employees.filter((a) => a.id !== action.id),
      };
    case actions.ADD_USER:
      return { ...state, users: [...state.users, action.user], session: action.user.email };
    case actions.LOGIN:
      return { ...state, session: action.email };
    case actions.LOGOUT:
      return { ...state, session: null };
    case actions.ADD_NEW_EMPLOYEE:
      return { ...state, employees: [action.employee, ...state.employees] };
    case actions.REMOVE_FROM_EMPLOYEES:
      return { ...state, employees: state.employees.filter((a) => a.appId !== action.appId) };
    case actions.SET_APPLICATION_STATUS:
      return { ...state, employees: state.employees.map((a) => (a.appId === action.appId ? { ...a, status: action.status } : a)) };
    case actions.TOGGLE_SAVED: {
      const list = state.saved[action.email] || [];
      const next = list.includes(action.id) ? list.filter((x) => x !== action.id) : [...list, action.id];
      return { ...state, saved: { ...state.saved, [action.email]: next } };
    }
    default:
      return state;
  }
};
