"use client";

import Link from "next/link";
import { useState } from "react";
import { AxiosError } from "axios";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface ErrorResponse {
  error: string;
}

export default function Inscription() {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inscrire = async (e: React.FormEvent) => {
    setErrorMessage("");
    setSuccessMessage("");
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/register/`,
        {
          account_name: nom,
          account_email: email,
          password: code,
        }
      );

      if (response.data) {
        setSuccessMessage(response.data.message || "");
      }
      setNom("");
      setEmail("");
      setCode("");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;
      if (status === 400) {
        setErrorMessage(errorData?.error || "");
      } else if (status === 409) {
        setErrorMessage(errorData?.error || "");
      } else {
        console.log(axiosError);
      }
    }
  };
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
                  <p className="text-muted">Créez votre compte gratuitement.</p>
                </div>
                <form onSubmit={inscrire}>
                  {successMessage && (
                    <div className="mb-3">
                      <b>
                        <label
                          htmlFor="fullname"
                          className="form-label"
                          style={{ color: "green" }}
                        >
                          {successMessage}
                        </label>
                      </b>
                    </div>
                  )}
                  {errorMessage && (
                    <div className="mb-3">
                      <b>
                        <label
                          htmlFor="fullname"
                          className="form-label"
                          style={{ color: "red" }}
                        >
                          {errorMessage}
                        </label>
                      </b>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label">
                      Votre nom
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="fullname"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Mot de passe{" "}
                      <span onClick={() => setShowPassword(!showPassword)} style={{ cursor: "pointer" }}>
                        { showPassword ? <Eye size={16} /> : <EyeOff size={16} /> }
                      </span>
                    </label>
                    <input
                      type={showPassword ? "text":"password"}
                      className="form-control form-control-lg"
                      id="password"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Créer un compte
                    </button>
                  </div>
                </form>
                <p className="text-center mt-4 small">
                  Déjà un compte ? <Link href="/connexion">Connectez-vous</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
