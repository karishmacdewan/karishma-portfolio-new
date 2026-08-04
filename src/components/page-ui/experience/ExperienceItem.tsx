import { Reveal } from "@/components/ui/Reveal";

import styles from "./experience.module.scss";

import { TechStack } from "@/components/ui/TechStack";

interface Props {
  title: string;
  headline: string;
  time: string;
  location: string;
  description: string | string[];
  tech: string[];
}

export const ExperienceItem = ({ title, headline, time, location, description, tech }: Props) => {
  return (
    <div className={styles.experience}>
      <div className={styles.heading}>
        <Reveal>
          <span className={styles.title}>{title}</span>
        </Reveal>
        <Reveal>
          <span>{time}</span>
        </Reveal>
      </div>

      <div className={styles.heading}>
        <Reveal>
          <span className={styles.headline}>{headline}</span>
        </Reveal>
        {
          false && (
            <Reveal>
            <span>{location}</span>
          </Reveal>
          )
        }
      </div>
      <Reveal>
        {Array.isArray(description) ? (
          <ul className={styles.descriptionList}>
            {description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className={styles.description}>{description}</p>
        )}
      </Reveal>
      <TechStack technologies={tech} variant="chips" />
    </div>
  );
};
