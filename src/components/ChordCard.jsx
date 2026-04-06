import './ChordCard.css';

export default function ChordCard({ chord, isSelected, onSelect }) {
  const { name, degree, notes } = chord;

  return (
    <div
      className={`chord-card${isSelected ? ' chord-card--selected' : ''}`}
      onClick={onSelect}
    >
      <p className="chord-card__name">{name}</p>
      <p className="chord-card__degree">{degree}</p>
      <div className="chord-card__notes">
        {notes.map((note, i) => (
          <span key={i} className={`note-pill${i === 0 ? ' note-pill--root' : ''}`}>
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}
