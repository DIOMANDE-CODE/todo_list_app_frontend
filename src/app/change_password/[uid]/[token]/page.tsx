"use client";

import Link from "next/link";
import React, { useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import Preloader from "@/app/components/preloader/preloader";
import { Eye, EyeOff } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function Connexion() {
  const [erreur, setErreur] = useState("");
  const [showPreloader, setShowPreloader] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassWord, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const params = useParams();
  const { uid, token } = params;
  const router = useRouter();

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setErreur("");

    if (newPassword !== confirmPassWord) {
      setErreur("les deux mots de passe sont différents");
      return;
    }
    setShowPreloader(true);
    try {
      const response = await api.post(
        `api/code/reset-password-confirm/${uid}/${token}/`,
        {
          new_password: newPassword,
        }
      );
      if (response.status === 400) {
        console.log("Compte inexistant", response);
        setErreur("Cet utilisateur n'a pas de compte");
      }
      if (response.status === 404) {
        console.log("Token expiré", response);
        setErreur("Session expirée, veuillez reprendre la procédure");
      }
      if (response.status === 200) {
        console.log("Mot de passe modifié");
        router.push("/change_password");
      }
    } catch (err) {
      const erreurAxios = err as AxiosError;
      const status = erreurAxios.response?.status;

      if (status === 404) {
        setErreur("Cet email n'est lié à aucun compte ");
      } else {
        console.log(erreurAxios);
      }
    } finally {
      setShowPreloader(false);
    }
  };

  return (
    <div className="auth-body">
      {showPreloader && <Preloader></Preloader>}
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-5 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="h1 fw-bold">
                    <i className="bi bi-check2-square text-primary" /> To Do App
                  </h2>
                  <p className="text-muted">Créez un nouveau mot de passe</p>
                </div>
                <form onSubmit={changePassword}>
                  {erreur ? (
                    <div className="alert alert-danger" role="alert">
                      {erreur}
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Nouveau mot de passe{" "}
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <Eye size={16}></Eye>
                        ) : (
                          <EyeOff size={16}></EyeOff>
                        )}
                      </span>
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      id="email"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Confirmez le mot de passe
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      id="email"
                      value={confirmPassWord}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Changer de mot de passe
                    </button>
                  </div>
                </form>
                <p className="text-center mt-4 small">
                  Cliquez ici pour vous connecter{" "}
                  <Link href="/connexion">Connectez-vous</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
