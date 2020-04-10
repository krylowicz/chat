import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle` 
   *, *::before, *::after {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
   } 
   
   html {
    font-size: 62.5%;
   }
   
   body {
    font-family: ${({ theme }) => theme.font.jaf};
    margin: 0;
    padding: 0;
   }
`;

export default GlobalStyle
