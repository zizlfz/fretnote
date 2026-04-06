import { NOTES } from '../utils/theory';
import './RootSelector.css';

export default function RootSelector({ root, onChange, mode, onModeChange }) {
  return (
    <div className="root-selector">
      <p className="section-label">Root note</p>
      <div className="root-buttons">
        {NOTES.map((note, i) => (
          <button
            key={note}
            className={`root-btn${i === root ? ' active' : ''}`}
            onClick={() => onChange(i)}
          >
            {note}
          </button>
        ))}
      </div>

      <div className="mode-toggle">
        <button
          className={`mode-btn${mode === 'major' ? ' active' : ''}`}
          onClick={() => onModeChange('major')}
        >
          Major
        </button>
        <button
          className={`mode-btn${mode === 'minor' ? ' active' : ''}`}
          onClick={() => onModeChange('minor')}
        >
          Minor
        </button>
      </div>
    </div>
  );
}
