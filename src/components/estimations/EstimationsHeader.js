import styled from "styled-components";

const LineHeaderStyled = styled.div`
  padding-top: 18px;
  padding-left: 24px;
  padding-right: 24px;
  margin-bottom: 30px;
`;

const LineLabelIconGroupStyled = styled.div`
  display: block;
`;

const LineLabelStyled = styled.span`
  font-size: 32px;
  line-height: 24px;
`;

const RealTimeIcon = styled.span`
  font-family: icons;
  float: right;
  font-size: 22px;
`;

const LineDestinationStyled = styled.span`
  font-size: 22px;
`;

const LineHeader = (props) => {
  return (
    <LineHeaderStyled>
      <LineLabelIconGroupStyled>
        <LineLabelStyled>{props.label}</LineLabelStyled>
        <RealTimeIcon></RealTimeIcon>
      </LineLabelIconGroupStyled>
      <LineDestinationStyled>
        {props.destination.toUpperCase()}
      </LineDestinationStyled>
    </LineHeaderStyled>
  );
};

export default LineHeader;
