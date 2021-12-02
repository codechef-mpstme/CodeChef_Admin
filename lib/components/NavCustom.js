import { Navbar,Container,Form,Offcanvas,NavDropdown,FormControl,Button,Nav } from 'react-bootstrap';

export default function NavCustom({ isDashBoard,isUser })
{
    function logout()
    {
        localStorage.removeItem('user');
        window.location.href = '/';
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/Dashboard">CodeChef Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                    {isDashBoard ?
                        <Nav>
                            <Nav.Link href="/Add">Add Event</Nav.Link>
                        </Nav> 
                        : <Nav>
                            <Nav.Link href="/Dashboard">Dashboard</Nav.Link>
                        </Nav>
                        }
                    </Nav>
                    {isUser ? <Button variant="outline-danger" onClick={logout}>Logout</Button> : null}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}