import { Container, Menu } from 'semantic-ui-react';

export default function NavBar() {

    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src='/assets/logo.png' alt='logo' style={{marginRight: '10px'}}/>
                    Pester 
                </Menu.Item>
                <Menu.Item name='OPC Client' />
                <Menu.Item name='Settings'/>
               
            </Container>
        </Menu>

    )

}