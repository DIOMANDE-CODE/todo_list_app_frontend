export default function Header() {
  return (
    <>
      <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
        <h1 className="h2">Mes tâches</h1>
        <div className="d-flex align-items-center">
          <div className="input-group me-3">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control bg-light border-0"
              placeholder="Rechercher une tâche..."
            />
          </div>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addTaskModal"
          >
            <i className="bi bi-plus-lg me-1" /> Ajouter une Tâche
          </button>
        </div>
      </header>
    </>
  );
}
