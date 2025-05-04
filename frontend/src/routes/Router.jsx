import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../page/LoginForm";
import HomePage from "../page/HomePage";
import PrivateRoute from "./PrivateRoute";
import ClienteList from "../page/clientes/ClienteList";
import ClienteDetail from "../page/clientes/ClienteDetail";
import ClienteCreate from "../page/clientes/ClienteCreate";
import ClienteEdit from "../page/clientes/ClienteEdit";

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
                {/* Lista del cliente */}
                <Route
                    path="/clientes"
                    element={
                        <PrivateRoute>
                            <ClienteList />
                        </PrivateRoute>
                    }
                />
                {/* Detalle del cliente */}
                <Route
                    path="/clientes/:id"
                    element={
                        <PrivateRoute>
                            <ClienteDetail />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clientes/nuevo"
                    element={
                        <PrivateRoute>
                            <ClienteCreate />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/clientes/editar/:id"
                    element={
                        <PrivateRoute>
                            <ClienteEdit />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;