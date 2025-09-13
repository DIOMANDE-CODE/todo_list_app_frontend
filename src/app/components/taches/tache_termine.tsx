import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import api from "@/lib/api";

export default function TacheTermine({
  onSelectedTache,
  refresh,
}: {
  onSelectedTache: (id: number) => void;
  refresh: boolean;
}) {
  interface Sous_Tache {
    id: number;
    nom_sous_tache: string;
    is_completed: boolean;
  }

  interface Collaborateur {
    id: number;
    account_image: string;
  }

  interface Tache {
    id: number;
    nom_tache: string;
    description_tache: string;
    priorite_tache: string;
    echeance_tache: string;
    status_tache: string;
    taches: Sous_Tache[];
    collaborateurs: Collaborateur[];
  }

  const [tasks, setTasks] = useState<Tache[]>([]);
  const router = useRouter();

  useEffect(() => {
    const access = getAccessToken();
    if (!access) {
      router.push("/connexion");
    } else {
      const listTasks = async () => {
        try {
          const response = await api.get("tache/list")
          const data = response.data;
          if (data) {
            const tache_ended = data.filter(
              (tache: Tache) => tache.status_tache === "termine"
            );
            setTasks(tache_ended);
          }
        } catch (err) {
          console.error("Erreur de récupération des tâches :", err);
        }
      };

      listTasks();
    }
  }, [refresh]);
  return (
    <>
      <div className="col-md-4">
        <div className="kanban-column p-3 rounded-3">
          <h5 className="mb-3">
            <i className="bi bi-check-circle-fill me-2" />
            Terminé{" "}
            <span className="badge bg-secondary ms-1">{tasks.length}</span>
          </h5>
          {tasks.length !== 0 ? (
            tasks.slice().sort((a,b) => new Date(a.echeance_tache).getTime() - new Date(b.echeance_tache).getTime()).map((tache, index) => (
              <div
                className="task-card card mb-3"
                data-bs-toggle="modal"
                data-bs-target="#taskDetailModal"
                key={`${tache.id}-${index}`}
                onClick={() => onSelectedTache(tache.id)}
              >
                <div className="card-body opacity-75">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 className="card-title text-decoration-line-through">
                      {tache.nom_tache}
                    </h6>
                    {tache.priorite_tache === "Basse" && (
                      <span className="badge bg-success text-white">
                        {tache.priorite_tache}
                      </span>
                    )}
                    {tache.priorite_tache === "Moyenne" && (
                      <span className="badge bg-warning text-dark">
                        {tache.priorite_tache}
                      </span>
                    )}
                    {tache.priorite_tache === "Haute" && (
                      <span className="badge bg-danger text-white">
                        {tache.priorite_tache}
                      </span>
                    )}
                  </div>
                  <span className="badge bg-secondary text-white">Modifier</span>
                  <p className="card-text small text-muted">
                    {tache.description_tache}
                  </p>
                  <div className="progress mt-2" style={{ height: 8 }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{
                        width:
                          (tache.taches.filter(
                            (sub_task) => sub_task.is_completed === true
                          ).length *
                            100) /
                            tache.taches.length +
                          "%",
                      }}
                      aria-valuenow={
                        tache.taches.filter(
                          (sub_task) => sub_task.is_completed === true
                        ).length
                      }
                      aria-valuemin={0}
                      aria-valuemax={
                        tache.taches.filter(
                          (sub_task) => sub_task.is_completed === true
                        ).length
                      }
                    />
                  </div>
                  {tache.taches.length !== 0 && (
                    <span className="small text-muted d-block mt-1">
                      {
                        tache.taches.filter(
                          (sub_task) => sub_task.is_completed === true
                        ).length
                      }
                      /{tache.taches.length} sous-tâches terminées
                    </span>
                  )}
                  {tache.taches.length === 0 && (
                    <span className="small text-muted d-block mt-1">
                      Aucune sous tache
                    </span>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="task-users">
                      {tache.collaborateurs.map((collab) => (
                        <Image
                          key={collab.id}
                          width={40}
                          height={40}
                          src={`${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${collab.account_image}`}
                          className="avatar"
                          alt="Avatar utilisateur"
                        />
                      ))}
                    </div>
                    {/* {tache.echeance_tache && (
                    <span className="small text-muted">
                      <i className="bi bi-calendar-check me-1" />{" "}
                      {new Date(tache.echeance_tache).toLocaleDateString(
                        "fr-FR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  )} */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="task-card card mb-3"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <h6 className="card-title">Aucune tâche</h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
