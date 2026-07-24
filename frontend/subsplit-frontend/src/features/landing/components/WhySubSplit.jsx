import React, { useEffect, useRef, useState } from 'react';
import { FEATURES } from '../data/features';
import styles from './WhySubSplit.module.scss';

const FeatureCard = React.memo(function FeatureCard({ icon: Icon, title, description }) {
  return (
    <article className={styles.featureCard}>
      <div className={styles.featureIconBox}>
        <Icon size={26} />
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDesc}>{description}</p>
    </article>
  );
});

function WhySubSplit() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      className={styles.section}
      ref={sectionRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose SubSplit?</h2>
        </div>

        <div className={styles.featuresGrid}>
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhySubSplit;
