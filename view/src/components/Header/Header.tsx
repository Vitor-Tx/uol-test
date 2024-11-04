import styled from 'styled-components';
import { Container, Row, Col } from 'react-bootstrap';

const HeaderContainer = styled.header`
  background-color: #333333;
  padding: 1.25rem 0;
  color: white;
  position: fixed;
  width: 100%;
`;

const Logo = styled.img`
  width: 80px;
  height: auto;
`;

const LogoTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Header() {
  return (
    <HeaderContainer>
      <Container>
        <Row>
          <Col>
            <LogoTitleWrapper>
              <Logo src="/images/logo.png" alt="UOL Logo" />
            </LogoTitleWrapper>
          </Col>
        </Row>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
