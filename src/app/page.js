"use client";

import { useState } from "react";
import React from "react";

const TeamBalancer = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([
    { name: "Équipe 1", players: [] },
    { name: "Équipe 2", players: [] },
  ]);
  const [playerName, setPlayerName] = useState("");
  const [playerRating, setPlayerRating] = useState("");
  const [teamName, setTeamName] = useState("");

  const addPlayer = () => {
    if (playerName && playerRating !== "" && players.length < 20) {
      setPlayers([
        ...players,
        { name: playerName, rating: Number(playerRating) },
      ]);
      setPlayerName("");
      setPlayerRating("");
    }
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  const updatePlayer = (index, name, rating) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = { name, rating: Number(rating) };
    setPlayers(updatedPlayers);
  };

  const addTeam = () => {
    if (teamName && teams.length < 10) {
      setTeams([...teams, { name: teamName, players: [] }]);
      setTeamName("");
    }
  };

  const removeTeam = (index) => {
    setTeams(teams.filter((_, i) => i !== index));
  };

  const resetAll = () => {
    setPlayers([]); // Supprime tous les joueurs
    setTeams([
      { name: "Équipe 1", players: [] },
      { name: "Équipe 2", players: [] },
    ]); // Réinitialise les équipes par défaut
  };

  const updateTeamName = (index, name) => {
    const updatedTeams = [...teams];
    updatedTeams[index].name = name;
    setTeams(updatedTeams);
  };

  const balanceTeams = () => {
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating); // Trier les joueurs du plus fort au plus faible
    const teamCount = teams.length;

    // Initialisation des équipes avec des joueurs vides et un total de score
    const balancedTeams = Array.from({ length: teamCount }, () => ({
      players: [],
      totalRating: 0,
    }));

    sortedPlayers.forEach((player) => {
      // Trier les équipes par totalRating croissant puis par nombre de joueurs croissant
      balancedTeams.sort((a, b) =>
        a.totalRating === b.totalRating
          ? a.players.length - b.players.length
          : a.totalRating - b.totalRating
      );

      // Ajouter le joueur à l'équipe la plus faible
      balancedTeams[0].players.push(player);
      balancedTeams[0].totalRating += player.rating;
    });

    // Mettre à jour l'état des équipes
    setTeams(
      teams.map((team, index) => ({
        name: team.name,
        players: balancedTeams[index]?.players || [],
      }))
    );
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Team Balancer</h2>
      <div className="flex gap-4 m-8">
        <button
          onClick={resetAll}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md w-full"
        >
          Réinitialiser
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Nom du joueur"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="border p-2 rounded-md bg-gray-700 text-white w-1/2"
          />
          <input
            type="number"
            placeholder="Note (0-20)"
            value={playerRating}
            onChange={(e) => setPlayerRating(e.target.value)}
            min="0"
            max="20"
            className="border p-2 rounded-md bg-gray-700 text-white w-1/4"
          />
          <button
            onClick={addPlayer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-1/4"
          >
            Ajouter
          </button>
        </div>
        <div className="mt-4 border p-4 rounded-lg bg-gray-700">
          <h3 className="text-lg font-semibold mb-2">Joueurs ajoutés</h3>
          {players.length === 0 ? (
            <p className="text-gray-400">Aucun joueur ajouté.</p>
          ) : (
            players.map((player, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border-b border-gray-600"
              >
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) =>
                    updatePlayer(index, e.target.value, player.rating)
                  }
                  className="bg-gray-700 text-white border p-1 rounded w-1/2"
                />
                <input
                  type="number"
                  value={player.rating}
                  onChange={(e) =>
                    updatePlayer(index, player.name, e.target.value)
                  }
                  className="bg-gray-700 text-white border p-1 rounded w-1/4"
                  min="0"
                  max="20"
                />
                <button
                  onClick={() => removePlayer(index)}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            ))
          )}
        </div>
        <button
          onClick={balanceTeams}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full mt-4"
        >
          Générer les équipes
        </button>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg mt-6">
        <h3 className="text-lg font-semibold mb-2">Équipes (max.10)</h3>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Nom de l'équipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="border p-2 rounded-md bg-gray-700 text-white w-3/4"
          />
          <button
            onClick={addTeam}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-1/4"
          >
            Ajouter
          </button>
        </div>
        {teams.map((team, index) => (
          <div
            key={index}
            className="p-4 border border-gray-600 rounded-lg mb-2"
          >
            <div className="flex justify-between items-center mb-2">
              <input
                type="text"
                value={team.name}
                onChange={(e) => updateTeamName(index, e.target.value)}
                className="bg-gray-700 text-white border p-1 rounded w-3/4"
              />
              <button
                onClick={() => removeTeam(index)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
            <div>
              {team.players.length === 0 ? (
                <p className="text-gray-400 text-center">Aucun joueur</p>
              ) : (
                team.players.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between p-2 border-b border-gray-600"
                  >
                    <span>{player.name}</span>
                    <span className="font-semibold">{player.rating}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
        <footer className="w-full text-center mt-6 p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            © 2025 - Erdal KARAER Tous droits réservés
          </p>
          <a
            href="https://github.com/ErdalKARAER/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            GitHub ErdalKARAER
          </a>
        </footer>
      </div>
    </div>
  );
};

export default TeamBalancer;
