export default function SectionHeading({ id, title, detail, action }) {
  return (
    <div className="section-heading">
      <div>
        <h2 id={id}>{title}</h2>
        {detail && <p>{detail}</p>}
      </div>
      {action}
    </div>
  );
}
