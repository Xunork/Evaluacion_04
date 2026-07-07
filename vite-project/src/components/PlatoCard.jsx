export default function PlatoCard({ plato, onEdit, onDelete, onToggleAvailability }) {
    return (
        <div className="plato-card">
            <div className="plato-img-container">
                <img src={plato.strMealThumb} alt={plato.strMeal} />
                <span className={`estado-badge ${plato.disponible ? 'disponible' : 'agotado'}`}>
                    {plato.disponible ? "Disponible" : "Agotado"}
                </span>
            </div>
            <div className="plato-info">
                <h3>{plato.strMeal}</h3>
                <p className="precio-texto">${plato.precio}</p>
                <div className="card-actions">
                    <button className={`btn-disponibilidad ${plato.disponible ? 'disponible' : 'agotado'}`} onClick={onToggleAvailability}>
                        {plato.disponible ? "Marcar Agotado" : "Marcar Disponible"}
                    </button>
                    <button className="btn-editar" onClick={onEdit}>Editar Precio</button>
                    <button className="btn-eliminar" onClick={onDelete}>Eliminar</button>
                </div>
            </div>
        </div>
    );
}
