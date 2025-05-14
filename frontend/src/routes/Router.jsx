import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../page/LoginForm";
import HomePage from "../page/HomePage";
import PrivateRoute from "./PrivateRoute";
import ClienteList from "../page/clientes/ClienteList";
import ClienteDetail from "../page/clientes/ClienteDetail";
import ClienteCreate from "../page/clientes/ClienteCreate";
import ClienteEdit from "../page/clientes/ClienteEdit";
import ForgotPasswordForm from "../components/ForgotPasswordForm.jsx";
import ResetPasswordForm from "../components/ResetPasswordForm.jsx";
import PresupuestoList from "../page/presupuesto/PresupuestoList.jsx";
import PresupuestoForm from "../page/presupuesto/PresupuestoForm.jsx";
import PresupuestoDetalle from "../page/presupuesto/PresupuestoDetalle.jsx";
import AlbaranList from "../page/albaran/AlbaranList.jsx";
import AlbaranForm from "../page/albaran/AlbaranForm.jsx";
import AlbaranDetalle from "../page/albaran/AlbaranDetalle.jsx";
import FacturaList from "../page/factura/FacturaList.jsx";
import FacturaForm from "../page/factura/FacturaForm.jsx";
import FacturaDetalle from "../page/factura/FacturaDetalle.jsx";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
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
                {/* Formulario creacion del cliente */}
                <Route
                    path="/clientes/nuevo"
                    element={
                        <PrivateRoute>
                            <ClienteCreate />
                        </PrivateRoute>
                    }
                />
                {/* Formulario edicion del cliente */}
                <Route
                    path="/clientes/editar/:id"
                    element={
                        <PrivateRoute>
                            <ClienteEdit />
                        </PrivateRoute>
                    }
                />
                {/* Lista del presupuesto */}
                <Route
                    path="/presupuestos"
                    element={
                        <PrivateRoute>
                            <PresupuestoList />
                        </PrivateRoute>
                    }
                />
                {/* Formulario creacion del presupuesto */}
                <Route
                    path="/presupuestos/nuevo"
                    element={
                        <PrivateRoute>
                            <PresupuestoForm />
                        </PrivateRoute>
                    }
                />
                {/* Formulario edicion del presupuesto */}
                <Route
                    path="/presupuestos/editar/:id"
                    element={
                        <PrivateRoute>
                            <PresupuestoForm />
                        </PrivateRoute>
                    }
                />
                {/* Detalle del cliente */}
                <Route
                    path="/presupuestos/:id"
                    element={
                        <PrivateRoute>
                            <PresupuestoDetalle />
                        </PrivateRoute>
                    }
                />
                {/* Lista del albaran */}
                <Route
                    path="/albaranes"
                    element={
                        <PrivateRoute>
                            <AlbaranList />
                        </PrivateRoute>
                    }
                />
                {/* Formulario de creacion del albaran */}
                <Route
                    path="/albaranes/nuevo"
                    element={
                        <PrivateRoute>
                            <AlbaranForm />
                        </PrivateRoute>
                    }
                />
                {/* Formulario de edicion del albaran */}
                <Route
                    path="/albaranes/editar/:id"
                    element={
                        <PrivateRoute>
                            <AlbaranForm />
                        </PrivateRoute>
                    }
                />
                {/* Detalles del albaran */}
                <Route
                    path="/albaranes/:id"
                    element={
                        <PrivateRoute>
                            <AlbaranDetalle />
                        </PrivateRoute>
                    }
                />
                {/* Lista del factura */}
                <Route
                    path="/facturas"
                    element={
                        <PrivateRoute>
                            <FacturaList />
                        </PrivateRoute>
                    }
                />
                {/* Formulario de creacion del factura */}
                <Route
                    path="/facturas/nueva"
                    element={
                        <PrivateRoute>
                            <FacturaForm />
                        </PrivateRoute>
                    }
                />
                {/* Formulario de edicion del factura */}
                <Route
                    path="/facturas/editar/:id"
                    element={
                        <PrivateRoute>
                            <FacturaForm />
                        </PrivateRoute>
                    }
                />
                {/* Detalles de factura */}
                <Route
                    path="/facturas/:id"
                    element={
                        <PrivateRoute>
                            <FacturaDetalle />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default AppRouter;