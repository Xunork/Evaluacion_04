import { useState, useEffect } from 'react';
import { fetchPlatos } from './services/api';
import Navbar from './components/Navbar';
import MenuPizarra from './components/MenuPizarra';
import PlatoCard from './components/PlatoCard';
import Modal from './components/Modal';
import './App.css';

function App() {
    const [menu, setMenu] = useState(() => {
        try {
            const saved = localStorage.getItem('cocina_chilena_menu');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            return [];
        }
    });

    const [catalogo, setCatalogo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [modal, setModal] = useState({ 
        isOpen: false, 
        type: 'alert', 
        title: '', 
        message: '', 
        inputValue: '', 
        action: null 
    });

    const cargarCatalogo = () => {
        setLoading(true);
        setError(null);
        fetchPlatos()
            .then(data => {
                const platosHidratados = (data.meals || []).map(plato => ({
                    ...plato,
                    precio: 0,
                    disponible: true
                }));
                setCatalogo(platosHidratados);
            })
            .catch(err => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        cargarCatalogo();
    }, []);

    useEffect(() => {
        localStorage.setItem('cocina_chilena_menu', JSON.stringify(menu));
    }, [menu]);

    const openAlert = (title, message) => {
        setModal({ isOpen: true, type: 'alert', title, message, inputValue: '', action: null });
    };

    const openPrompt = (title, message, defaultValue, action) => {
        setModal({ isOpen: true, type: 'prompt', title, message, inputValue: defaultValue || '', action });
    };

    const openConfirm = (title, message, action) => {
        setModal({ isOpen: true, type: 'confirm', title, message, inputValue: '', action });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleModalConfirm = () => {
        if (modal.action) {
            modal.action(modal.inputValue);
        }
        closeModal();
    };

    const agregarAlMenu = (plato) => {
        if (menu.some(item => item.idMeal === plato.idMeal)) {
            openAlert("Aviso", "Este plato ya se encuentra en el menú.");
            return;
        }

        openPrompt("Añadir al Menú", `Asigne un precio para: ${plato.strMeal}`, "", (inputPrecio) => {
            const precioConvertido = Number(inputPrecio);
            if (Number.isNaN(precioConvertido) || precioConvertido < 0 || inputPrecio.trim() === "") {
                openAlert("Error de Validación", "El precio ingresado es inválido. Debe ser un número mayor o igual a cero.");
                return;
            }
            const nuevoPlato = { ...plato, precio: precioConvertido };
            setMenu(prevMenu => [...prevMenu, nuevoPlato]);
        });
    };

    const editarPrecio = (idMeal) => {
        const plato = menu.find(p => p.idMeal === idMeal);
        if (!plato) return;

        openPrompt("Actualizar Precio", `Nuevo precio para: ${plato.strMeal}`, plato.precio, (inputPrecio) => {
            const precioConvertido = Number(inputPrecio);
            if (Number.isNaN(precioConvertido) || precioConvertido < 0 || String(inputPrecio).trim() === "") {
                openAlert("Error de Validación", "El precio ingresado es inválido. Debe ser un número mayor o igual a cero.");
                return;
            }
            setMenu(prevMenu => prevMenu.map(p => p.idMeal === idMeal ? { ...p, precio: precioConvertido } : p));
        });
    };

    const toggleDisponibilidad = (idMeal) => {
        setMenu(prevMenu => prevMenu.map(p => p.idMeal === idMeal ? { ...p, disponible: !p.disponible } : p));
    };

    const eliminarPlato = (idMeal) => {
        const plato = menu.find(p => p.idMeal === idMeal);
        openConfirm("Eliminar Plato", `¿Estás seguro de que deseas eliminar "${plato?.strMeal}" del menú?`, () => {
            setMenu(prevMenu => prevMenu.filter(p => p.idMeal !== idMeal));
        });
    };

    return (
        <div className="app-container">
            <Navbar />
            
            <header className="hero-section">
                <div className="hero-content">
                    <h2>Administración Culinaria</h2>
                    <p>Gestiona los platos típicos chilenos y diseña un menú extraordinario en tiempo real.</p>
                </div>
            </header>

            <main>
                <section className="section-catalogo">
                    <div className="section-header">
                        <h3>Explorar Catálogo</h3>
                        <p className="subtitle">Selecciona los platos que deseas ofrecer en tu restaurante.</p>
                    </div>

                    {loading && (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Cargando exquisiteces...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <span className="error-icon">⚠️</span>
                            <h4>Fallo de conexión</h4>
                            <p>{error}</p>
                            <button className="btn-reintentar" onClick={cargarCatalogo}>Intentar nuevamente</button>
                        </div>
                    )}

                    {!loading && !error && (
                         <div className="catalogo-wrapper">
                             <div className="catalogo-container">
                                 {catalogo.map(plato => (
                                     <div key={plato.idMeal} className="catalogo-item">
                                         <div className="catalogo-img-box">
                                            <img src={plato.strMealThumb} alt={plato.strMeal} />
                                         </div>
                                         <div className="catalogo-info">
                                            <p>{plato.strMeal}</p>
                                            <button onClick={() => agregarAlMenu(plato)}>+ Añadir al Menú</button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    )}
                </section>
                
                <section className="section-menu">
                    <div className="section-header center">
                        <h3>Tu Menú Pizarra</h3>
                        <p className="subtitle">Platos activos y listos para servir.</p>
                    </div>

                    {menu.length === 0 ? (
                        <div className="empty-menu">
                            <div className="empty-icon">🍽️</div>
                            <p>Aún no has agregado ningún plato a tu menú.</p>
                            <span>Explora el catálogo y añade tus favoritos.</span>
                        </div>
                    ) : (
                        <MenuPizarra>
                            {menu.map(plato => (
                                <PlatoCard 
                                    key={plato.idMeal} 
                                    plato={plato} 
                                    onEdit={() => editarPrecio(plato.idMeal)} 
                                    onDelete={() => eliminarPlato(plato.idMeal)} 
                                    onToggleAvailability={() => toggleDisponibilidad(plato.idMeal)}
                                />
                            ))}
                        </MenuPizarra>
                    )}
                </section>
            </main>

            <Modal 
                isOpen={modal.isOpen}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                inputValue={modal.inputValue}
                setInputValue={(val) => setModal(prev => ({ ...prev, inputValue: val }))}
                onConfirm={handleModalConfirm}
                onCancel={closeModal}
            />
        </div>
    );
}

export default App;
