import { AxiosError } from "axios";
import React from "react";
import { useState } from "react";
import api from "@/lib/api";
import Preloader from "../preloader/preloader";

// liste des status
const statuts = [
  { label: "A faire", value: "à faire" },
  { label: "En Cours", value: "en cours" },
  { label: "Terminé", value: "termine" },
];

export default function AjoutTache({ onRefresh }: { onRefresh: () => void }) {
  const [nomTache, setNomTache] = useState("");
  const [descriptionTache, setDescriptionTache] = useState("");
  const [statusTache, setStatusTache] = useState("à faire");
  const [echeanceTache, setEcheanceTache] = useState("");
  const timeMessageErreur = "échéance depassée";
  const [successMessage, setSuccessMessage] = useState("");
  const [showPreloader,setShowPreloader] = useState(false)

  // Fonction de creation d'une tache
  const addTask = async (e: React.FormEvent) => {
    setShowPreloader(true)
    setSuccessMessage("");
    setStatusTache(statusTache)

    e.preventDefault();
    try {
      const response = await api.post(
        "tache/create/",
        {
          nom_tache: nomTache,
          description_tache: descriptionTache,
          status_tache: statusTache,
          echeance_tache: new Date(echeanceTache).toISOString().slice(0, 10),
        },
      );
      if (response.status === 201) {
        const data = response.data;
        console.log(data);
        setNomTache("");
        setDescriptionTache("");
        setStatusTache("");
        setEcheanceTache("");
        setSuccessMessage("Nouvelle tâche ajoutée");
        setShowPreloader(false)
      }
    } catch (err: unknown) {
      setShowPreloader(false)
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;
      console.log(statusTache);

      if (status === 400) {
        console.log("erreur 400:", axiosError);
      } else {
        console.log(axiosError);
      }
      setNomTache("");
      setDescriptionTache("");
      setStatusTache("");
      setEcheanceTache("");
    }
  };

  // Fonction pour fermer le modal
  const closeModal = async () => {
    setSuccessMessage("");
    onRefresh();
    console.log(onRefresh);
    
  };

  // Fonction pour verifier la date d'écheance
  const normaliserDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  return (
    <>
      {
        showPreloader && <Preloader></Preloader>
      }
      <form onSubmit={addTask}>
        <div
          className="modal fade"
          id="addTaskModal"
          tabIndex={-1}
          aria-labelledby="addTaskModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addTaskModalLabel">
                  Ajouter une nouvelle tâche
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={closeModal}
                />
              </div>
              <div className="modal-body">
                {successMessage && (
                  <div className="mb-3">
                    <b>
                      <label
                        htmlFor="taskTitle"
                        className="form-label"
                        style={{ color: "green" }}
                      >
                        {successMessage}
                      </label>
                    </b>
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="taskTitle" className="form-label">
                    Nom de la tâche
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="taskTitle"
                    placeholder="Ex: Finaliser le rapport trimestriel"
                    value={nomTache}
                    onChange={(e) => setNomTache(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="taskDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="taskDescription"
                    rows={3}
                    defaultValue={descriptionTache}
                    onChange={(e) => setDescriptionTache(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Statut</label>
                  <select
                    className="form-select"
                    value={statusTache}
                    onChange={(e) => setStatusTache(e.target.value)}
                  >
                    {statuts.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small">Échéance</label>
                  <input
                    type="date"
                    className="form-control"
                    value={echeanceTache}
                    onChange={(e) => setEcheanceTache(e.target.value)}
                    required
                  />
                </div>
                {normaliserDate(new Date()) >
                  normaliserDate(new Date(echeanceTache)) && (
                  <div style={{ fontSize: "12px", color: "red" }}>
                    {timeMessageErreur}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  aria-labelledby="addTaskModalLabel"
                >
                  Créer la Tâche
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
