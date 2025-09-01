"use client";

import Link from "next/link";

export default function PasswordChanged() {

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
                  <p className="text-muted">Mot de passe modifié avec succès</p>
                </div>
                <p className="text-center mt-4 small">
                  Cliquez ici pour vous connecter <Link href="/connexion">Connectez-vous</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
