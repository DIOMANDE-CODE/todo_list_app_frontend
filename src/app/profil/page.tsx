"use client";

import Image from "next/image";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import api from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import Preloader from "../components/preloader/preloader";

export default function Profil() {
  interface Compte {
    id?: number;
    account_email?: string;
    account_name?: string;
    account_image?: string | File;
  }

  const [compte, setCompte] = useState<Compte>({});
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [showPreloader, setShowPreloader] = useState(true)

  // Fonction pour charger les données de l"utilisateur
  const getCompte = async () => {
    setSuccessMessage("");
    try {
      const response = await api.get("api/users/info/");
      const data = response.data;
      setCompte(data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;
      if (status === 400) {
        console.log(axiosError);
      }
    } finally {
      setShowPreloader(false);
    }
  };

  const updateProfil = async (e: React.FormEvent) => {
    setShowPreloader(true)
    e.preventDefault();
    const formData = new FormData();
    if (compte.account_email && compte.account_name) {
      formData.append("account_email", compte.account_email);
      formData.append("account_name", compte.account_name);
      if (compte.account_image instanceof File) {
        formData.append("account_image", compte.account_image);
      }
    }
    console.log(formData);

    try {
      const response = await api.put(`api/users/info/`, formData);

      if (response.data) {
        await getCompte();
        setSuccessMessage("Mise à jour effectuée avec succès");
        setShowPreloader(false)
      }
    } catch (err: unknown) {
      setShowPreloader(false)
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;
      if (status === 400) {
        console.log(axiosError);
      }
    }
  };

  const imagePreviewUrl =
    compte.account_image instanceof File
      ? URL.createObjectURL(compte.account_image)
      : compte.account_image
      ? `${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${compte.account_image}`
      : "/assets/img/profil/image_profil.png";

  useEffect(() => {
    const access = getAccessToken();
    if (!access) {
      router.push("/connexion");
    } else {
      getCompte();
    }
  }, []);
  return (
    <div className="d-flex">
      {showPreloader && <Preloader></Preloader>}
      <Sidebar></Sidebar>
      <main className="main-content p-4">
        <header className="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom">
          <h1 className="h2 mx-auto">Mon Profil</h1>
        </header>
        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h5>Informations du profil</h5>
              </div>
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <Image
                        width={5000}
                        height={5000}
                        style={{ width: 200, height: 200, objectFit: "cover" }}
                        src={imagePreviewUrl}
                        // src="/assets/img/profil/image_profil.png"
                        className="img-fluid rounded-circle mb-3"
                        alt="Avatar"
                        priority
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label
                          htmlFor="profileFullName"
                          className="form-label"
                          style={{ color: "green" }}
                        >
                          {successMessage}
                        </label>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="profileFullName" className="form-label">
                          Votre nom
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="profileFullName"
                          value={compte?.account_name || ""}
                          onChange={(e) =>
                            setCompte({
                              ...compte,
                              account_name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="profileEmail" className="form-label">
                          Votre adresse email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="profileEmail"
                          value={compte?.account_email || ""}
                          readOnly
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="profileEmail" className="form-label">
                          changer votre photo de profil
                        </label>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setCompte({
                                ...compte,
                                account_image: e.target.files[0],
                              });
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* <h5 className="mt-4">Changer le mot de passe</h5> */}
                  {/* <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                        />
                      </div>
                    </div>
                  </div> */}
                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    onClick={updateProfil}
                  >
                    Enregistrer les modifications
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
