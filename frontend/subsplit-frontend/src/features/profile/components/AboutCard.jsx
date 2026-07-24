import React from 'react';
import { Edit2 } from 'lucide-react';
import styles from './AboutCard.module.scss';

const AboutCard = ({ bio, tags, onEdit }) => {
  return (
    <div className={styles.card}>
      <div className={styles.headerRow}>
        <h2>About Me</h2>
        <button className={styles.editBtn} onClick={onEdit}>
          Edit <Edit2 />
        </button>
      </div>

      <p className={styles.bio}>
        {bio.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>

      <div className={styles.chipsRow}>
        {tags.map((tag, idx) => (
          <div key={idx} className={styles.chip}>{tag}</div>
        ))}
      </div>
    </div>
  );
};

export default AboutCard;
