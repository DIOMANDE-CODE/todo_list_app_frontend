"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const getCompte = async () => {
    try {
      const response = await api.get("api/users/info/");
      setCompte(response.data);
    } catch (err: unknown) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 400) console.log(axiosError);
    }
  };

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    try {
      const refresh = localStorage.getItem("refresh");
      if (refresh) await api.post("api/users/logout/", { refresh });
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    } finally {
      clearTokens();
      router.push("/connexion");
    }
  }

  // Fermer le menu hamburger lorsqu'on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileOpen]);

  useEffect(() => {
    getCompte();
  }, []);

  const previewImage =
    compte.account_image instanceof File
      ? URL.createObjectURL(compte.account_image)
      : compte.account_image
      ? `${process.env.NEXT_PUBLIC_BACKEND_PHOTO_PROFIL_URL}${compte.account_image}`
      : "/assets/img/profil/image_profil.png";

  return (
    <>
      {/* Bouton hamburger mobile */}
      <button
        className="d-md-none btn btn-dark position-fixed top-0 start-0 m-2 z-3"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <i className="bi bi-list"></i>
      </button>

      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`sidebar bg-dark d-flex flex-column p-3 position-fixed h-100 transition`}
        style={{
          width: "250px",
          zIndex: 1020,
          left: mobileOpen ? "0" : "-260px",
        }}
      >
        <h4 className="text-white mb-4 d-flex align-items-center">
          <i className="bi bi-check2-square me-2" />
          To Do App
        </h4>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link href="/" className="nav-link active" aria-current="page">
              <i className="bi bi-speedometer2 me-2" /> Tâches
            </Link>
          </li>
          {/* autres liens ici */}
        </ul>
        <hr className="text-white" />
        <div className="dropdown mt-auto">
          <Link
            href="#"
            className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <Image
              src={previewImage}
              alt="Profil"
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

      <style jsx>{`
        .transition {
          transition: left 0.3s ease-in-out;
        }
        @media (min-width: 768px) {
          .sidebar {
            left: 0 !important; /* Toujours visible sur PC */
          }
        }
      `}</style>
    </>
  );
}
