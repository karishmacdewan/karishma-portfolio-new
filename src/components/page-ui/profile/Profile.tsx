import { motion } from "framer-motion";
import Image from "next/image";

//import { StandardButton } from "@/components/buttons/StandardButton";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";

//import { DotGrid } from "./hero/DotGrid";
import styles from "./profile.module.scss";
//import ProfilePic from "@/public/gd.png";

const ProfilePic = "";

export const Profile = () => {
  return (
    <section className={`section-wrapper ${styles.hero}`}>
      <div className={styles.heroGrid}>
        <div className={styles.copyWrapper}>
          <Reveal>
            <h1 className={styles.title}>
              Hi, I&apos;m Gaurav<span>.</span>
            </h1>
          </Reveal>
          <Reveal>
            <h2 className={styles.subTitle}>
              I&apos;m a <span>Full-Stack Developer</span>
            </h2>
          </Reveal>
          <Reveal>
            <p className={styles.aboutCopy}>
              I&apos;ve spent the last 3 years building and scaling applications for some pretty cool companies and individuals. I also
              create interesting self projects on my spare time. Let&apos;s connect!
            </p>
          </Reveal>
          <Reveal>
            <Button onClick={() => document.getElementById("contact")?.scrollIntoView()}>Contact me</Button>
          </Reveal>
        </div>
        {false && (
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Image
              className={styles.profile}
              src={ProfilePic}
              priority
              alt="John Carlo Devera | Frontend Developer"
              width={250}
              height={250}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};
