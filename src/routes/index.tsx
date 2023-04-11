import NotFoundPage from "@/pages/error/NotFoundPage";
import { useRoutes } from "react-router-dom";



const Router = () => {
    const routes = useRoutes([
        {
            path: '*',
            element: <NotFoundPage />
        }
    ]);
    return routes;
}

export default Router;