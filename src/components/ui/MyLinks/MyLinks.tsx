import { motion } from "framer-motion";
import Link from "next/link";
import { AiFillGithub, AiFillMail, AiFillLinkedin } from "react-icons/ai";
import { GITHUB_URL, LINKEDIN_URL, EMAIL_URL } from "../../../consts";

import styles from "./headinglinks.module.scss";

export const MyLinks = () => {
  return (
    <div className={styles.links}>
      <motion.span initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.0 }}>
        <Link href={LINKEDIN_URL} target="_blank" rel="nofollow">
          <AiFillLinkedin size="2.4rem" />
        </Link>
      </motion.span>

      <motion.span initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Link href={GITHUB_URL} target="_blank" rel="nofollow">
          <AiFillGithub size="2.4rem" />
        </Link>
      </motion.span>

      {false && (
        <motion.span initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Link href={EMAIL_URL} target="_blank" rel="nofollow">
            <AiFillMail size="2.4rem" />
          </Link>
        </motion.span>
      )}
    </div>
  );
};
