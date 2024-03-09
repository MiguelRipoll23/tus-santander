import styled from "styled-components";

const ContentStyled = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: ${(props) =>
    props.paddingBottom === null ? "0" : props.paddingBottom};
  -webkit-overflow-scrolling: touch;
`;

const View = (props) => {
  return <ContentStyled paddingBottom={props.paddingBottom}>{props.children}</ContentStyled>;
};

export default View;
