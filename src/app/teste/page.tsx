"use client";

import { useEffect, useState } from "react";

interface Repo {
   name: string;
  description: string;
  topics: string[];
}

export default function Teste() {

  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    async function fetchRepos() {
      const response = await fetch("https://api.github.com/users/lucasanes/repos");
      const data = await response.json();
      setRepos(data.filter((repo: Repo) => repo.topics.length > 0));
    }

    fetchRepos();
  }, []);

  function signOut() {
    localStorage.removeItem("token");
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <button onClick={signOut}>
          Sair da conta
        </button>  

        {
          repos.map((repo, i) => (
            <div key={i}>
              <h2>{repo.name}</h2>
              <p>{repo.description}</p>
            </div>
          ))
        }


      </main>
    </div>
  )
}
