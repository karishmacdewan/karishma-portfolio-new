import React from 'react';
import { motion } from 'framer-motion';

const bounceAnimation = {
  y: [0, -5, 0, 3, -3, 0],
  transition: {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
  },
};

const fadeAnimation = {
  opacity: [1, 0.5, 1],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    repeatType: 'reverse',
  },
};

const Animated = ({ children }) => (
  <motion.span
    style={{
      display: 'inline-block',
      position: 'relative',
    }}
    whileHover={{
      color: '#ff0000',
    }}
  >
    <motion.span
      style={{
        display: 'inline-block',
        position: 'relative',
        color: '#ff0000',
      }}
      whileHover={fadeAnimation}
    >
      {children}
    </motion.span>
  </motion.span>
);

export const AnimatedText = ({ children, style }) => {
  const processChildren = (child) => {
    if (typeof child === 'string') {
      return child;
    } else if (React.isValidElement(child)) {
      if (child.type === 'animated') {
        return (
          <Animated key={child.key} style={style}>
            {child.props.children}
          </Animated>
        );
      }
      return React.cloneElement(child, {
        children: React.Children.map(child.props.children, processChildren),
      });
    } else {
      return child;
    }
  };

  return (
    <span style={{ display: 'inline', ...style }}>
      {React.Children.map(children, processChildren)}
    </span>
  );
};
