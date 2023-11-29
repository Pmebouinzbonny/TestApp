import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import OpcClientDashboard from '../../features/OpcClients/dashboard/OpcClientDashboard';


function App() {


  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '7em' }} >
        <OpcClientDashboard />

      </Container>
    </>
  );
}

export default App;
