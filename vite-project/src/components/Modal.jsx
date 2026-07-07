export default function Modal({ isOpen, type, title, message, inputValue, setInputValue, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="modal-body">
                    {message && <p>{message}</p>}
                    {type === 'prompt' && (
                        <input 
                            type="number" 
                            className="modal-input"
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            placeholder="Ingrese el precio..."
                            autoFocus
                        />
                    )}
                </div>
                <div className="modal-actions">
                    {type !== 'alert' && (
                        <button className="btn-modal-cancelar" onClick={onCancel}>Cancelar</button>
                    )}
                    <button className="btn-modal-confirmar" onClick={onConfirm}>Aceptar</button>
                </div>
            </div>
        </div>
    );
}
