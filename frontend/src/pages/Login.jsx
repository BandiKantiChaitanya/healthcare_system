import React, { useState } from 'react'
import { loginUser } from '../api/api'
import { useNavigate } from 'react-router-dom'

function Login() {
    let [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    
    let [err, setErr] = useState('')
    let [isLoading, setIsLoading] = useState(false)

    const navigate=useNavigate()

    function handleChange(e) {
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setErr('')
        setIsLoading(true)

        // console.log(formData)
    try {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const data = await loginUser(formData)

            if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("username", data.user.username);

            if (data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/staff");
            }
            } else {
            setErr({ message: data.message || "Invalid credentials" });
            }
    } catch (error) {
            setErr({ message: error.response?.data?.message || error.message || "Something went wrong" })
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #19A1B7 0%, #36C1D6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
             
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="card shadow-lg border-0" style={{
                            borderRadius: '20px',
                            overflow: 'hidden'
                        }}>

                               
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold" style={{color: '#2c3e50'}}>Welcome Back</h2>
                                <p className="text-muted">Sign in to access your dashboard</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label fw-semibold" style={{color: '#2c3e50'}}>
                                        Email Address
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0" style={{borderRadius: '10px 0 0 10px'}}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                <polyline points="22,6 12,13 2,6"/>
                                            </svg>
                                        </span>
                                        <input 
                                            className='form-control border-start-0 bg-light' 
                                            type="email" 
                                            name='email' 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            placeholder="Enter your email"
                                            required 
                                            style={{
                                                borderRadius: '0 10px 10px 0',
                                                padding: '12px',
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password" className='form-label fw-semibold' style={{color: '#2c3e50'}}>
                                        Password
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0" style={{borderRadius: '10px 0 0 10px'}}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                            </svg>
                                        </span>
                                        <input 
                                            className='form-control border-start-0 bg-light' 
                                            type="password" 
                                            name='password' 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            placeholder="Enter your password"
                                            required 
                                            style={{
                                                borderRadius: '0 10px 10px 0',
                                                padding: '12px',
                                                border: '1px solid #e0e0e0'
                                            }}
                                        />
                                    </div>
                                </div>

                                {err?.message && (
                                    <div className="alert alert-danger d-flex align-items-center" role="alert" style={{borderRadius: '10px'}}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="me-2">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                                        </svg>
                                        <span>{err.message}</span>
                                    </div>
                                )}

                                <button 
                                    type='submit'
                                    className="btn w-100 text-white fw-semibold py-3 mb-3" 
                                    disabled={isLoading}
                                    style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        borderRadius: '10px',
                                        border: 'none',
                                        fontSize: '1.05rem',
                                        transition: 'transform 0.2s',
                                        cursor: isLoading ? 'not-allowed' : 'pointer'
                                    }}
                                    onMouseOver={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {isLoading ? (
                                        <span>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>

                                <div className="text-center">
                                    <div className="card border-0 bg-light" style={{borderRadius: '10px'}}>
                                        <div className="card-body py-3">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2">
                                                <circle cx="12" cy="12" r="10"/>
                                                <path d="M12 16v-4M12 8h.01"/>
                                            </svg>
                                            <p className="mb-0 text-muted" style={{fontSize: '0.9rem'}}>
                                                Don't have an account?<br/>
                                                <strong style={{color: '#667eea'}}>Contact Administration</strong> for access
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        </div>
                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login