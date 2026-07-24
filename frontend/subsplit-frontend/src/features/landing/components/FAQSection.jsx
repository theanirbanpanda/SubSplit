import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { FAQS } from '../data/faq';
import styles from './FAQSection.module.scss';

function FAQItem({ question, answer, isExpanded, onToggle }) {
  return (
    <div className={`${styles.faqItem} ${isExpanded ? styles.faqItemExpanded : ''}`}>
      <button
        className={`${styles.faqQuestion} ${isExpanded ? styles.faqQuestionExpanded : ''}`}
        onClick={onToggle}
        type="button"
        aria-expanded={isExpanded}
      >
        <span>{question}</span>
        <span className={`${styles.faqIcon} ${isExpanded ? styles.faqIconExpanded : ''}`}>
          <Plus size={18} />
        </span>
      </button>
      <div className={`${styles.faqAnswer} ${isExpanded ? styles.faqAnswerExpanded : ''}`}>
        <p className={styles.faqAnswerContent}>{answer}</p>
      </div>
    </div>
  );
}

function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState(null);
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

  const handleToggle = useCallback((index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section
      id="faq"
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
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to know about SubSplit
          </p>
        </div>

        <div className={styles.faqGrid}>
          {FAQS.map((faq, index) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isExpanded={expandedIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
