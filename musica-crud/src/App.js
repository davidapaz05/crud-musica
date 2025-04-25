import React, { useEffect, useState } from "react"; // Importei os hooks do React que preciso

// Aqui importo minhas funções de serviço que lidam com LocalStorage
import {
  buscarMusicas,
  adicionarMusica,
  atualizarMusica,
  excluirMusica,
} from "./musicaService";

// Aqui importo os componentes do React-Bootstrap que vou usar pra estilizar a interface
import { Container, Table, Button, Form, Row, Col } from "react-bootstrap";

function App() {
  // Crio o estado que guarda a lista de músicas carregadas do LocalStorage
  const [musicas, setMusicas] = useState([]);

  // Esse estado guarda os dados que o usuário digita no formulário
  const [form, setForm] = useState({
    nomeAutor: "",
    nomeMusica: "",
    nota: "",
  });

  // Aqui guardo o ID da música que estou editando (ou null se for uma nova)
  const [editandoId, setEditandoId] = useState(null);

  // Quando a tela carrega pela primeira vez, busco as músicas salvas no navegador
  useEffect(() => {
    setMusicas(buscarMusicas());
  }, []);

  // Essa função limpa os campos do formulário e cancela a edição
  const limparFormulario = () => {
    setForm({ nomeAutor: "", nomeMusica: "", nota: "" });
    setEditandoId(null);
  };

  // Essa função é chamada quando o formulário é enviado (submit)
  const salvar = (e) => {
    e.preventDefault(); // Evita que a página recarregue

    // Aqui crio um objeto com os dados do formulário
    const novaMusica = {
      nomeAutor: form.nomeAutor,
      nomeMusica: form.nomeMusica,
      nota: Number(form.nota), // Converto a nota de string pra número
    };

    // Se estou editando, atualizo a música existente
    if (editandoId) {
      atualizarMusica({ ...novaMusica, id: editandoId });
    } else {
      // Senão, adiciono uma nova música com ID automático
      adicionarMusica(novaMusica);
    }

    // Atualizo a lista de músicas na tela e limpo o formulário
    setMusicas(buscarMusicas());
    limparFormulario();
  };

  // Quando clico em "Editar", essa função preenche o formulário com os dados da música
  const editar = (musica) => {
    setForm({
      nomeAutor: musica.nomeAutor,
      nomeMusica: musica.nomeMusica,
      nota: String(musica.nota), // Volto pra string porque o input espera texto
    });
    setEditandoId(musica.id); // Salvo o ID que estou editando
  };

  // Quando clico em "Excluir", confirmo e removo a música da lista
  const excluir = (id) => {
    if (window.confirm("Deseja realmente excluir esta música?")) {
      excluirMusica(id);
      setMusicas(buscarMusicas()); // Atualizo a lista após exclusão
    }
  };

  return (
    // Container principal com fundo escuro e texto claro (modo noturno 🎵)
    <Container className="mt-5 p-4 rounded bg-dark text-light shadow">
      <h2 className="mb-4 text-center text-light">🎧 Gerenciador de Músicas</h2>

      {/* Formulário de cadastro e edição */}
      <Form onSubmit={salvar}>
        <Row>
          {/* Campo: Nome do Autor */}
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Autor</Form.Label>
              <Form.Control
                className="bg-secondary text-light border-0"
                type="text"
                required
                value={form.nomeAutor}
                onChange={(e) =>
                  setForm({ ...form, nomeAutor: e.target.value })
                }
              />
            </Form.Group>
          </Col>

          {/* Campo: Nome da Música */}
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Música</Form.Label>
              <Form.Control
                className="bg-secondary text-light border-0"
                type="text"
                required
                value={form.nomeMusica}
                onChange={(e) =>
                  setForm({ ...form, nomeMusica: e.target.value })
                }
              />
            </Form.Group>
          </Col>

          {/* Campo: Nota */}
          <Col md={2}>
            <Form.Group className="mb-3">
              <Form.Label>Nota (0 a 10)</Form.Label>
              <Form.Control
                className="bg-secondary text-light border-0"
                type="number"
                min="0"
                max="10"
                required
                value={form.nota}
                onChange={(e) => setForm({ ...form, nota: e.target.value })}
              />
            </Form.Group>
          </Col>

          {/* Botões: Adicionar / Atualizar e Cancelar */}
          <Col md={2} className="d-flex align-items-end">
            <div className="d-flex gap-2 w-100">
              <Button type="submit" variant="success" className="w-50">
                {editandoId ? "Atualizar" : "Adicionar"}
              </Button>

              {editandoId && (
                <Button
                  variant="secondary"
                  onClick={limparFormulario}
                  className="w-50"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Form>

      {/* Tabela de músicas cadastradas */}
      <Table
        striped
        bordered
        hover
        responsive
        variant="dark"
        className="text-center mt-4"
      >
        <thead className="table-secondary text-dark">
          <tr>
            <th>#</th>
            <th>Autor</th>
            <th>Música</th>
            <th>Nota</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {musicas.map((m, idx) => (
            <tr key={m.id}>
              <td>{idx + 1}</td>
              <td>{m.nomeAutor}</td>
              <td>{m.nomeMusica}</td>
              <td>{m.nota}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => editar(m)}>
                  Editar
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => excluir(m.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default App;
