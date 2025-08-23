"use client";

import Link from "next/link";
import React, { useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import Preloader from "@/app/components/preloader/preloader";

export default function Connexion() {
  const [account_email, setAccount_email] = useState("");
  const [erreur, setErreur] = useState("");
  const [success, setSuccess] = useState("");
  const [showPreloader,setShowPreloader] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreloader(true)
    setErreur("");
    setSuccess("");

    try {
      const response = await api.post("api/code/reset-password/", {
        account_email: account_email,
      });
      if (response.status === 404) {
        console.log("Compte inexistant", response);
        setErreur("Cet email n'est lié à aucun compte");
      }
      if (response.status === 200) {
        console.log("Consultez votre email");
        setSuccess(response.data.message);
        setAccount_email("")
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
      setShowPreloader(false)
    }
  };

  return (
    <div className="auth-body">
      {
        showPreloader && <Preloader></Preloader>
      }
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-5 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="h1 fw-bold">
                    <i className="bi bi-check2-square text-primary" /> To Do App
                  </h2>
                  <p className="text-muted">Mot de passe oublié</p>
                </div>
                <form onSubmit={handleLogin}>
                  {erreur ? (
                    <div className="alert alert-danger" role="alert">
                      {erreur}
                    </div>
                  ) : null}
                  {success ? (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  ) : null}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={account_email}
                      onChange={(e) => setAccount_email(e.target.value)}
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
                  Deja un compte ? <Link href="/connexion">Connectez-vous</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
