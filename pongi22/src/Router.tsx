import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import Admin from './Admin';
import ResultService from './ResultService';

type Props = {
  children: JSX.Element | JSX.Element[]
}

const location = new ReactLocation();

const AppRouter = ({ children }: Props) => {
  return (
    <Router
      location={location}
      routes={[
        {
          path: "/",
          element: <ResultService />,
        },
        {
          path: "admin",
          element: <Admin />,
        },
      ]}
    >
      {children}
      <Outlet />
    </Router>
  )
}

export default AppRouter