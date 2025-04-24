import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../page/LoginForm";
import HomePage from "../page/HomePage";
import PrivateRoute from "./PrivateRoute";
import ClienteList from "../page/ClienteList";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route
                    path="/home"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clientes"
                    element={
                        <PrivateRoute>
                            <ClienteList />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;