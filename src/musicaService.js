import { v4 as uuidv4 } from "uuid"; // Importo a lib uuid pra gerar IDs únicos

// Nome da chave onde vou armazenar os dados no LocalStorage
const STORAGE_KEY = "musicas";

// Função pra buscar todas as músicas do LocalStorage
export const buscarMusicas = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : []; // Retorno um array vazio se não tiver nada
};

// Salva a lista completa de músicas no LocalStorage
export const salvarMusicas = (musicas) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(musicas));
};

// Adiciona uma nova música à lista
export const adicionarMusica = (musica) => {
  const musicas = buscarMusicas(); // Pego as existentes
  musicas.push({ ...musica, id: uuidv4() }); // Crio um novo item com id único
  salvarMusicas(musicas); // Atualizo o LocalStorage
};

// Atualiza uma música já existente (pelo ID)
export const atualizarMusica = (musicaAtualizada) => {
  const musicas = buscarMusicas().map((m) =>
    m.id === musicaAtualizada.id ? musicaAtualizada : m
  );
  salvarMusicas(musicas);
};

// Remove uma música do LocalStorage
export const excluirMusica = (id) => {
  const musicas = buscarMusicas().filter((m) => m.id !== id);
  salvarMusicas(musicas);
};
