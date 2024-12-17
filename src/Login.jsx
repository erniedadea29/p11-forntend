import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { jwtDecode } from 'jwt-decode';

import { API_ENDPOINT } from './Api';

function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const verifySession = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 > Date.now()) {
                        navigate('/dashboard');
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (err) {
                    console.error('Invalid token', err);
                    localStorage.removeItem('token');
                }
            }
        };

        verifySession();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!username || !password) {
            setError('Username and password are required');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${API_ENDPOINT}/auth/login`, {
                username,
                password,
            });

            localStorage.setItem('token', response.data.token);
            setError('');
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setError('Invalid username or password.');
                } else if (error.response.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('An error occurred. Please try again.');
                }
            } else {
                setError('Network error. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <>
            {/* Full-screen Background with Overlay */}
            <div
                style={{
                    backgroundImage: `url('https://pointblank.zepetto.com/images/common/og_image_phth.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    color: '#fff',
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                {/* Overlay to darken the background */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark transparent overlay
                    }}
                ></div>

                {/* Login Card */}
                <div
                    className="p-4 rounded"
                    style={{
                        backgroundColor: 'rgba(20, 20, 30, 0.85)', // Dark purple with transparency
                        boxShadow: '0 0 20px rgba(255, 0, 255, 0.5)', // Pink glowing shadow
                        zIndex: 2,
                        maxWidth: '400px',
                        width: '100%',
                    }}
                >
                    {/* Logo */}
                    <div className="text-center mb-4">
                        <h3 style={{ fontWeight: 'bold', letterSpacing: '2px' }}>POINT BLANK</h3>
                    </div>

                    {/* Login Form */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    border: '1px solid #777',
                                }}
                            />
                        </Form.Group>

                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    backgroundColor: '#333',
                                    color: '#fff',
                                    border: '1px solid #777',
                                }}
                            />
                        </Form.Group>

                        {/* Error Message */}
                        {error && <p className="text-danger">{error}</p>}

                        {/* Buttons */}
                        <Button
                            variant="outline-light"
                            type="submit"
                            className="w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log in Now'}
                        </Button>
                        <Button
                            variant="outline-secondary"
                            type="button"
                            className="w-100"
                            onClick={handleRegisterRedirect}
                        >
                            Register Account
                        </Button>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default Login;
