import { useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    tema: "ansiedade",
    formato: "dica",
    tom: "acolhedor",
    especialidade: "",
    obs: "",
  });
  const [post, setPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [copiado, setCopiado] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setPost("");

    try {
      const response = await fetch(
        "https://vitalpost-server.onrender.com/api/gerar-post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.erro);
      setPost(data.post);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  function copiar() {
    navigator.clipboard.writeText(post);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <div className="container">
      <div className="header">
        <h1>VitalPost</h1>
        <p>Gere posts para o Instagram em segundos</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="field">
              <label>Tema</label>
              <select name="tema" value={form.tema} onChange={handleChange}>
                <option value="ansiedade">Ansiedade</option>
                <option value="autoestima">Autoestima</option>
                <option value="relacionamentos">Relacionamentos</option>
                <option value="burnout">Burnout</option>
                <option value="luto">Luto</option>
              </select>
            </div>
            <div className="field">
              <label>Formato</label>
              <select
                name="formato"
                value={form.formato}
                onChange={handleChange}
              >
                <option value="dica">Dica prática</option>
                <option value="reflexao">Reflexão</option>
                <option value="mito">Mito vs. realidade</option>
                <option value="pergunta">Pergunta para engajamento</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Tom</label>
            <select name="tom" value={form.tom} onChange={handleChange}>
              <option value="acolhedor">Acolhedor e empático</option>
              <option value="educativo">Educativo e claro</option>
              <option value="inspirador">Inspirador e motivador</option>
              <option value="direto">Direto ao ponto</option>
            </select>
          </div>

          <div className="field">
            <label>
              Abordagem <span>(opcional)</span>
            </label>
            <input
              type="text"
              name="especialidade"
              value={form.especialidade}
              onChange={handleChange}
              placeholder="Ex: TCC, psicanálise..."
            />
          </div>

          <div className="field">
            <label>
              Observação <span>(opcional)</span>
            </label>
            <textarea
              name="obs"
              value={form.obs}
              onChange={handleChange}
              placeholder="Ex: mencionar vagas abertas..."
            />
          </div>

          <button
            type="submit"
            className={`btn-primary ${loading ? "carregando" : ""}`}
            disabled={loading}
          >
            {loading ? "Gerando..." : "Gerar post"}
          </button>
        </form>
      </div>

      {erro && <div className="erro">{erro}</div>}

      {post && (
        <div className="result">
          <div className="result-header">
            <span>Post gerado</span>
            <button className="btn-copiar" onClick={copiar}>
              {copiado ? "Copiado!" : "Copiar"}
            </button>
          </div>
          <p className="post-texto">{post}</p>
        </div>
      )}
    </div>
  );
}

export default App;
