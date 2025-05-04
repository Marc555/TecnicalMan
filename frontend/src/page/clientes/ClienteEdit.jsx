import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clienteApi } from '../../axios/clienteApi';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../hooks/useAuth';

const ClienteEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleLogout } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        nif: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        provincia: '',
        pais: '',
        email: '',
        telefono: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const data = await clienteApi.getById(id);
                setFormData({
                    nombre: data.nombre || '',
                    nif: data.nif || '',
                    direccion: data.direccion || '',
                    ciudad: data.ciudad || '',
                    codigoPostal: data.codigoPostal || '',
                    provincia: data.provincia || '',
                    pais: data.pais || '',
                    email: data.email || '',
                    telefono: data.telefono || ''
                });
                setInitialLoad(false);
            } catch (err) {
                console.error('Error al cargar cliente:', err);
                setSubmitError('Error al cargar los datos del cliente');
                setInitialLoad(false);
            }
        };
        fetchCliente();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'Nombre es requerido';
        if (!formData.nif.trim()) newErrors.nif = 'NIF es requerido';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setSubmitError('');

        try {
            await clienteApi.update(id, formData);
            navigate('/clientes');
        } catch (err) {
            setSubmitError(err.message || 'Error al actualizar el cliente');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return <div className="p-4 text-gray-800">Cargando datos del cliente...</div>;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar onLogout={handleLogout} />

            <div className="container mx-auto p-4">
                <button
                    onClick={() => navigate('/clientes')}
                    className="mb-4 px-4 py-2 bg-gray-200 text-whait rounded hover:bg-gray-300 transition-colors"
                >
                    ← Volver al listado
                </button>

                <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Editar Cliente</h2>

                    {submitError && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">
                            {submitError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Columna izquierda */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                        Nombre <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-black border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                </div>

                                <div>
                                    <label htmlFor="nif" className="block text-sm font-medium text-gray-700 mb-1">
                                        NIF <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="nif"
                                        name="nif"
                                        value={formData.nif}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-black border ${errors.nif ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.nif && <p className="mt-1 text-sm text-red-600">{errors.nif}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-3 py-2 text-black border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                        Teléfono
                                    </label>
                                    <input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Columna derecha - Dirección */}
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
                                        Dirección
                                    </label>
                                    <input
                                        type="text"
                                        id="direccion"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="w-full px-3 text-black py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-1">
                                            Ciudad
                                        </label>
                                        <input
                                            type="text"
                                            id="ciudad"
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="codigoPostal" className="block text-sm font-medium text-gray-700 mb-1">
                                            Código Postal
                                        </label>
                                        <input
                                            type="text"
                                            id="codigoPostal"
                                            name="codigoPostal"
                                            value={formData.codigoPostal}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="provincia" className="block text-sm font-medium text-gray-700 mb-1">
                                        Provincia
                                    </label>
                                    <input
                                        type="text"
                                        id="provincia"
                                        name="provincia"
                                        value={formData.provincia}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="pais" className="block text-sm font-medium text-gray-700 mb-1">
                                        País
                                    </label>
                                    <input
                                        type="text"
                                        id="pais"
                                        name="pais"
                                        value={formData.pais}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-black border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Guardando...
                                    </span>
                                ) : (
                                    'Guardar Cliente'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClienteEdit;