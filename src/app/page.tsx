"use client";

import Sidebar from "./components/sidebar";
import Header from "./components/header";
import TacheAFaire from "./components/taches/tache_a_faire";
import TacheEnCours from "./components/taches/tache_en_cours";
import TacheTermine from "./components/taches/tache_termine";

import DetailTache from "./components/modals/detail_tache";
import AjoutTache from "./components/modals/ajout_tache";
import { useState } from "react";

export default function Home() {
  const [selectedTaskID, setSelectedTaskID] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh((prev) => !prev);
  return (
    <>
      <div className="d-flex">
        <Sidebar></Sidebar>
        <main className="main-content p-4">
          <Header></Header>
          <div className="row">
            <TacheAFaire
              onSelectedTache={setSelectedTaskID}
              refresh={refresh}
            ></TacheAFaire>
            <TacheEnCours
              onSelectedTache={setSelectedTaskID}
              refresh={refresh}
            ></TacheEnCours>
            <TacheTermine
              onSelectedTache={setSelectedTaskID}
              refresh={refresh}
            ></TacheTermine>
          </div>
        </main>
      </div>
      <DetailTache
        tacheID={selectedTaskID}
        onClose={() => setSelectedTaskID(null)}
        onRefresh={triggerRefresh}
      ></DetailTache>
      <AjoutTache onRefresh={triggerRefresh}></AjoutTache>
    </>
  );
}
