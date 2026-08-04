// !delete
'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { AnimatedTitle } from '../ui/AnimatedTitle';
import { Reveal } from '../ui/Reveal';
import { TechStack } from '../ui/TechStack';
//import { animated } from '../ui/AnimatedText';
import { View } from '../ui/View/View';

export const ProfilePage = () => {
    return (
        <View>
            <div className="section-wrapper">
                <Reveal>
                    <AnimatePresence>
                        <motion.h1
                            id="experience"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1, type: 'spring', stiffness: 260, damping: 20 }}
                            className="section-wrapper mx-auto max-w-5xl px-8 pb-8 pt-20 text-2xl font-bold dark:text-white md:pt-32 md:text-7xl"
                        >
                            <AnimatedTitle text="Profile" />
                        </motion.h1>
                    </AnimatePresence>
                </Reveal>

                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '10em',
                        marginRight: '10em'
                    }}
                >
                    <Reveal>
                        <h1 style={{ fontSize: '5em' }}>Gaurav Dewan</h1>
                    </Reveal>
                </div>
                <AnimatePresence>
                    <motion.h1
                        id="experience"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 1, type: 'spring', stiffness: 260, damping: 20 }}
                        className="mx-auto max-w-5xl px-8 pb-8 pt-20 text-2xl font-bold dark:text-white md:pt-32 md:text-7xl"
                    >
                        <AnimatedTitle text="Skills" />
                    </motion.h1>
                </AnimatePresence>
                <div>
                    <TechStack />
                </div>
            </div>
        </View>
    );
};

//     <div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>

/*

            <AnimatedText style={{ fontSize: "3em" }}>
              I'm a software consultant specialized in <animated>full-stack AI projects</animated>, based in <animated>London</animated>. I
              have <animated>5+ years of experience</animated>, ranging from <animated>dashboards & front-ends</animated>, to deploying and
              scaling production-ready <animated>LLM applications</animated>.
            </AnimatedText>
*/
