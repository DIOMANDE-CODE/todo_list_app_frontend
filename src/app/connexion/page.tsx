"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";
import { AxiosError } from "axios";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface ErrorResponse {
  error: string;
}

export default function Connexion() {
  const [account_email, setAccount_email] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/users/login/`,
        {
          account_email: account_email,
          password: password,
        }
      );

      if (res.data) {
        setTokens(res.data.access_token, res.data.refresh_token);
        router.push("/");
        setAccount_email("");
        setPassword("");
        setErreur("");
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ErrorResponse>;
      const status = axiosError.response?.status;
      const errorData = axiosError.response?.data;
      if (status === 401) {
        console.log("erreur 401 ", errorData);
        setErreur(errorData?.error || "");
      } else {
        console.log("Erreur de connexion :", axiosError);
        setErreur("Erreur de connexion");
        setAccount_email("");
        setPassword("");
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
                  <p className="text-muted">
                    Connectez-vous pour accéder à votre espace.
                  </p>
                </div>
                <form onSubmit={handleLogin}>
                  {erreur ? (
                    <div className="alert alert-danger" role="alert">
                      {erreur}
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
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Mot de passe {""}
                      <span onClick = {() => setShowPassword(!showPassword)} style={{cursor:"pointer"}} >
                        {showPassword ? <Eye size={16}/>  : <EyeOff size={16} />}
                      </span>
                    </label>
                    <input
                      type={showPassword ? "text":"password"}
                      className="form-control form-control-lg"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <a href="#" className="small">
                      Mot de passe oublié ?
                    </a>
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Se connecter
                    </button>
                  </div>
                </form>
                <p className="text-center mt-4 small">
                  Pas encore de compte ?{" "}
                  <Link href="/inscription">Inscrivez-vous</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
