import { Reveal } from '@/components/ui/Reveal';

import styles from './header.module.scss';

interface Props {
    title: string;
    dir?: 'l' | 'r';
    showLine?: boolean;
    nowrap?: boolean;
}

export const SectionHeader = ({ title, dir = 'r', showLine = true, nowrap = false }: Props) => {
    return (
        <div className={styles.sectionHeader} style={{ flexDirection: dir === 'r' ? 'row' : 'row-reverse' }}>
            {showLine && <div className={styles.line} />}
            <h3>
                <Reveal>
                    <span className={`${styles.title} ${nowrap ? styles.nowrap : ''}`}>
                        {title}
                        <span>.</span>
                    </span>
                </Reveal>
            </h3>
        </div>
    );
};
