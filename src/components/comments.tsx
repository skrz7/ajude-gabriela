import type { AuthorizedComment } from "@/config/campaign";

export function Comments({ comments }: { comments: AuthorizedComment[] }) {
  const approved = comments.filter((comment) => comment.authorized && comment.verified && Number.isFinite(Date.parse(comment.publishedAt)));
  return <section className="mural-apoio" aria-labelledby="comentarios-titulo">
    <div className="mural-cab"><h2 id="comentarios-titulo">Comentários</h2></div>
    {approved.length ? <ul className="mural-lista">
      {approved.map((comment) => <li className="mural-item" key={comment.id}>
        <div className="mural-av" aria-hidden="true">{comment.author.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("")}</div>
        <div className="mural-bolha">
          <div className="mural-top"><span className="mural-nome">{comment.author}</span><time className="mural-hora" dateTime={comment.publishedAt}>{new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date(comment.publishedAt))}</time></div>
          <p className="mural-msg">{comment.text}</p>
        </div>
      </li>)}
    </ul> : <p className="comentarios-vazios">Os comentários serão publicados após confirmação e autorização de seus autores.</p>}
  </section>;
}
