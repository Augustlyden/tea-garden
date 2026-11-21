import type { IssuesListProps } from "../../types/adminTypes";
import styles from "../../css/issues.module.css";
import { BadgeAlert } from "lucide-react";

export const IssuesList = ({ issues }: IssuesListProps) => {
  return (
    <div>
      <section className={styles.issuesContainer}>
        {issues.length === 0 ? (
          <div>
            <p>Inga öppna Issues</p>
          </div>  
        ) : (
          issues.map(i => (
            <article key={i.number} className={styles.card}>
              <a target="_blank" rel="noopener noreferrer" href={i.url} className={styles.cardLink}>
                <div className={styles.imgContainer}>
                  <BadgeAlert className={styles.img} strokeWidth={1.5} size={28} color='#C2412E'/>
                </div>

                <div className={styles.contentContainer}>
                  <div className={styles.headerInfo}>
                    <h2 className={styles.title}>{i.title}</h2>
                    <span className={styles.statusBadge}>
                      Issue #{i.number}
                    </span>
                  </div>
                </div>

                <div className={styles.authorInfo}>
                  <p className={styles.paragraph}> Skapad av: <span className={styles.span}>{i.author}</span></p>
                </div>
              </a>
            </article>
          ))
        )}
      </section>
    </div>
  );
};
