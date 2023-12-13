import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import logo from '../logo/svg/logo.svg'
import { Navbar, Nav, NavDropdown, Container, Form, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../actions/userActions'

function Header() {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Get the history object from React Router

  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
  }

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Trim the search query to remove leading/trailing spaces
    const trimmedQuery = searchQuery.trim();

    if (trimmedQuery) {
      // Redirect to the search page with the query parameter
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
      <header>
        <Navbar expand="lg" className="fixed-top navbar-custom">
          <Container fluid>
            <LinkContainer to="/">
              <Navbar.Brand className="logo-container">
                <img src={logo} alt="logo" height="35"/>
              </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll" className="justify-content-between">
              <div className="search-box">
                <Form onSubmit={handleSearch} className="d-flex justify-content-center">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    autoComplete="off"
                    className="search-input"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update the searchQuery state
                  />
                  <Button className="btn btn-primary search-btn" type="submit"><i class="fas fa-search"></i></Button>
                </Form>
              </div>
              {userInfo ? (
                <Nav className="my-2 my-lg-0" style={{ maxHeight: '100px'}}>
                  <LinkContainer to="/upload_video">
                    <Nav.Link className="header-link header-link-icon" title="Upload video"><i className="far fa-plus header-icons"></i></Nav.Link>
                  </LinkContainer>
                  {/* <Nav.Link href="#action2" className="header-link header-link-icon" title="Notifications"><i className="far fa-bell header-icons"></i></Nav.Link> */}
                  <NavDropdown title={userInfo.username} id="navbarScrollingDropdown" className="header-link">
                    <LinkContainer to={userInfo.username}>
                      <NavDropdown.Item><i className="fa fa-user-circle header-icons pop-up-icons"></i> View profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/edit_profile">
                      <NavDropdown.Item><i className="fa fa-user-edit header-icons pop-up-icons"></i> Edit profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>
                    <i className="fa fa-right-from-bracket header-icons pop-up-icons"></i> Log out
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                ) : (
                  <Nav className="my-2 my-lg-0" style={{ maxHeight: '100px'}}>
                    <LinkContainer to="/login">
                      <Nav.Link>Log in</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/signup">
                      <Nav.Link>Sign up</Nav.Link>
                    </LinkContainer>
                  </Nav>
                )}
              
              
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
  )
}

export default Header