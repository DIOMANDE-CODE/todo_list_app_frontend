"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "@/lib/api";
import { clearTokens } from "@/lib/auth";

export default function Sidebar() {
  interface Compte {
    id?: number;
    account_name?: string;
    account_image?: string | File;
  }

  const [compte, setCompte] = useState<Compte>({});
  const router = useRouter();

  const getCompte = async () => {
    try {
      const response = await api.get("api/users/info/")
      const data = response.data;
      console.log(data);
      
      localStorage.setItem("email_connecté",data.account_email)
      setCompte(data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      const status = axiosError.response?.status;
      if (status === 400) {
        console.log(axiosError);
      }
    }
  };

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh){
        await api.post("api/users/logout/",{
          refresh:refresh
        })
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      clearTokens();
      router.push("/connexion");
    }
  }

  useEffect(() => {
    getCompte();
  },[]);

  const previewImage =
    compte.account_image instanceof File
      ? URL.createObjectURL(compte.account_image)
      : compte.account_image
      ? `${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${compte.account_image}`
      : "/assets/img/profil/image_profil.png";

  return (
    <>
      <nav className="sidebar bg-dark d-flex flex-column p-3">
        <h4 className="text-white mb-4">
          <i className="bi bi-check2-square me-2" />
          To Do App
        </h4>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link href="/" className="nav-link active" aria-current="page">
              <i className="bi bi-speedometer2 me-2" /> Tâches
            </Link>
          </li>
        </ul>
        <hr className="text-white" />
        <div className="dropdown">
          <Link
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Image
              src={previewImage}
              alt="Image 1"
              width={32}
              height={32}
              className="rounded-circle me-2"
            />
            <strong>{compte.account_name}</strong>
          </Link>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <Link className="dropdown-item" href="/profil">
                Profil
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" onClick={handleLogout} href="#">
                Déconnexion
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
