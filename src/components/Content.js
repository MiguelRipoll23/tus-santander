import styled from "styled-components";

const ContentStyled = styled.main`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const View = (props) => {
  return <ContentStyled>{props.children}</ContentStyled>;
};

export default View;
