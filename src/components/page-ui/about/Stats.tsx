import { AiFillCode, AiFillSmile, AiFillDatabase } from 'react-icons/ai';

import { Reveal } from '@/components/ui/Reveal';

import styles from './stats.module.scss';

import { TechStack } from '@/components/ui/TechStack';

export const Stats = () => {
    return (
        <div className={styles.stats}>
            <Reveal>
                <div>
                    <h4>
                        <AiFillCode size="2.4rem" color="var(--brand)" />
                        <span>Front-End</span>
                    </h4>
                    <div className={styles.statGrid}>
                        <TechStack technologies={["React", "NextJS", "TailWind", "Redux", "React Native", "TypeScript", "HTML", "CSS"]}/>
                    </div>
                </div>
            </Reveal>
            <Reveal>
                <div className={styles.statColumn}>
                    <h4>
                        <AiFillDatabase size="2.4rem" color="var(--brand)" />
                        <span>Back-End</span>
                    </h4>
                    <div className={styles.statGrid}>
                        <TechStack technologies={["Python", "Django", "MongoDB", "PostgreSQL", "Docker", "GCP", "AWS", "Azure", "Firebase"]}/>
                    </div>
                </div>
            </Reveal>
            <Reveal>
                <div className={styles.statColumn}>
                    <h4>
                        <AiFillSmile size="2.4rem" color="var(--brand)" />
                        <span>AI</span>
                    </h4>
                    <div className={styles.statGrid}>
                        <TechStack technologies={["OpenAI", "LangChain", "pgvector", "DeepEval"]}/>
                    </div>
                </div>
            </Reveal>
        </div>
    );
};