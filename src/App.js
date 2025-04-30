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
  const [musicas, setMusicas] = useState([]);
  const [form, setForm] = useState({
    nomeAutor: "",
    nomeMusica: "",
    nota: "",
  });
  const [editandoId, setEditandoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setMusicas(buscarMusicas());
  }, []);

  const limparFormulario = () => {
    setForm({ nomeAutor: "", nomeMusica: "", nota: "" });
    setEditandoId(null);
  };

  const salvar = (e) => {
    e.preventDefault();
    const novaMusica = {
      nomeAutor: form.nomeAutor,
      nomeMusica: form.nomeMusica,
      nota: Number(form.nota),
    };

    if (editandoId) {
      atualizarMusica({ ...novaMusica, id: editandoId });
    } else {
      adicionarMusica(novaMusica);
    }

    setMusicas(buscarMusicas());
    limparFormulario();
  };

  const editar = (musica) => {
    setForm({
      nomeAutor: musica.nomeAutor,
      nomeMusica: musica.nomeMusica,
      nota: String(musica.nota),
    });
    setEditandoId(musica.id);
  };

  const excluir = (id) => {
    if (window.confirm("Deseja realmente excluir esta música?")) {
      excluirMusica(id);
      setMusicas(buscarMusicas());
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMusicas = musicas.filter((musica) =>
    musica.nomeMusica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-5 p-4 rounded bg-dark text-light shadow">
      <h2 className="mb-4 text-center text-light">🎧 Gerenciador de Músicas</h2>

      {/* Campo de pesquisa */}
      <Form.Group className="mb-4">
        <Form.Control
          type="text"
          placeholder="Pesquisar música pelo nome"
          value={searchTerm}
          onChange={handleSearch}
          className="bg-secondary text-light border-0"
        />
      </Form.Group>

      {/* Formulário de cadastro e edição */}
      <Form onSubmit={salvar}>
        <Row>
          <Col xs={12} md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Nome do Artista</Form.Label>
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

          <Col xs={12} md={4}>
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

          <Col xs={12} md={2}>
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

          <Col xs={12} md={2} className="d-flex align-items-end">
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
            <th>Artista</th>
            <th>Música</th>
            <th>Nota</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredMusicas.map((m, idx) => (
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