import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import Preloader from "../preloader/preloader";

export default function DetailTache({
  tacheID,
  onClose,
  onRefresh,
}: {
  tacheID: number | null;
  onClose: () => void;
  onRefresh: () => void;
}) {
  interface Sous_Tache {
    id: number;
    nom_sous_tache: string;
    is_completed: boolean;
    account_email: string;
  }

  interface Proprietaire {
    account_name: string;
    account_image: string;
    account_email: string;
  }

  interface Collaborateur {
    id: number;
    account_image: string;
    account_name: string;
    account_email: string;
  }

  interface Tache {
    id: number;
    nom_tache: string;
    description_tache: string;
    echeance_tache: string;
    status_tache: string;
    taches: Sous_Tache[];
    collaborateurs: Collaborateur[];
    proprietaire: Proprietaire;
  }

  // Declaration des variables pour les informations des taches

  const [detailTask, setDetailTask] = useState<Tache | null>(null);
  const [nom_sous_tache, setNomSousTache] = useState("");
  const [emailCollaborateur, setEmailCollaborateur] = useState("");
  const [messageErreur, setMessageErreur] = useState("");
  const [emailConnecte, setEmailConnecte] = useState<string | null>(null);
  const timeMessageErreur = "delai dépassé";
  const [showPreloader, setShowPreloader] = useState(false);
  const router = useRouter();

  const getTask = async () => {
    router.push(`?${tacheID}`, { scroll: false });
    try {
      const response = await api.get(`tache/detail/${tacheID}/`);

      if (response.status === 200) {
        const data = response.data;
        setDetailTask(data);
        console.log(data);
      }
    } catch (err) {
      console.log("erreur", err);
    }
  };

  // Fonction pour ajouter une sous tache
  const addSubTask = async () => {
    try {
      const response = await api.post(`tache/${tacheID}/sous_tache/create/`, {
        nom_sous_tache,
      });
      if (response.status === 201) {
        setNomSousTache(""); // vider l'input après ajout
        await getTask(); // rafraîchir les données
      }
    } catch (err) {
      console.log("erreur", err);
    }
  };

  // Fonction pour modifier une sous Tache
  const updateSubTask = async (sousTacheID: number, isChecked: boolean) => {
    console.log(sousTacheID, isChecked);

    try {
      const response = await api.put(
        `tache/${sousTacheID}/sous_tache/detail/`,
        {
          is_completed: isChecked,
        }
      );

      if (response.status === 200) {
        await getTask(); // rafraîchir les données
      }
    } catch (err) {
      console.log("erreur", err);
    }
  };

  // // Fonction pour renitialiser tacheID
  const renitializeTacheID = () => {
    onClose(); // appel de la fonction parent
    router.push("/", { scroll: false });
  };

  // Fonction pour ajouter un collaborateur
  const addCollaborateur = async () => {
    try {
      const response = await api.post(`tache/${tacheID}/ajout/collaborateur/`, {
        emailCollaborateur,
      });
      if (response.status === 201) {
        setEmailCollaborateur("");
        setMessageErreur("");

        await getTask();
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError?.response?.status;
      if (status === 409) {
        setMessageErreur("collaborateur deja existant");
        setEmailCollaborateur("");
      }
      if (status === 422) {
        setMessageErreur("vous ne pouvez pas vous ajouter vous-même");
        setEmailCollaborateur("");
      }
      if (status === 404) {
        setMessageErreur("compte inexistant");
        setEmailCollaborateur("");
      }
    }
  };

  // Fonction pour supprimer un collaborateur
  const deleteCollaborateur = async (account_email: string) => {
    try {
      const response = await api.delete(
        `tache/${tacheID}/suppression/collaborateur/${account_email}/`
      );
      console.log(response.data);
      setMessageErreur("");
      await getTask();
    } catch (err) {
      console.log("erreur suppression utilisateur", err);
    }
  };

  // Fonction pour mettre à jour la tache selectionnée
  const updateTask = async () => {
    setShowPreloader(true);
    try {
      const response = await api.put(`tache/detail/${tacheID}/`, {
        nom_tache: detailTask?.nom_tache,
        description_tache: detailTask?.description_tache,
        status_tache: detailTask?.status_tache,
        echeance_tache: detailTask?.echeance_tache,
        collaborateurs: detailTask?.collaborateurs,
      });
      console.log(response.data);
      onRefresh();
      renitializeTacheID();
      setShowPreloader(false);
    } catch (err) {
      console.log(err);
    }
  };

  // Fonction pour supprimer la tache selectionnée
  const deleteTask = async () => {
    setShowPreloader(true);
    try {
      const response = await api.delete(`tache/detail/${tacheID}/`);
      if (response.status === 204 || response.status === 200) {
        window.location.href = "/";
        // setShowPreloader(false)
      }
    } catch (err) {
      console.log("Erreur suppression tâche", err);
      setShowPreloader(false);
    }
  };

  // Function pour normaliser les dates
  const normaliserDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  useEffect(() => {
    const access = getAccessToken();
    setEmailConnecte(localStorage.getItem("email_connecté"));
    if (tacheID === null) {
      return;
    }
    if (!access) {
      router.push("/connexion");
    } else {
      getTask();
    }
  }, [tacheID]);

  return (
    <>
      {showPreloader && <Preloader></Preloader>}
      <div
        className="modal fade"
        id="taskDetailModal"
        tabIndex={-1}
        aria-labelledby="taskDetailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="taskDetailModalLabel">
                Détails de la Tâche
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={updateTask}
              />
            </div>
            {detailTask && (
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <b>
                      <label className="form-label small">
                        Nom de la tâche
                      </label>
                    </b>
                    <h5>{detailTask.nom_tache}</h5>
                    {detailTask.description_tache && (
                      <b>
                        <label className="form-label small">
                          Description de la tâche
                        </label>
                      </b>
                    )}

                    <h6 className="text-muted">
                      {detailTask.description_tache}
                    </h6>
                    <b>
                      <h6 className="mt-4" style={{ fontWeight: "bold" }}>
                        Sous-tâches (
                        {
                          detailTask.taches.filter(
                            (tache) => tache.is_completed === true
                          ).length
                        }
                        /{detailTask.taches.length})
                      </h6>
                    </b>
                    {detailTask.taches.map((tache) => (
                      <div className="sub-task-list" key={tache.id}>
                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            defaultValue=""
                            id="subtask1"
                            defaultChecked={tache.is_completed}
                            onChange={(e) =>
                              updateSubTask(tache.id, e.target.checked)
                            }
                          />
                          {tache.is_completed ? (
                            <label
                              className="form-check-label text-decoration-line-through"
                              htmlFor="subtask1"
                            >
                              {tache.nom_sous_tache}
                            </label>
                          ) : (
                            <label
                              className="form-check-label"
                              htmlFor="subtask1"
                            >
                              {tache.nom_sous_tache}
                            </label>
                          )}
                        </div>
                      </div>
                    ))}

                    <div className="input-group mt-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ajouter une nouvelle sous-tâche..."
                        value={nom_sous_tache}
                        onChange={(e) => setNomSousTache(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-success"
                        type="button"
                        onClick={addSubTask}
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label
                        className="form-label small"
                        style={{ fontWeight: "bold" }}
                      >
                        Statut
                      </label>
                      <select
                        className="form-select"
                        value={detailTask.status_tache}
                        onChange={(e) =>
                          setDetailTask({
                            ...detailTask,
                            status_tache: e.target.value,
                          })
                        }
                      >
                        <option value="à faire">À Faire</option>
                        <option value="en cours">En Cours</option>
                        <option value="termine">Terminé</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label
                        className="form-label small"
                        style={{ fontWeight: "bold" }}
                      >
                        Échéance
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        defaultValue={detailTask.echeance_tache}
                        onChange={(e) =>
                          setDetailTask({
                            ...detailTask,
                            echeance_tache: e.target.value,
                          })
                        }
                      />
                    </div>
                    {normaliserDate(new Date()) >
                      normaliserDate(new Date(detailTask.echeance_tache)) && (
                      <div style={{ fontSize: "10px", color: "red" }}>
                        {timeMessageErreur}
                      </div>
                    )}
                    <h6 className="mt-4" style={{ fontWeight: "bold" }}>
                      Tâche crée par :
                    </h6>
                    <div className="assigned-users">
                      <div className="d-flex align-items-center mb-2">
                        <Image
                          width={5000}
                          height={5000}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${detailTask.proprietaire.account_image}`}
                          className="avatar me-2"
                          alt="Image"
                        />
                        <span>{detailTask.proprietaire.account_name}</span>
                      </div>
                    </div>
                    <h6 className="mt-4" style={{ fontWeight: "bold" }}>
                      Utilisateurs Assignés
                    </h6>
                    <div className="assigned-users">
                      {localStorage.getItem("email_connecté") !==
                      detailTask.proprietaire.account_email
                        ? detailTask.collaborateurs.map((collab) => (
                            <div
                              className="d-flex align-items-center mb-2"
                              key={collab.id}
                            >
                              <Image
                                width={5000}
                                height={5000}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${collab.account_image}`}
                                className="avatar me-2"
                                alt="Image"
                              />

                              {collab.account_name && (
                                <span>{collab.account_name}</span>
                              )}
                            </div>
                          ))
                        : detailTask.collaborateurs.map((collab) => (
                            <div
                              className="d-flex align-items-center mb-2"
                              key={collab.id}
                            >
                              <Image
                                width={5000}
                                height={5000}
                                src={`${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${collab.account_image}`}
                                className="avatar me-2"
                                alt="Image"
                              />

                              {collab.account_name && (
                                <span>{collab.account_name}</span>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger ms-auto"
                                onClick={() =>
                                  deleteCollaborateur(collab.account_email)
                                }
                              >
                                <i className="bi bi-x" />
                              </button>
                            </div>
                          ))}
                    </div>
                    {emailConnecte ===
                      detailTask.proprietaire.account_email && (
                      <div className="input-group mt-2">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email du collaborateur"
                          value={emailCollaborateur}
                          onChange={(e) => {
                            setEmailCollaborateur(e.target.value);
                          }}
                        />
                        <button
                          className="btn btn-outline-success"
                          type="button"
                          onClick={addCollaborateur}
                        >
                          <i className="bi bi-plus" />
                        </button>
                      </div>
                    )}

                    {messageErreur ? (
                      <div style={{ fontSize: "10px", color: "red" }}>
                        {messageErreur}
                      </div>
                    ) : (
                      <div style={{ fontSize: "12px" }}>
                        <b>{emailCollaborateur}</b>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            <div className="modal-footer">
              {emailConnecte === detailTask?.proprietaire.account_email ? (
                <button
                  type="button"
                  className="btn btn-danger me-auto"
                  aria-label="Close"
                  data-bs-dismiss="modal"
                  onClick={deleteTask}
                >
                  <i className="bi bi-trash" /> Supprimer
                </button>
              ) : null}

              <button
                type="button"
                aria-label="Close"
                data-bs-dismiss="modal"
                className="btn btn-primary"
                onClick={updateTask}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
