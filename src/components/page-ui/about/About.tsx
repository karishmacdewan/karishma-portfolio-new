import Link from 'next/link';
import { AiFillFilePdf, AiFillMail, AiOutlineArrowRight } from 'react-icons/ai';

import { MyLinks } from '@/components/ui/MyLinks/MyLinks';
import { OutlineButton } from '@/components/ui/OutlineButton/OutlineButton';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { TechStack } from '@/components/ui/TechStack';
import { EMAIL_URL, GAURAV_DEWAN_CV_FILENAME } from '@/consts';
import { FEATURED_TECHNOLOGIES } from '@/data/technologies';

import styles from './about.module.scss';

export const About = () => {
    return (
        <section id="about" className={`${styles.aboutSection} spotlight-section`}>
            <div className={styles.aboutIntro}>
                <SectionHeader title="about" dir="l" />
                <div className={styles.about}>
                    <div>
                        <Reveal>
                            <h1>Hello, I’m Gaurav</h1>
                        </Reveal>
                        <Reveal>
                            <h2 className={styles.coloredH2}>
                                <code>Full-Stack & AI Engineer</code>
                            </h2>
                        </Reveal>
                        <Reveal>
                            <h2>📍 London, UK</h2>
                        </Reveal>
                        <br />
                        <Reveal>
                            <div>
                                {false && (
                                    <p className={styles.aboutText}>
                                        I like to build <span className={styles.highlight1}>elegant [React] interfaces</span> on top of{' '}
                                        <span className={styles.highlight1}>robust [Python] backends</span>, often leveraging{' '}
                                        <span className={styles.highlight1}>cutting-edge AI</span> to create{' '}
                                        <span className={styles.highlight1}>powerful, innovative solutions</span>.
                                    </p>
                                )}
                                <p className={styles.aboutText}>My expertise:</p>
                                <ul className={styles.aboutText}>
                                    <li>
                                        • <span className={styles.highlight2}>6 years</span> as a full-stack developer
                                    </li>
                                    <li>
                                        • <span className={styles.highlight2}>3 years</span> specialising in AI engineering
                                    </li>
                                    <li>
                                        • Experience in <span className={styles.highlight2}>strategy consulting</span> and{' '}
                                        <span className={styles.highlight2}>project management</span>
                                    </li>
                                    <li>
                                        • <span className={styles.highlight2}>15+ projects</span> combining{' '}
                                        <span className={styles.highlight2}>Python</span> & <span className={styles.highlight2}>JavaScript</span>
                                    </li>
                                    <li>
                                        • Deep knowledge of <span className={styles.highlight2}>generative AI</span>, such as RAG, fine-tuning LLMs &
                                        quantisation
                                    </li>
                                    <li>
                                        • <span className={styles.highlight2}>Succesfully delivered projects</span> for{' '}
                                        <span className={styles.highlight2}>industry leaders</span> like{' '}
                                        <span className={styles.highlight2}>Spotify</span>
                                        {', '}
                                        <span className={styles.highlight2}>Deloitte</span> {' & '}
                                        <span className={styles.highlight2}>Stripe</span>
                                    </li>
                                    <li>
                                        • <span className={styles.highlight2}>Spearheaded 8 projects</span> as a{' '}
                                        <span className={styles.highlight2}>tech lead</span>
                                    </li>
                                </ul>
                                <p className={styles.aboutText}>
                                    If you’re looking for a <span className={styles.highlight1}>seasoned technical partner</span> who can bring your{' '}
                                    <span className={styles.highlight1}>vision to life</span>, let’s connect and explore how I can help you{' '}
                                    <span className={styles.highlight1}>build the future</span>.
                                </p>
                            </div>
                        </Reveal>
                        <Reveal>
                            <div className={styles.linksText}>
                                <span>my tools</span>
                                <AiOutlineArrowRight />
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>

            <div className={styles.toolsRegion}>
                <TechStack technologies={FEATURED_TECHNOLOGIES} variant="catalog" />
            </div>

            <div className={styles.aboutFooter}>
                <Reveal>
                    <div className={styles.links}>
                        <div className={styles.linksText}>
                            <span>my links</span>
                            <AiOutlineArrowRight />
                        </div>
                        <MyLinks />
                    </div>
                </Reveal>
                <br />
                <div className={`${styles.centered} ${styles.spacing}`}>
                    <Reveal>
                        <OutlineButton asChild size="small" icon={<AiFillFilePdf aria-hidden="true" />}>
                            <Link href={`/${GAURAV_DEWAN_CV_FILENAME}`} target="_blank" rel="noopener noreferrer">
                                Download CV
                            </Link>
                        </OutlineButton>
                    </Reveal>

                    <Reveal>
                        <OutlineButton asChild size="small" icon={<AiFillMail aria-hidden="true" />}>
                            <Link href={EMAIL_URL}>Send Email</Link>
                        </OutlineButton>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};
