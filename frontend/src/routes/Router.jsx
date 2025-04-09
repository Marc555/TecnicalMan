import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../page/LoginForm";
import HomePage from "../page/HomePage";
import PrivateRoute from "./PrivateRoute";

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
            </Routes>
        </Router>
    );
};

export default AppRouter;