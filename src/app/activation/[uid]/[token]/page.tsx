"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function Connexion() {
  const [messageErreur, setMessageErreur] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const params = useParams();
  const { uid, token } = params;

  const activerCompte = async () => {
    try {
      const response = await api.get(`api/users/activation/${uid}/${token}/`);

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
      }

      if (response.status === 400) {
        setMessageErreur(response.data.error);
      }
    } catch (err) {
      const erreurAxios = err as AxiosError;
      const status = erreurAxios.response?.status;

      if (status === 400){
        setMessageErreur("Token Invalid")
      }
      console.log(erreurAxios);
    }
  };

  useEffect(() => {
    activerCompte();
  }, []);

  return (
    <div className="auth-body">
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-5 col-lg-6">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="h1 fw-bold">
                    <i className="bi bi-check2-square text-primary" /> To Do App
                  </h2>
                  {successMessage && (
                    <p className="text-success">{successMessage}</p>
                  )}
                  {messageErreur && (
                    <p className="text-danger">{messageErreur}</p>
                  )}
                </div>
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
