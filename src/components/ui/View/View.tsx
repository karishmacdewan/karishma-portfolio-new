import React from 'react';
import styled from 'styled-components';

interface ViewProps {
    center?: boolean;
    padding?: number;
    children: React.ReactNode;
}
const styles = {
    view: (center: boolean) => `
      display: flex;
      flex-direction: column;
      align-items: ${center ? 'center' : 'flex-start'};
      justify-content: ${center ? 'center' : 'flex-start'};
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      pointer-events: none;
      //background-color: green;
    `,
    children: (padding: number | string | boolean) => `
      padding: ${typeof padding === 'number' ? `${padding}px` : padding === false ? '0' : '20%'};
      box-sizing: border-box;
      width: 100%;
  
      @media (max-width: 768px) {
        padding: ${typeof padding === 'number' ? `${padding / 2}px` : padding === false ? '0' : '10%'};
      }
  
      @media (max-width: 480px) {
        padding: ${typeof padding === 'number' ? `${padding / 4}px` : padding === false ? '0' : '5%'};
      }
    `
};

export const View: React.FC<ViewProps> = ({ center = false, padding = '20%', children }) => {
    return (
        <StyledView styles={styles.view(center)}>
            <StyledChildren styles={styles.children(padding)}>{children}</StyledChildren>
        </StyledView>
    );
};

const StyledView = styled.div<{ styles: string }>`
    ${({ styles }) => styles}
`;

const StyledChildren = styled.div<{ styles: string }>`
    ${({ styles }) => styles}
`;
