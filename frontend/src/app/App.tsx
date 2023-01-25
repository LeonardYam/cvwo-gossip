import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import { createRoutesFromElements } from "react-router";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Thread from "../pages/Thread";
import { useAppSelector } from "./hooks";
import { selectCurrUser } from "../reducers/auth";

const App = () => {
  const currUser = useAppSelector(selectCurrUser)

  // React-router-v6 router
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path="/" element={<Layout user={currUser}/>}>
      <Route index element={<Home user={currUser}/>}/>
      <Route path="thread/:id" element={<Thread user={currUser}/>}/>
    </Route>)
  );

  return (
    <RouterProvider router={router}/>
  );
}

export default App;
